<!-- HEADER -->
<div class="header">
  <div class="header_inner">
    <a href="/" style="color: #fff;">
      <div class="header_logo">
        <img src="img/logo.png" alt="Digilang">
        <span data-i18n="creative_lab"></span>
      </div>
    </a>
    <div class="header_top_right">
        <div class="header_nav">
            <nav class="nav_links">
                <a href="/#about" data-i18n="about"></a>
                <a href="/#clients" data-i18n="portfolio"></a>
                <a href="/#styles" data-i18n="styles_menu"></a>
                <a href="/#contacts" data-i18n="contacts"></a>
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
            <img src="img/icons/lang_icon.svg">
            <span id="current-lang-header">EN</span>
            <ul id="header_lang_menu" class="header_lang_menu hidden">
                <li onclick="event.stopPropagation(); setLang(currentPage, 'es');">Español</li>
                <li onclick="event.stopPropagation(); setLang(currentPage, 'en');">English</li>
                <li onclick="event.stopPropagation(); setLang(currentPage, 'ru');">Русский</li>
                </ul>
            </div>
        </div>
    </div>
</div>
<script>
function toggleLangMenuHeader() {
  const menu = document.getElementById('header_lang_menu');
  menu.classList.toggle('hidden');
}

document.addEventListener('click', function (e) {
  const langBox = document.querySelector('.header_lang');
  const menu = document.getElementById('header_lang_menu');
  if (langBox && !langBox.contains(e.target)) {
    menu.classList.add('hidden');
  }
});

