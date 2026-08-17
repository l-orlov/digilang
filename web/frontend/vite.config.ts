import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createHash } from 'crypto';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const ASSETS_JS  = 'assets/js';
const ASSETS_CSS = 'assets/css';

function versionHashPlugin(): Plugin {
  return {
    name: 'version-hash',
    closeBundle() {
      const outDir    = resolve(__dirname, '../public');
      const jsDir     = resolve(outDir, ASSETS_JS);
      const cssDir    = resolve(outDir, ASSETS_CSS);
      const indexPath = resolve(outDir, 'index.html');

      const hash = (buf: Buffer) =>
        createHash('md5').update(buf).digest('hex').slice(0, 8);

      // Step 1: content hashes of ORIGINAL files (before any modification)
      const jsFiles = readdirSync(jsDir).filter((f: string) => f.endsWith('.js'));
      const origHashes = new Map<string, string>();
      for (const f of jsFiles)
        origHashes.set(f, hash(readFileSync(resolve(jsDir, f))));

      // Step 2: patch each JS file — add ?v= to every inter-chunk reference
      for (const f of jsFiles) {
        let code = readFileSync(resolve(jsDir, f), 'utf-8');

        // static imports:  from"./module.js"
        code = code.replace(/\bfrom(["'])(\.\/[^"'?]+\.js)\1/g, (m, q, path) => {
          const h = origHashes.get(path.slice(2));
          return h ? `from${q}${path}?v=${h}${q}` : m;
        });

        // dynamic imports:  import("./module.js") or import(`./module.js`)
        code = code.replace(/\bimport\((["'`])(\.\/[^"'`?]+\.js)\1\)/g, (m, q, path) => {
          const h = origHashes.get(path.slice(2));
          return h ? `import(${q}${path}?v=${h}${q})` : m;
        });

        // __vite__mapDeps preload list:  "assets/js/module.js"
        const mapDepsRe = new RegExp(`"(${ASSETS_JS}/([^"?]+\\.js))"`, 'g');
        code = code.replace(mapDepsRe, (m, path, name) => {
          const h = origHashes.get(name);
          return h ? `"${path}?v=${h}"` : m;
        });

        writeFileSync(resolve(jsDir, f), code);
      }

      // Step 3: hashes of MODIFIED files
      const modHashes = new Map<string, string>();
      for (const f of jsFiles)
        modHashes.set(f, hash(readFileSync(resolve(jsDir, f))));

      // Step 4: second pass — replace ?v=origHash with ?v=modHash everywhere in JS files
      for (const f of jsFiles) {
        let code = readFileSync(resolve(jsDir, f), 'utf-8');
        let changed = false;
        for (const [name, origH] of origHashes) {
          const modH = modHashes.get(name)!;
          if (origH !== modH) {
            const next = code.replaceAll(`?v=${origH}`, `?v=${modH}`);
            if (next !== code) { code = next; changed = true; }
          }
        }
        if (changed) writeFileSync(resolve(jsDir, f), code);
      }

      // Step 5: update index.html
      let html = readFileSync(indexPath, 'utf-8');

      const jsRe  = new RegExp(`/${ASSETS_JS}/([^"'\\s?]+\\.js)`, 'g');
      const cssRe = new RegExp(`/${ASSETS_CSS}/([^"'\\s?]+\\.css)`, 'g');

      html = html.replace(jsRe, (m, name) => {
        const h = modHashes.get(name);
        return h ? `/${ASSETS_JS}/${name}?v=${h}` : m;
      });

      html = html.replace(cssRe, (_m, name) => {
        const h = hash(readFileSync(resolve(cssDir, name)));
        return `/${ASSETS_CSS}/${name}?v=${h}`;
      });

      writeFileSync(indexPath, html);
    },
  };
}

export default defineConfig({
  plugins: [react(), versionHashPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: '../public',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `${ASSETS_JS}/[name].js`,
        chunkFileNames: `${ASSETS_JS}/[name].js`,
        assetFileNames: (info) =>
          info.name?.endsWith('.css')
            ? `${ASSETS_CSS}/[name][extname]`
            : 'assets/img/[name][extname]',
        manualChunks(id) {
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router')
          ) {
            return 'vendor-react';
          }
        },
      },
    },
  },
});
