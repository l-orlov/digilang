/**
 * Copy en español — idioma por defecto y fuente de verdad. Migrado
 * originalmente desde web/legacy-php/lang/landing/es.json.
 */
import type { Content } from '@/home/content';

export const content: Content = {
  journey: {
    approach: {
      hint: 'Scroll para descubrir más',
    },
    intro: {
      title: 'El núcleo digital de DigiLang',
      sub: 'Cada cara de este cristal es una disciplina del estudio.',
    },
    facets: [
      { eyebrow: 'Diseño', line: 'Interfaces que se sienten inevitables.' },
      { eyebrow: 'Desarrollo', line: 'Código que sostiene lo que imaginás.' },
      { eyebrow: 'Automatización', line: 'Bots que trabajan mientras vos no.' },
      { eyebrow: 'SEO', line: 'Visibilidad que se gana, no se compra.' },
      { eyebrow: 'DevOps', line: 'Infraestructura que no se cae a las 3am.' },
      { eyebrow: 'Estrategia', line: 'De la idea al negocio, sin fricción.' },
    ],
    outro: {
      title: 'Saliste del núcleo.',
      sub: 'Esto es lo que hacemos ahí dentro. Hablemos de lo tuyo.',
    },
  },
  styles: {
    eyebrow: 'Portafolio',
    title: 'Menú de estilos',
    tagline: [
      'Dinámica, premium o creativa: tu negocio en la forma adecuada.',
      'Elige el estilo que mejor se adapte a ti. Adaptaremos el estilo elegido a tus necesidades.',
    ],
  },
  clients: {
    eyebrow: 'Portafolio',
    title: 'Nuestros clientes',
    sub: 'Estamos orgullosos de lo que hacemos y siempre buscamos caminos para crecer.',
    cta: 'Obtener una consulta',
    cardBtn: 'saber más',
  },
  timeline: {
    items: [
      'Creación de bots en WhatsApp y Telegram',
      'Diseño UX/UI',
      'Desarrollo web',
      'SEO y optimización de búsqueda',
      'DevOps, configuración y administración de servidores',
      'Digitalización integral y automatización del negocio',
    ],
    ctaTitle: '¡Empieza a crear el sitio web de tus sueños con DigiLang ahora mismo!',
    ctaBtn: 'Encargar sitio web',
  },
  footer: {
    feedbackLabel: 'FEEDBACK',
    cardTitleLead: '¿Buscas un nuevo sitio web?',
    cardTitleStrong: 'Escríbele a nuestro equipo.',
    namePlaceholder: 'Tu nombre',
    phonePlaceholder: 'Número de teléfono',
    msgPlaceholder: 'Mensaje',
    sendLabel: 'Enviar solicitud',
    whatsapp: '+54 (11) 4472-4911',
    whatsappUrl: 'https://wa.me/541144724911',
    telegram: 't.me/digilang_pro',
    telegramUrl: 'https://t.me/digilang_pro',
    address: 'Buenos Aires, Argentina',
  },
};
