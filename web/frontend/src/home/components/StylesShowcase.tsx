/**
 * Galería de 24 estilos — la sección más "wow" del sitio. En desktop con
 * puntero fino: scroll vertical pineado que arrastra la fila horizontalmente
 * (GSAP ScrollTrigger) + distorsión WebGL en el card bajo el cursor
 * (ver DistortImage.tsx). En touch/mobile/reduced-motion: fila con scroll
 * horizontal nativo y snap, imágenes planas — sin WebGL ni scroll-jacking.
 */
import { createRef, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/shared/lib/gsap';
import { useFinePointer, useIsMobile, useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { DistortField } from '@/home/components/DistortImage';
import { content, styleImages } from '@/home/content';

export function StylesShowcase() {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const mobile = useIsMobile();
  const enhanced = fine && !mobile && !reduced;

  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const elRefs = useMemo(() => styleImages.map(() => createRef<HTMLDivElement>()), []);
  const hoverRefs = useMemo(
    () => styleImages.map(() => ({ current: false }) as RefObject<boolean>),
    []
  );

  // Las 24 texturas WebGL pesan ~6.6MB — se difieren hasta que la sección
  // esté por acercarse al viewport, en vez de bajarlas todas al cargar la home.
  const [nearView, setNearView] = useState(false);
  useEffect(() => {
    if (!enhanced || !sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '800px 0px' }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [enhanced]);

  useLayoutEffect(() => {
    if (!enhanced || !pinRef.current || !trackRef.current) return;
    ensureGsapRegistered();
    const track = trackRef.current;
    const pin = pinRef.current;

    const ctx = gsap.context(() => {
      const scrollDistance = track.scrollWidth - pin.clientWidth;
      if (scrollDistance <= 0) return;

      gsap.to(track, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${scrollDistance}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => {
      window.removeEventListener('load', onLoad);
      ctx.revert();
    };
  }, [enhanced]);

  return (
    <section id="styles" ref={sectionRef} className="dl-section dl-styles">
      <div className="dl-container dl-styles__head">
        <div className="dl-section-head">
          <span className="dl-eyebrow">{content.styles.eyebrow}</span>
          <span className="dl-section-head__line" />
          <span className="dl-section-head__dot" />
        </div>
        <h2 className="dl-h1">{content.styles.title}</h2>
        {content.styles.tagline.map((line) => (
          <p key={line} className="dl-body-lg dl-muted">
            {line}
          </p>
        ))}
      </div>

      <div ref={pinRef} className={`dl-styles__viewport${enhanced ? ' dl-styles__viewport--pinned' : ''}`}>
        {enhanced && nearView && <DistortField images={styleImages} elRefs={elRefs} hoverRefs={hoverRefs} />}
        <div ref={trackRef} className={`dl-styles__track${enhanced ? '' : ' dl-styles__track--scroll'}`}>
          {styleImages.map((src, i) => (
            <div
              key={src}
              ref={elRefs[i]}
              className="dl-style-card"
              onMouseEnter={() => {
                hoverRefs[i].current = true;
              }}
              onMouseLeave={() => {
                hoverRefs[i].current = false;
              }}
            >
              <img
                src={src}
                alt={`Estilo de sitio web N°${i + 1}`}
                loading="lazy"
                decoding="async"
                className={
                  enhanced && nearView ? 'dl-style-card__img dl-style-card__img--ghost' : 'dl-style-card__img'
                }
              />
              <span className="dl-style-card__badge">Estilo N°{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
