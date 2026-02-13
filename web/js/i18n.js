const supportedLangs = ['es', 'en', 'ru'];
const defaultLang = 'es'

async function setLang(lang) {
  const currentLangEl = document.getElementById('current-lang');

  if (currentLangEl) {
    currentLangEl.textContent = lang.toUpperCase();
  }

  // Header
  const currentLangHeader = document.getElementById('current-lang-header');
  if (currentLangHeader) {
    currentLangHeader.textContent = lang.toUpperCase();
  }

  // Сохраняем выбранный язык в localStorage
  localStorage.setItem('lang', lang);

  try {
    const dict = await getLangDict(lang)

    // Обычные тексты
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Плейсхолдеры
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // HTML-тексты
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

  } catch (err) {
    console.error(`Language load error for ${lang}:`, err);
  }
}

function getLang() {
  const storedLang = localStorage.getItem('lang');
  const browserLang = (navigator.language || '').split('-')[0];

  if (storedLang)
    return storedLang;

  return browserLang ? browserLang 
                     : defaultLang
}

async function getLangDict(lang) {
  const url = `/lang/${lang}.json`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to load ${url}, status ${res.status}`);
  }

  return await res.json();
}

function initLang() {
  setLang(getLang());
}
