/**
 * English copy — solo `journey` está traducido de verdad (es lo único que
 * se ve hoy en el sitio, ver HomePage.tsx). El resto de las secciones
 * (styles/clients/timeline/footer) están comentadas/sin usar ahí, así que
 * quedan en español como placeholder hasta que vuelvan a la página.
 */
import type { Content } from '@/home/content';
import { content as es } from '@/home/content.es';

export const content: Content = {
  ...es,
  journey: {
    approach: {
      hint: 'Scroll to discover more',
    },
    intro: {
      title: "DigiLang's digital core",
      sub: "Every facet of this crystal is one of the studio's disciplines.",
    },
    facets: [
      { eyebrow: 'Design', line: 'Interfaces that feel inevitable.' },
      { eyebrow: 'Development', line: 'Code that holds up what you imagine.' },
      { eyebrow: 'Automation', line: "Bots that work while you don't." },
      { eyebrow: 'SEO', line: "Visibility that's earned, not bought." },
      { eyebrow: 'DevOps', line: "Infrastructure that doesn't go down at 3am." },
      { eyebrow: 'Strategy', line: 'From idea to business, without friction.' },
    ],
    outro: {
      title: "You've left the core.",
      sub: "This is what we do in there. Let's talk about yours.",
    },
  },
};
