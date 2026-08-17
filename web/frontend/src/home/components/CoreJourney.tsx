/**
 * Sección de apertura del sitio: en vez de un hero con texto, un "viaje" de
 * scroll — la cámara se acerca al cristal facetado, se asienta en su centro
 * y ahí se queda (nunca vuelve a salir). Adentro, a qué cara/disciplina
 * mira la cámara ya NO lo decide el scroll (girar en cada pixel de scroll
 * mareaba) sino una nav de botones: clickear una disciplina hace que la
 * cámara gire suavemente hacia ella (`activeFacetRef`, leído por
 * `CameraRig` en CoreScene.tsx). El scroll sigue sirviendo para acercarse,
 * mantener la sección pineada, y — al final del recorrido — liberar el pin
 * hacia el resto de la página.
 *
 * El progreso (0..1) de un único ScrollTrigger pineado se escribe en un ref
 * (`progressRef`) que `CoreScene` lee cada frame para mover la cámara — así
 * evitamos pelear entre el loop de r3f y los callbacks de GSAP. Ese mismo
 * progreso, acá, controla de forma imperativa (sin re-render por frame) el
 * fade del hint inicial, de la nav y del outro — pero YA NO qué panel se
 * ve: eso ahora es estado de React (`activeFacet`), actualizado por click.
 *
 * El pin + cámara viajando también corre en touch/mobile (el pin de
 * ScrollTrigger sigue la posición real de scroll, sea cual sea el input que
 * la mueva) — solo se cae al fallback estático con `prefers-reduced-motion`.
 * Lo único que de verdad no traduce a touch es arrastrar el cristal con el
 * dedo para girarlo a mano: ese gesto es indistinguible de "swipe para
 * scrollear" sobre el mismo canvas que cubre toda la sección, así que se
 * desactiva puntualmente ahí (ver `draggable` en CoreScene.tsx) — el resto
 * (giro automático, journey por scroll, nav por click/tap) es igual.
 */
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ensureGsapRegistered, ScrollTrigger } from '@/shared/lib/gsap';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { CoreScene, APPROACH_END, INSIDE_END } from '@/home/components/CoreScene';
import { useLanguage } from '@/shared/lib/language';

const INSIDE_START = APPROACH_END;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function CoreJourney() {
  const reduced = useReducedMotion();
  const enhanced = !reduced;
  const { content } = useLanguage();

  const sectionRef = useRef<HTMLElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const activeFacetRef = useRef(0);
  const [activeFacet, setActiveFacetState] = useState(0);

  const facets = content.journey.facets;

  const goToFacet = (i: number) => {
    const wrapped = (i + facets.length) % facets.length;
    activeFacetRef.current = wrapped;
    setActiveFacetState(wrapped);
  };

  useLayoutEffect(() => {
    if (!enhanced || !sectionRef.current) return;
    ensureGsapRegistered();

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: `+=${(facets.length + 1) * 900}`,
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;

        if (hintRef.current) {
          hintRef.current.style.opacity = p < 0.04 ? String(1 - p / 0.04) : '0';
        }

        const outroT = clamp01((p - INSIDE_END) / (1 - INSIDE_END));
        if (outroRef.current) {
          outroRef.current.style.opacity = String(outroT);
          outroRef.current.style.transform = `translateY(${(1 - outroT) * 16}px)`;
        }

        if (navRef.current) {
          const navIn = clamp01((p - INSIDE_START) / 0.05);
          navRef.current.style.opacity = String(navIn * (1 - outroT));
        }
      },
    });

    return () => trigger.kill();
  }, [enhanced, facets.length]);

  const fallbackFacets = useMemo(() => facets, [facets]);

  if (!enhanced) {
    return (
      <section id="journey" className="dl-section dl-journey dl-journey--fallback">
        <div className="dl-container dl-journey__fallback">
          <img src="/img/logo-mark.png" alt="" className="dl-journey__fallback-mark" />
          <h1 className="dl-h1">{content.journey.intro.title}</h1>
          <p className="dl-body-lg dl-muted">{content.journey.intro.sub}</p>

          <div className="dl-journey__fallback-list">
            {fallbackFacets.map((f) => (
              <div key={f.eyebrow} className="dl-card dl-journey__fallback-card">
                <span className="dl-eyebrow">{f.eyebrow}</span>
                <p className="dl-h3">{f.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="journey" ref={sectionRef} className="dl-journey" data-cursor-hover>
      <CoreScene
        progressRef={progressRef}
        activeFacetRef={activeFacetRef}
        facetCount={facets.length}
        facets={facets}
      />
      <div className="dl-journey__overlay" />

      <div className="dl-journey__brand">
        <span>DigiLang</span>
        <span className="dl-journey__brand-dim">.pro</span>
      </div>

      <div ref={hintRef} className="dl-journey__hint">
        <span className="dl-journey__hint-mouse">
          <span className="dl-journey__hint-dot" />
        </span>
        <span>{content.journey.approach.hint}</span>
      </div>

      <div className="dl-journey__panels">
        <div ref={outroRef} className="dl-journey__panel dl-journey__outro">
          <p className="dl-h1">{content.journey.outro.title}</p>
          <p className="dl-body-lg dl-muted">{content.journey.outro.sub}</p>
        </div>
      </div>

      <div ref={navRef} className="dl-journey__nav">
        <div className="dl-journey__nav-items">
          {facets.map((f, i) => (
            <button
              key={f.eyebrow}
              type="button"
              className={`dl-journey__nav-item${i === activeFacet ? ' dl-journey__nav-item--active' : ''}`}
              onClick={() => goToFacet(i)}
            >
              {f.eyebrow}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
