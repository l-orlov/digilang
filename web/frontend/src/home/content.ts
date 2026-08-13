/**
 * Índice de contenido multi-idioma. El copy en sí vive en content.es.ts /
 * content.en.ts / content.ru.ts (mismo shape `Content`, uno por idioma) —
 * este archivo solo define los tipos compartidos y arma el mapa
 * `contentByLanguage` que consume `useLanguage()` (src/shared/lib/language.tsx).
 *
 * `export const content` sigue apuntando al español para no tener que
 * tocar los componentes que hoy no se renderizan (StylesShowcase, Clients,
 * ServicesTimeline, ContactFooter — ver HomePage.tsx) y todavía importan
 * `content` directo en vez de por `useLanguage()`.
 */

export interface ClientItem {
  name: string;
  img: string;
  url: string;
}

export const clients: ClientItem[] = [
  { name: 'CADIPEL', img: '/img/clients/cadipel.png', url: 'https://www.cadipel.com.ar/' },
  { name: 'FENIMPRESE', img: '/img/clients/fenimprese.png', url: 'https://digilang.pro/fenimprese/' },
  { name: 'ECOPOLYS', img: '/img/clients/ecopolys.png', url: 'https://ecopolys.eu/' },
  { name: 'KRONA', img: '/img/clients/krona.png', url: 'https://krona.life/' },
  { name: 'RACING CLUB', img: '/img/clients/racing.png', url: 'https://store.racinggaming.com.ar/' },
];

export const styleImages: string[] = Array.from(
  { length: 24 },
  (_, i) => `/img/styles/s${i + 1}.png`
);

export interface JourneyFacet {
  eyebrow: string;
  line: string;
}

export interface Content {
  journey: {
    approach: { hint: string };
    intro: { title: string; sub: string };
    facets: JourneyFacet[];
    outro: { title: string; sub: string };
  };
  styles: {
    eyebrow: string;
    title: string;
    tagline: string[];
  };
  clients: {
    eyebrow: string;
    title: string;
    sub: string;
    cta: string;
    cardBtn: string;
  };
  timeline: {
    items: string[];
    ctaTitle: string;
    ctaBtn: string;
  };
  footer: {
    feedbackLabel: string;
    cardTitleLead: string;
    cardTitleStrong: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    msgPlaceholder: string;
    sendLabel: string;
    whatsapp: string;
    whatsappUrl: string;
    telegram: string;
    telegramUrl: string;
    address: string;
  };
}

import { content as esContent } from '@/home/content.es';
import { content as enContent } from '@/home/content.en';
import { content as ruContent } from '@/home/content.ru';

export type Language = 'es' | 'en' | 'ru';

export const contentByLanguage: Record<Language, Content> = {
  es: esContent,
  en: enContent,
  ru: ruContent,
};

export const content = esContent;
