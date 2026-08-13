/**
 * Envoltorio genérico de scroll-reveal: al entrar en viewport, el contenido
 * aparece con fade + rise. Con `stagger`, anima los hijos directos en
 * cascada (para grids de cards). Respeta prefers-reduced-motion.
 */
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, ensureGsapRegistered } from '@/shared/lib/gsap';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  y?: number;
  delay?: number;
}

export function RevealOnScroll({ children, className, stagger = false, y = 36, delay = 0 }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    ensureGsapRegistered();

    const targets = stagger ? Array.from(ref.current.children) : ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: 'power3.out',
          stagger: stagger ? 0.12 : 0,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [reduced, stagger, y, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export { ScrollTrigger };
