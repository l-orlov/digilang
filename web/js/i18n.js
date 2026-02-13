const supportedLangs = ['es', 'en', 'ru'];
const defaultLang = 'en';

async function setLang(lang) {
  const safeLang = supportedLangs.includes(lang) ? lang : defaultLang;

  const currentLangEl = document.getElementById('current-lang');
  if (currentLangEl) {
    currentLangEl.textContent = safeLang.toUpperCase();
  }

  const currentLangHeader = document.getElementById('current-lang-header');
  if (currentLangHeader) {
    currentLangHeader.textContent = safeLang.toUpperCase();
  }

  localStorage.setItem('lang', safeLang);

  try {
    const dict = await getLangDict(safeLang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    document.documentElement.lang = safeLang;
    document.documentElement.classList.add('i18n-ready');
  } catch (err) {
    console.error(`Language load error for ${safeLang}:`, err);
    document.documentElement.classList.add('i18n-ready');
  }
}

function getLang() {
  const storedLang = localStorage.getItem('lang');
  const browserLang = (navigator.language || '').split('-')[0].toLowerCase();

  if (storedLang && supportedLangs.includes(storedLang)) {
    return storedLang;
  }
  if (browserLang && supportedLangs.includes(browserLang)) {
    return browserLang;
  }
  return defaultLang;
}

async function getLangDict(lang) {
  const url = `/lang/${lang}.json`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to load ${url}, status ${res.status}`);
  }

  return await res.json();
}

async function initLang() {
  await setLang(getLang());
}
