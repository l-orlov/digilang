/**
 * Pantalla de carga breve al entrar: espera a que las fuentes (Tektur/
 * Barlow, ya precargadas en index.html) estén listas + un mínimo de tiempo
 * para que la animación de marca se note, y recién ahí revela la página y
 * dispara el reveal del hero (vía ReadyContext) — así no hay “pop” de
 * fuentes ni texto saltando mientras el usuario ya está interactuando.
 *
 * A propósito NO espera las 24 imágenes de la galería de estilos ni las de
 * clientes (~7MB): eso haría el loader lento en vez de rápido. Esas se
 * cargan de forma diferida cuando su sección se acerca al viewport (ver
 * StylesShowcase).
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { Logo } from '@/shared/components/Logo';

const ReadyContext = createContext(true);

export function useReady() {
  return useContext(ReadyContext);
}

const MIN_MS = 900;
const SAFETY_TIMEOUT_MS = 3000;

export function Preloader({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced) {
      setReady(true);
      return;
    }

    document.body.style.overflow = 'hidden';
    const start = performance.now();
    let raf = 0;

    const tick = () => {
      const elapsed = performance.now() - start;
      setProgress(Math.min(96, (elapsed / MIN_MS) * 100));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const safety = new Promise((resolve) => setTimeout(resolve, SAFETY_TIMEOUT_MS));

    Promise.race([fontsReady, safety]).then(() => {
      const remaining = Math.max(0, MIN_MS - (performance.now() - start));
      setTimeout(() => {
        cancelAnimationFrame(raf);
        setProgress(100);
        setTimeout(() => setReady(true), 250);
      }, remaining);
    });

    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  useEffect(() => {
    if (ready) document.body.style.overflow = '';
  }, [ready]);

  return (
    <ReadyContext.Provider value={ready}>
      {!reduced && (
        <div className={`dl-preloader${ready ? ' dl-preloader--done' : ''}`} aria-hidden={ready}>
          <Logo withText={false} size={44} />
          <div className="dl-preloader__bar">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      {children}
    </ReadyContext.Provider>
  );
}
