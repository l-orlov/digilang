const supportedLangs = ['en', 'es', 'ru'];
const defaultLang = 'en';

async function setLang(page, lang) {
  const safeLang = supportedLangs.includes(lang) ? lang : defaultLang;
  localStorage.setItem('lang', safeLang);

  const currentLangHeader = document.getElementById('current-lang-header');
  if (currentLangHeader) currentLangHeader.textContent = safeLang.toUpperCase();

  document.documentElement.lang = safeLang;

  try {
    const dict = await getLangDict(page, safeLang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key]) el.innerHTML = dict[key];
    });
  } catch (err) {
    console.error(`Language load error for ${lang}:`, err);
  }
}

function getLang() {
  const stored = localStorage.getItem('lang');
  if (stored && supportedLangs.includes(stored)) return stored;
  const browser = (navigator.language || '').split('-')[0].toLowerCase();
  return supportedLangs.includes(browser) ? browser : defaultLang;
}

async function getLangDict(page, lang) {
  const url = `lang/${page}/${lang}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}, status ${res.status}`);
  return await res.json();
}

function initLang(page = 'landing', defaultLangOverride = defaultLang) {
  const lang = getLang() || defaultLangOverride;
  setLang(page, lang);
}
