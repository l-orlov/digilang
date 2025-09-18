<div class="header">
    <div class="header_logo">
        <img src="img/logo.png">
        <span data-i18n="creative_lab">Креативная лаборатория</span>
    </div>
    <div class="header_top_right">
        <div class="header_nav">
            <nav class="nav_links">
                <a href="#" data-i18n="about">о нас</a>
                <a href="#" data-i18n="portfolio">портфолио</a>
                <a href="#" data-i18n="styles_menu">меню стилей</a>
                <a href="#" data-i18n="contacts">контакты</a>
            </nav>
            <button class="burger_menu" onclick="toggleMenuBurger(event)">
                <div class="burger_lines">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>
        </div>
        <div class="header_lang" onclick="toggleLangMenuHeader()">
            <img src="img/landing_lang.png" />
            <span id="current-lang-header">Es</span>
                <ul id="header_lang_menu" class="header_lang_menu hidden">
                <li onclick="setLang('landing', 'es')">Español</li>
                <li onclick="setLang('landing', 'en')">English</li>
                <li onclick="setLang('landing', 'ru')">Русский</li>
            </ul>
        </div>
    </div>
</div>
<script>
function toggleMenuBurger(event) {
  event.stopPropagation();

  const nav = document.querySelector('.nav_links');
  const burger = document.querySelector('.burger_menu');

  nav.classList.toggle('show');
  burger.classList.toggle('open');

  if (nav.classList.contains('show')) {
    document.addEventListener('click', closeMenuOutside);
    // Добавим обработчики к каждому пункту навигации
    document.querySelectorAll('.nav_links a').forEach(link => {
      link.addEventListener('click', closeMenuByLink);
    });
  } else {
    removeMenuListeners();
  }
}
function closeMenuOutside(e) {
  const nav = document.querySelector('.nav_links');
  const burger = document.querySelector('.burger_menu');

  if (!nav.contains(e.target) && !burger.contains(e.target)) {
    nav.classList.remove('show');
    burger.classList.remove('open');
    removeMenuListeners();
  }
}
function closeMenuByLink() {
  const nav = document.querySelector('.nav_links');
  const burger = document.querySelector('.burger_menu');
  nav.classList.remove('show');
  burger.classList.remove('open');
  removeMenuListeners();
}
function removeMenuListeners() {
  document.removeEventListener('click', closeMenuOutside);
  document.querySelectorAll('.nav_links a').forEach(link => {
    link.removeEventListener('click', closeMenuByLink);
  });
} 
</script>