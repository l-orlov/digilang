/**
 * Footer/contacto: formulario (nombre/teléfono/mensaje) que arma un link
 * de wa.me con el mensaje precargado — sin backend, igual que el sitio
 * anterior (ver web/legacy-php/js/form.js), pero corrigiendo el desajuste
 * de ids que tenía ese script (footerSend no existía).
 */
import { useRef, type FormEvent } from 'react';
import { Logo } from '@/shared/components/Logo';
import { content } from '@/home/content';

const NAV_LINKS = [
  { href: '#about', label: 'Nosotros' },
  { href: '#styles', label: 'Estilos' },
  { href: '#clients', label: 'Clientes' },
];

export function ContactFooter() {
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value.trim();
    const phone = phoneRef.current?.value.trim();
    const message = messageRef.current?.value.trim();

    let text = '';
    if (name) text += `Nombre: ${name}\n`;
    if (phone) text += `Teléfono: ${phone}\n`;
    if (message) text += `\n${message}`;

    window.location.href = `${content.footer.whatsappUrl}?text=${encodeURIComponent(text)}`;
  };

  return (
    <footer id="contacts" className="dl-footer">
      <div className="dl-container dl-footer__inner">
        <div className="dl-card dl-footer__card">
          <span className="dl-eyebrow">{content.footer.feedbackLabel}</span>
          <h2 className="dl-h2">
            {content.footer.cardTitleLead} <strong>{content.footer.cardTitleStrong}</strong>
          </h2>
          <form className="dl-footer__form" onSubmit={handleSubmit}>
            <input ref={nameRef} type="text" className="dl-field" placeholder={content.footer.namePlaceholder} />
            <input ref={phoneRef} type="tel" className="dl-field" placeholder={content.footer.phonePlaceholder} />
            <textarea
              ref={messageRef}
              className="dl-field"
              placeholder={content.footer.msgPlaceholder}
              rows={4}
            />
            <button type="submit" className="dl-btn dl-btn--primary dl-btn--block">
              {content.footer.sendLabel}
            </button>
          </form>
        </div>

        <div className="dl-footer__center">
          <nav className="dl-footer__nav">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="dl-footer__contacts">
            <a href={content.footer.whatsappUrl} target="_blank" rel="noopener">
              {content.footer.whatsapp}
            </a>
            <a href={content.footer.telegramUrl} target="_blank" rel="noopener">
              {content.footer.telegram}
            </a>
            <span>{content.footer.address}</span>
          </div>
        </div>

        <div className="dl-footer__brand">
          <Logo size={34} />
        </div>

        <div className="dl-footer__bottom">
          <div className="dl-footer__socials">
            <a href={content.footer.telegramUrl} target="_blank" rel="noopener" aria-label="Telegram">
              <img src="/img/icons/tg_icon.svg" alt="" />
            </a>
            <a href={content.footer.whatsappUrl} target="_blank" rel="noopener" aria-label="WhatsApp">
              <img src="/img/icons/whts_icon.svg" alt="" />
            </a>
          </div>
          <div className="dl-footer__copy">© 2026 — Copyright</div>
        </div>
      </div>
    </footer>
  );
}
