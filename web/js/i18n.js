const supportedLangs = ['es', 'en', 'ru'];
const defaultLang = 'en';

function getCookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.*+?^${}()|[\]\\])/g, '\\$1') + '=([^;]*)'));
  return m ? decodeURIComponent(m[1].trim()) : null;
}

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

  // Set cookie via server so it persists (JS document.cookie can fail on some HTTPS/proxies)
  fetch('./includes/setlang.php?setlang=' + encodeURIComponent(safeLang), { method: 'GET', credentials: 'same-origin' });

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
  } catch (err) {
    console.error(`Language load error for ${safeLang}:`, err);
  }
}

function getLang() {
  const cookieLang = getCookie('lang');
  const browserLang = (navigator.language || '').split('-')[0].toLowerCase();

  if (cookieLang && supportedLangs.includes(cookieLang)) {
    return cookieLang;
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
  // Trust server-rendered language: no fetch, no overwrite, no flash
  const serverLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
  if (supportedLangs.includes(serverLang)) {
    const currentLangHeader = document.getElementById('current-lang-header');
    if (currentLangHeader) currentLangHeader.textContent = serverLang.toUpperCase();
    return;
  }
  await setLang(getLang());
}
