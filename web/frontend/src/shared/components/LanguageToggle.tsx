/**
 * Botón flotante persistente (todas las secciones) para cambiar el idioma
 * del sitio — ES → EN → RU → ES en cada click, mismo lenguaje visual que
 * AudioToggle.tsx (pill oscura) pero en la esquina libre que queda: arriba
 * a la derecha (AudioToggle ya ocupa abajo a la derecha, el hint de scroll
 * abajo a la izquierda).
 */
import { useLanguage } from '@/shared/lib/language';
import type { Language } from '@/home/content';

const ORDER: Language[] = ['es', 'en', 'ru'];
const LABEL: Record<Language, string> = { es: 'ES', en: 'EN', ru: 'RU' };
const NEXT_LABEL: Record<Language, string> = { es: 'English', en: 'Русский', ru: 'Español' };

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(language) + 1) % ORDER.length];
    setLanguage(next);
  };

  return (
    <button
      type="button"
      className="dl-language-toggle"
      onClick={cycle}
      aria-label={`Cambiar idioma a ${NEXT_LABEL[language]}`}
    >
      {LABEL[language]}
    </button>
  );
}
