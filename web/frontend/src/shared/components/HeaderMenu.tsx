/**
 * Reemplaza a los dos botones sueltos (AudioToggle en una esquina,
 * LanguageToggle en la otra, siempre visibles) por uno solo, tipo
 * "hamburguesa", centrado arriba — al tocarlo despliega un panel angosto
 * con ambos controles. Menos elementos flotando de entrada sobre el
 * objeto 3D, y libera las esquinas para la nav/wordmark de CoreJourney.tsx.
 *
 * AudioToggle y LanguageToggle no cambiaron por dentro (mismos hooks,
 * mismo SVG/label) — solo dejaron de posicionarse solas (`position: fixed`
 * propio) para vivir adentro de `.dl-header-menu__panel`, que es la que
 * ahora se posiciona.
 */
import { useEffect, useRef, useState } from 'react';
import { AudioToggle } from '@/shared/components/AudioToggle';
import { LanguageToggle } from '@/shared/components/LanguageToggle';

export function HeaderMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Cerrar al tocar/clickear afuera — un menú que solo se cierra tocando el
  // mismo botón otra vez se siente atascado.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="dl-header-menu">
      <button
        type="button"
        className={`dl-header-menu__button${open ? ' dl-header-menu__button--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      >
        <span />
        <span />
        <span />
      </button>
      {open && (
        <div className="dl-header-menu__panel">
          <AudioToggle />
          <LanguageToggle />
        </div>
      )}
    </div>
  );
}
