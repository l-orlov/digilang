/**
 * Cursor personalizado: un punto que sigue al mouse con un pequeño lag y
 * crece al pasar sobre elementos interactivos. Se desactiva por completo en
 * touch/pointer grueso (useFinePointer) para no interferir en mobile.
 */
import { useEffect, useRef } from 'react';
import { useFinePointer } from '@/shared/hooks/useReducedMotion';

const HOVER_SELECTOR = 'a, button, [data-cursor-hover]';

export function Cursor() {
  const fine = useFinePointer();
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!fine) return;

    document.body.classList.add('dl-custom-cursor');
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.(HOVER_SELECTOR);
      dotRef.current?.classList.toggle('dl-cursor--hover', Boolean(el));
    };

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.2;
      pos.current.y += (target.current.y - pos.current.y) * 0.2;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    raf = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove('dl-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, [fine]);

  if (!fine) return null;

  return <div ref={dotRef} className="dl-cursor" aria-hidden="true" />;
}
