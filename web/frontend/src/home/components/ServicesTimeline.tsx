/**
 * Sección de servicios: se pinea y, a medida que el usuario sigue
 * scrolleando, los 6 ítems se van iluminando uno a uno (timeline scrubbed
 * por ScrollTrigger), terminando con el CTA de cierre. En touch/mobile/
 * reduced-motion no se pinea: se muestra todo ya visible, en columna.
 */
import { useLayoutEffect, useRef } from 'react';
import { ensureGsapRegistered, gsap } from '@/shared/lib/gsap';
import { useFinePointer, useIsMobile, useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { MagneticButton } from '@/shared/components/MagneticButton';
import { Logo } from '@/shared/components/Logo';
import { content } from '@/home/content';

export function ServicesTimeline() {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const mobile = useIsMobile();
  const enhanced = fine && !mobile && !reduced;

  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!enhanced || !sectionRef.current || !listRef.current || !ctaRef.current) return;
    ensureGsapRegistered();

    const items = Array.from(listRef.current.children);
    const cta = ctaRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${items.length * 450}`,
          scrub: 0.6,
          pin: true,
        },
      });

      tl.to(items, { opacity: 1, color: '#ffffff', stagger: 1, duration: 1 }, 0).to(
        cta,
        { opacity: 1, y: 0, duration: 1 },
        items.length
      );
    });

    return () => ctx.revert();
  }, [enhanced]);

  return (
    <section id="services" ref={sectionRef} className="dl-section dl-timeline">
      <div className="dl-container dl-timeline__inner">
        <Logo withText={false} size={56} className="dl-timeline__logo" />

        <ul ref={listRef} className={`dl-timeline__list${enhanced ? '' : ' dl-timeline__list--static'}`}>
          {content.timeline.items.map((item) => (
            <li key={item} className="dl-timeline__item">
              {item}
            </li>
          ))}
        </ul>

        <div ref={ctaRef} className={`dl-timeline__cta${enhanced ? '' : ' dl-timeline__cta--static'}`}>
          <p className="dl-h2">{content.timeline.ctaTitle}</p>
          <MagneticButton>
            <a href="#contacts" className="dl-btn dl-btn--primary">
              {content.timeline.ctaBtn}
            </a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
