/**
 * Scroll suave global (Lenis). Intercepta anclas #… para desplazarse con
 * inercia y respeta prefers-reduced-motion. Portado de zoocial
 * (web/frontend/src/shared/components/SmoothScroll.tsx), simplificado para
 * un sitio de una sola página (sin lógica de reset por cambio de ruta).
 */
import { useEffect, useRef, type ReactNode } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

function scrollLenisTo(
  lenis: { scrollTo: (t: HTMLElement | number, opts?: object) => void },
  target: HTMLElement,
  duration: number
) {
  lenis.scrollTo(target, {
    offset: 0,
    duration,
    force: true,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
  });
}

function SmoothScrollEffects() {
  const lenis = useLenis();
  const firstRun = useRef(true);

  useEffect(() => {
    if (!lenis) return;

    const hash = window.location.hash;
    if (firstRun.current) {
      firstRun.current = false;
      if (hash) {
        const el = document.querySelector(hash);
        if (el) requestAnimationFrame(() => scrollLenisTo(lenis, el as HTMLElement, 0));
      }
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const el = document.querySelector(href);
      if (!el) return;

      event.preventDefault();
      scrollLenisTo(lenis, el as HTMLElement, 1.35);
      history.replaceState(null, '', href);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.07,
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.05,
        syncTouch: false,
        allowNestedScroll: true,
      }}
    >
      <SmoothScrollEffects />
      {children}
    </ReactLenis>
  );
}
