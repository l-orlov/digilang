/**
 * Sección de apertura del sitio: un "viaje" de scroll — la cámara se acerca
 * al cristal y se asienta en su centro. Adentro, la disciplina la elige la
 * nav (click), no el scroll. Ya no hay fase de "outro" / seguir scrolleando
 * para salir: el recorrido termina al entrar.
 *
 * Los títulos de cada disciplina son HTML (como en digilang.vercel.app).
 */
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ensureGsapRegistered, ScrollTrigger } from '@/shared/lib/gsap';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { CoreScene, APPROACH_END } from '@/home/components/CoreScene';
import { useLanguage } from '@/shared/lib/language';

const INSIDE_START = APPROACH_END;
/** Todo el scrub mapea 0→1 a 0→SETTLED: alcanza a terminar el scale-up del
 * Crystal (~CROSSFADE_END+0.06) para que el low-poly llene el FOV. */
const SETTLED = APPROACH_END + 0.14;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function CoreJourney() {
  const reduced = useReducedMotion();
  const enhanced = !reduced;
  const { content } = useLanguage();

  const sectionRef = useRef<HTMLElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const facetRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const activeFacetRef = useRef(0);
  const [activeFacet, setActiveFacetState] = useState(0);

  const facets = content.journey.facets;
  const active = facets[activeFacet] ?? facets[0];

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
      end: '+=1100',
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress * SETTLED;
        progressRef.current = p;

        if (hintRef.current) {
          hintRef.current.style.opacity = p < 0.04 ? String(1 - p / 0.04) : '0';
        }

        const insideT = clamp01((p - INSIDE_START) / 0.05);
        if (facetRef.current) {
          facetRef.current.style.opacity = String(insideT);
          facetRef.current.style.transform = `translateY(${(1 - insideT) * 12}px)`;
        }

        if (navRef.current) {
          navRef.current.style.opacity = String(insideT);
        }
      },
    });

    return () => trigger.kill();
  }, [enhanced]);

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
      <CoreScene progressRef={progressRef} activeFacetRef={activeFacetRef} facetCount={facets.length} />
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
        <div ref={facetRef} className="dl-journey__panel dl-journey__facet" aria-live="polite">
          <p className="dl-journey__facet-eyebrow">{active.eyebrow}</p>
          <h2 key={active.eyebrow} className="dl-journey__facet-line">
            {active.line}
          </h2>
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