function toggleMenuBurger(event) {
  event.stopPropagation();
  const nav = document.querySelector('.nav_links');
  const burger = document.querySelector('.burger_menu');
  nav.classList.toggle('show');
  burger.classList.toggle('open');
  if (nav.classList.contains('show')) {
    document.addEventListener('click', closeMenuOutside);
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
<!-- END HEADER -->


<!-- LANDING with video background -->
<div class="landing_video_block">
    <video id="landing_video" autoplay muted loop playsinline class="landing_video_bg"></video>
    <div class="landing_video_overlay">
      <div class="landing_video_text">
        <h1 data-i18n="hero_title"></h1>
        <ul class="landing_video_list">
          <li data-i18n="hero_bullet1"></li>
          <li data-i18n="hero_bullet2"></li>
          <li data-i18n="hero_bullet3"></li>
        </ul>
        <a href="#contacts">
          <button class="btn button_text" data-i18n="hero_cta" style="cursor: pointer;"></button>
        </a>
      </div>
    </div>
</div>
<!-- LANDING with video background -->

<!-- LANDING ABOUT -->
<div id='about' class="landing_about">
  <div class="landing_about_header">
    <h2 class="landing_about_title" data-i18n="about_title"></h2>
    <span class="about__line"></span>
    <span class="about__dot"></span>
  </div>
  <div class="landing_about_grid">
    <div class="landing_about_text">
      <p data-i18n="about_p1"></p>
      <p data-i18n="about_p2"></p>
    </div>
    <div class="landing_about_cards">
      <div class="landing_about_card">
        <div class="card_bg"><img src="img/potential.svg" alt="Потенциал"></div>
        <div class="card_content">
          <h3 class="card_title" data-i18n="about_card1_title"></h3>
          <p class="card_desc" data-i18n="about_card1_desc"></p>
        </div>
      </div>
      <div class="landing_about_card">
        <div class="card_bg"><img src="img/style.svg" alt="Стиль"></div>
        <div class="card_content">
          <h3 class="card_title" data-i18n="about_card2_title"></h3>
          <p class="card_desc" data-i18n="about_card2_desc"></p>
        </div>
      </div>
      <div class="landing_about_card">
        <div class="card_bg"><img src="img/need.svg" alt="Необходимость"></div>
        <div class="card_content">
          <h3 class="card_title" data-i18n="about_card3_title"></h3>
          <p class="card_desc" data-i18n="about_card3_desc"></p>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- LANDING ABOUT -->

<!-- STYLES -->
<div id='styles' class="landing_styles">
  <div class="landing_styles_header">
    <h2 class="landing_styles_title" data-i18n="styles_title"></h2>
    <span class="landing_styles_line"></span>
    <span class="landing_styles_dot"></span>
  </div>
  <p class="landing_styles_tagline" data-i18n-html="styles_tagline"></p>

  <div class="styles_carousel">
    <button class="styles_carousel_btn prev" aria-label="Previous">&#9664;</button>
    <div class="styles_viewport">
      <ul class="styles_track">
        <li class="style_card" data-style="1">
          <img src="img/styles/s1.png" alt="Website style example 1">
        </li>
        <li class="style_card" data-style="2">
          <img src="img/styles/s2.png" alt="Website style example 2">
        </li>
        <li class="style_card" data-style="3">
          <img src="img/styles/s3.png" alt="Website style example 3">
        </li>
        <li class="style_card" data-style="4">
          <img src="img/styles/s4.png" alt="Website style example 4">
        </li>
        <li class="style_card" data-style="5">
          <img src="img/styles/s5.png" alt="Website style example 5">
        </li>
        <li class="style_card" data-style="6">
          <img src="img/styles/s6.png" alt="Website style example 6">
        </li>
        <li class="style_card" data-style="7">
          <img src="img/styles/s7.png" alt="Website style example 7">
        </li>
        <li class="style_card" data-style="8">
          <img src="img/styles/s8.png" alt="Website style example 8">
        </li>
        <li class="style_card" data-style="9">
          <img src="img/styles/s9.png" alt="Website style example 9">
        </li>
        <li class="style_card" data-style="10">
          <img src="img/styles/s10.png" alt="Website style example 10">
        </li>
        <li class="style_card" data-style="11">
          <img src="img/styles/s11.png" alt="Website style example 11">
        </li>
        <li class="style_card" data-style="12">
          <img src="img/styles/s12.png" alt="Website style example 12">
        </li>
        <li class="style_card" data-style="13">
          <img src="img/styles/s13.png" alt="Website style example 13">
        </li>
        <li class="style_card" data-style="14">
          <img src="img/styles/s14.png" alt="Website style example 14">
        </li>
        <li class="style_card" data-style="15">
          <img src="img/styles/s15.png" alt="Website style example 15">
        </li>
        <li class="style_card" data-style="16">
          <img src="img/styles/s16.png" alt="Website style example 16">
        </li>
        <li class="style_card" data-style="17">
          <img src="img/styles/s17.png" alt="Website style example 17">
        </li>
        <li class="style_card" data-style="18">
          <img src="img/styles/s18.png" alt="Website style example 18">
        </li>
        <li class="style_card" data-style="19">
          <img src="img/styles/s19.png" alt="Website style example 19">
        </li>
        <li class="style_card" data-style="20">
          <img src="img/styles/s20.png" alt="Website style example 20">
        </li>
        <li class="style_card" data-style="21">
          <img src="img/styles/s21.png" alt="Website style example 21">
        </li>
        <li class="style_card" data-style="22">
          <img src="img/styles/s22.png" alt="Website style example 22">
        </li>
        <li class="style_card" data-style="23">
          <img src="img/styles/s23.png" alt="Website style example 23">
        </li>
        <li class="style_card" data-style="24">
          <img src="img/styles/s24.png" alt="Website style example 24">
        </li>
      </ul>
    </div>
    <button class="styles_carousel_btn next" aria-label="Next">&#9654;</button>
  </div>
</div>
<!-- STYLES -->

<!-- CLIENTS -->
<div id='clients' class="landing_clients">
  <div class="landing_clients_header">
    <h2 class="clients_title" data-i18n="clients_title"></h2>
    <span class="clients_line"></span>
    <span class="clients_dot"></span>
  </div>
  <div class="clients_intro">
    <p class="clients_sub" data-i18n="clients_sub"></p>
    <a href="#contacts">
      <button class="btn button_text clients_cta_btn" data-i18n="clients_cta"></button>
    </a>
  </div>
  <div class="carousel">
    <button class="carousel_btn prev" aria-label="Previous">&#9664;</button>
    <div class="carousel_viewport">
      <ul class="carousel_track">
        <li class="card">
          <img src="img/clients/cadipel.png" alt="CADIPEL">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4>CADIPEL</h4>
              <a href="https://www.cadipel.com.ar/" target="_blank" rel="noopener" class="card_overlay_btn" data-i18n="clients_card_btn"></a>
            </div>
          </div>
        </li>
        <li class="card">
          <img src="img/clients/fenimprese.png" alt="Eugenio Cuttica Foundation">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4>FENIMPRESE</h4>
              <a href="https://digilang.pro/fenimprese/" target="_blank" rel="noopener" class="card_overlay_btn" data-i18n="clients_card_btn"></a>
            </div>
          </div>
        </li>
        <li class="card">
          <img src="img/clients/ecopolys.png" alt="ECOPOLYS">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4>ECOPOLYS</h4>
              <a href="https://ecopolys.eu/" target="_blank" rel="noopener" class="card_overlay_btn" data-i18n="clients_card_btn"></a>
            </div>
          </div>
        </li>
        <li class="card">
          <img src="img/clients/krona.png" alt="KRONA">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4>KRONA</h4>
              <a href="https://krona.life/" target="_blank" rel="noopener" class="card_overlay_btn" data-i18n="clients_card_btn"></a>
            </div>
          </div>
        </li>
        <li class="card">
          <img src="img/clients/racing.png" alt="KRONA">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4>RACING CLUB</h4>
              <a href="https://store.racinggaming.com.ar/" target="_blank" rel="noopener" class="card_overlay_btn" data-i18n="clients_card_btn"></a>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <button class="carousel_btn next" aria-label="Next">&#9654;</button>
  </div>
</div>
<!-- CLIENTS -->

<!-- SERVICES TIMELINE -->
<div class="services_timeline">
  <div class="timeline_body">
    <img src="img/logo.png" alt="Digilang" class="timeline_logo">
    <ul class="timeline_list">
      <li data-i18n="tl_item1"></li>
      <li data-i18n="tl_item2"></li>
      <li data-i18n="tl_item3"></li>
      <li data-i18n="tl_item4"></li>
      <li data-i18n="tl_item5"></li>
      <li data-i18n="tl_item6"></li>
    </ul>
    <a href="#contacts">
      <button class="btn button_text" data-i18n="hero_cta"></button>
    </a>
  </div>
</div>
<!-- SERVICES TIMELINE -->

<!-- FOOTER -->
<div id="contacts" class="footer">
  <div class="footer_inner">

    <!-- Left: feedback form card -->
    <div class="footer_card">
      <span class="footer_card_label" data-i18n="footer_feedback"></span>
      <h2 class="footer_card_title" data-i18n-html="footer_card_title"></h2>
      <form class="footer_form" id="footer_form">
        <input type="text"  id="footer_name"  data-i18n-placeholder="footer_name_plh"  placeholder="">
        <input type="tel"   id="footer_phone" data-i18n-placeholder="footer_phone_plh" placeholder="">
        <textarea id="footer_msg" data-i18n-placeholder="footer_msg_plh" placeholder="" rows="4"></textarea>
        <button type="button" class="footer_form_btn" onclick="footerSend(event)" data-i18n="footer_send"></button>
      </form>
    </div>

    <!-- Right: nav + contacts + logo + socials -->
    <div class="footer_right">
      <nav class="footer_nav">
        <a href="/#about"   data-i18n="about"></a>
        <a href="/#styles"  data-i18n="styles_menu"></a>
        <a href="/#clients" data-i18n="portfolio"></a>
      </nav>

      <div class="footer_contacts_block">
        <span class="footer_contacts_label" data-i18n="contacts"></span>
        <a href="https://wa.me/541144724911" class="footer_contact_link">+54 (11) 4472-4911</a>
        <a href="https://t.me/digilang_pro"  class="footer_contact_link">t.me/digilang_pro</a>
        <span class="footer_contact_link">Buenos Aires</span>
      </div>

      <div class="footer_logo">
        <img src="img/logo.png" alt="Digilang">
        <span data-i18n="creative_lab"></span>
      </div>

      <div class="footer_bottom">
        <div class="footer_socials">
          <a href="https://t.me/digilang_pro"   target="_blank" rel="noopener" class="footer_social_btn" aria-label="Telegram">
            <img src="img/icons/tg_icon.svg" alt="Telegram">
          </a>
          <a href="https://wa.me/541144724911" target="_blank" rel="noopener" class="footer_social_btn" aria-label="WhatsApp">
            <img src="img/icons/whts_icon.svg" alt="WhatsApp">
          </a>
        </div>
      </div>
    </div>

  </div>
</div>
<!-- END FOOTER -->
