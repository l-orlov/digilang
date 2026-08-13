/**
 * Muro de logos de clientes en marquee infinito (CSS puro, se pausa en
 * hover). En hover/click se revela un overlay con link — en touch, el click
 * alterna el overlay (cierra al tocar afuera o Escape).
 */
import { useEffect, useRef, useState } from 'react';
import { RevealOnScroll } from '@/shared/components/RevealOnScroll';
import { MagneticButton } from '@/shared/components/MagneticButton';
import { content, clients, type ClientItem } from '@/home/content';

function ClientCard({ client, uid }: { client: ClientItem; uid: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <li
      ref={ref}
      className={`dl-client-card${open ? ' is-open' : ''}`}
      onClick={() => setOpen((v) => !v)}
      data-cursor-hover
    >
      <img src={client.img} alt={client.name} loading="lazy" decoding="async" />
      <div className="dl-client-card__overlay" aria-hidden={!open}>
        <span className="dl-h3">{client.name}</span>
        <a href={client.url} target="_blank" rel="noopener" className="dl-btn dl-btn--outline dl-btn--sm">
          {content.clients.cardBtn}
        </a>
      </div>
      <span className="dl-visually-hidden" id={uid}>
        {client.name}
      </span>
    </li>
  );
}

export function Clients() {
  const loop = [...clients, ...clients];

  return (
    <section id="clients" className="dl-section dl-clients">
      <div className="dl-container">
        <div className="dl-section-head">
          <span className="dl-eyebrow">{content.clients.eyebrow}</span>
          <span className="dl-section-head__line" />
          <span className="dl-section-head__dot" />
        </div>

        <RevealOnScroll className="dl-clients__intro">
          <h2 className="dl-h1">{content.clients.title}</h2>
          <p className="dl-body-lg dl-muted">{content.clients.sub}</p>
          <MagneticButton>
            <a href="#contacts" className="dl-btn dl-btn--primary">
              {content.clients.cta}
            </a>
          </MagneticButton>
        </RevealOnScroll>
      </div>

      <div className="dl-clients__marquee">
        <ul className="dl-clients__track">
          {loop.map((client, i) => (
            <ClientCard key={`${client.name}-${i}`} client={client} uid={`client-${i}`} />
          ))}
        </ul>
      </div>
    </section>
  );
}
