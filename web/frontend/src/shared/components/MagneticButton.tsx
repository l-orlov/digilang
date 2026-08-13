/**
 * Envoltorio que atrae su contenido hacia el cursor cuando pasa cerca
 * (efecto "magnético" típico de sitios awwwards). Se desactiva en touch.
 */
import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '@/shared/lib/gsap';
import { useFinePointer } from '@/shared/hooks/useReducedMotion';

export function MagneticButton({ children, className }: { children: ReactNode; className?: string }) {
  const fine = useFinePointer();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !fine) return;

    const strength = 0.4;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out' });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [fine]);

  return (
    <div ref={wrapRef} className={`dl-magnetic${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}
