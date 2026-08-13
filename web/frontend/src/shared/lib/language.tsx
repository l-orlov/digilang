/**
 * Idioma actual del sitio — mismo patrón de contexto que ya usa
 * Preloader.tsx (ReadyContext/useReady): createContext + provider + hook.
 * Persiste en localStorage para que sobreviva a un reload, y refleja el
 * idioma en <html lang> para accesibilidad/SEO.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { contentByLanguage, type Content, type Language } from '@/home/content';

const STORAGE_KEY = 'dl-lang';
const LANGUAGES: Language[] = ['es', 'en', 'ru'];

function isLanguage(value: string | null): value is Language {
  return value !== null && (LANGUAGES as string[]).includes(value);
}

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'es';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isLanguage(stored) ? stored : 'es';
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  content: Content;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage debe usarse dentro de <LanguageProvider>');
  return ctx;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, content: contentByLanguage[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}
