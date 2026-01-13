<? include 'includes/header.php'; ?>

<!-- LANDING with video background -->
<div class="landing_video_block">
    <video id="landing_video" autoplay muted loop playsinline class="landing_video_bg"></video>
    <div class="landing_video_overlay">
      <div class="landing_video_text">
        <h1 data-i18n="hero_title">У вас нет сайта?</h1>
        <ul class="landing_video_list">
          <li data-i18n="hero_bullet1">В современном мире клиенты выбирают тех, кого видят онлайн.</li>
          <li data-i18n="hero_bullet2">У кого нет сайта — у того нет будущего.</li>
          <li data-i18n="hero_bullet3">Мы создадим сайт, оцифруем и автоматизируем ваш бизнес!</li>
        </ul>
        <a href="/form.php">
          <button class="btn button_text" data-i18n="hero_cta" style="cursor: pointer;" >Получить консультацию</button>
        </a>
      </div>
    </div>
</div>
<!-- LANDING with video background -->

<!-- STYLES -->
<div id='styles' class="landing_styles">
  <div class="landing_styles_header">
    <span class="landing_styles_line landing_styles_line--left"></span>
    <h2 class="landing_styles_title" data-i18n="styles_title">меню стилей</h2>
    <span class="landing_styles_line landing_styles_line--right"></span>
    <span class="landing_styles_dot"></span>
  </div>
  <p class="landing_styles_tagline" data-i18n="styles_tagline">
    Динамика, премиум или креатив — ваш бизнес в нужной форме.
  </p>

  <div class="styles_carousel">
    <button class="styles_carousel_btn prev" aria-label="Назад">&#9664;</button>
    <div class="styles_viewport">
      <ul class="styles_track">
        <li class="style_card" data-style="1">
          <img src="img/styles/s1.png">
        </li>
        <li class="style_card" data-style="2">
          <img src="img/styles/s2.png">
        </li>
        <li class="style_card" data-style="3">
          <img src="img/styles/s3.png">
        </li>
        <li class="style_card" data-style="4">
          <img src="img/styles/s4.png">
        </li>
        <li class="style_card" data-style="5">
          <img src="img/styles/s5.png">
        </li>
        <li class="style_card" data-style="6">
          <img src="img/styles/s6.png">
        </li>
        <li class="style_card" data-style="7">
          <img src="img/styles/s7.png">
        </li>
        <li class="style_card" data-style="8">
          <img src="img/styles/s8.png">
        </li>
        <li class="style_card" data-style="9">
          <img src="img/styles/s9.png">
        </li>
        <li class="style_card" data-style="10">
          <img src="img/styles/s10.png">
        </li>
        <li class="style_card" data-style="11">
          <img src="img/styles/s11.png">
        </li>
        <li class="style_card" data-style="12">
          <img src="img/styles/s12.png">
        </li>
        <li class="style_card" data-style="13">
          <img src="img/styles/s13.png">
        </li>
        <li class="style_card" data-style="14">
          <img src="img/styles/s14.png">
        </li>
        <li class="style_card" data-style="15">
          <img src="img/styles/s15.png">
        </li>
        <li class="style_card" data-style="16">
          <img src="img/styles/s16.png">
        </li>
        <li class="style_card" data-style="17">
          <img src="img/styles/s17.png">
        </li>
        <li class="style_card" data-style="18">
          <img src="img/styles/s18.png">
        </li>
        <li class="style_card" data-style="19">
          <img src="img/styles/s19.png">
        </li>
        <li class="style_card" data-style="20">
          <img src="img/styles/s20.png">
        </li>
        <li class="style_card" data-style="21">
          <img src="img/styles/s21.png">
        </li>
        <li class="style_card" data-style="22">
          <img src="img/styles/s22.png">
        </li>
        <li class="style_card" data-style="23">
          <img src="img/styles/s23.png">
        </li>
        <li class="style_card" data-style="24">
          <img src="img/styles/s24.png">
        </li>
      </ul>
    </div>
    <button class="styles_carousel_btn next" aria-label="Вперёд">&#9654;</button>
  </div>

  <p class="landing_styles_note" data-i18n="styles_note">
    Выберите стиль, который подходит именно вам. Выбранный стиль мы легко адаптируем под ваши задачи.
  </p>
</div>
<!-- STYLES -->

<!-- LANDING ABOUT -->
<div id='about' class="landing_about">
  <div class="landing_about_header">
    <span class="about__line about__line--left"></span>
    <h2 class="landing_about_title" data-i18n="about_title">O нас</h2>
    <span class="about__line about__line--right"></span>
    <span class="about__dot"></span>
  </div>
  <div class="landing_about_grid">
    <div class="landing_about_text">
      <p data-i18n="about_p1">
        Мы лаборатория цифровых решений. Мы уверены, что ваши идеи заслуживают профессионального,
        качественного и красивого воплощения в цифровом мире.
      </p>
      <p data-i18n="about_p2">
        Наша команда оцифрует ваш бизнес и будет с вами на всех этапах работы. Просто, быстро и эффективно!
      </p>
    </div>
    <div class="landing_about_cards">
      <div class="landing_about_card" data-card="1">
        <div class="card_face">
          <div class="landing_about_card_icon">
            <img src="img/potential.png" alt="">
          </div>
          <h3 class="landing_about_card_title" id="about_card1_title" data-i18n="about_card1_title">Потенциал</h3>
          <button class="landing_about_card_chev" type="button" aria-expanded="false" aria-controls="about_card1_panel">
            <img src="img/chev_down.png" alt="">
          </button>
        </div>
        <div class="landing_about_card_panel" id="about_card1_panel" role="region" aria-labelledby="about_card1_title">
          <div class="landing_about_card_panel_chev">
            <img src="img/chev_down_black.png">
          </div>
          <h3 class="landing_about_card_panel_title" data-i18n="about_card1_title">Потенциал</h3>
          <p data-i18n="about_card1_desc">
            От идеи до готового продукта: связь и поддержка на каждом этапе в веб-лаборатории.
          </p>
        </div>
      </div>
      <div class="landing_about_card" data-card="2">
        <div class="card_face">
          <div class="landing_about_card_icon">
            <img src="img/style.png" alt="">
          </div>
          <h3 class="landing_about_card_title" id="about_card2_title" data-i18n="about_card2_title">Стиль</h3>
          <button class="landing_about_card_chev" type="button" aria-expanded="false" aria-controls="about_card2_panel">
            <img src="img/chev_down.png" alt="">
          </button>
        </div>
        <div class="landing_about_card_panel" id="about_card2_panel" role="region" aria-labelledby="about_card2_title">
          <div class="landing_about_card_panel_chev">
            <img src="img/chev_down_black.png">
          </div>
          <h3 class="landing_about_card_panel_title" data-i18n="about_card2_title"></h3>
          <p data-i18n="about_card2_desc">
            Создаём цифровые пространства, которые отражают стиль и энергию вашего бренда.
          </p>
        </div>
      </div>
      <div class="landing_about_card" data-card="3">
        <div class="card_face">
          <div class="landing_about_card_icon">
            <img src="img/need.png" alt="">
          </div>
          <h3 class="landing_about_card_title" id="about_card3_title" data-i18n="about_card3_title">Необходимость</h3>
          <button class="landing_about_card_chev" type="button" aria-expanded="false" aria-controls="about_card3_panel">
            <img src="img/chev_down.png" alt="">
          </button>
        </div>
        <div class="landing_about_card_panel" id="about_card3_panel" role="region" aria-labelledby="about_card3_title">
          <div class="landing_about_card_panel_chev">
            <img src="img/chev_down_black.png">
          </div>
          <h3 class="landing_about_card_panel_title" data-i18n="about_card3_title"></h3>
          <p data-i18n="about_card3_desc">
            Сайты и системы, созданные нами, приносят прибыль и работают в интересах вашего бизнеса.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- LANDING ABOUT -->

<!-- CLIENTS -->
<div id='clients' class="landing_clients">
  <div class="landing_clients_header">
    <span class="clients_line clients_line--left"></span>
    <h2 class="clients_title" data-i18n="clients_title">наши клиенты</h2>
    <span class="clients_line clients_line--right"></span>
  </div>
  <p class="clients_sub" data-i18n="clients_sub">
    Мы гордимся тем, что делаем, и всегда ищем пути к развитию.
  </p>
  <div class="carousel">
    <button class="carousel_btn prev" aria-label="Назад">&#9664;</button>
    <div class="carousel_viewport">
      <ul class="carousel_track">
        <li class="card">
          <img src="img/cesar.png">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4>Cesar Vidal Scasso</h4>
              <a href="https://cesarvidalscasso.com/" target="_blank" rel="noopener" class="card_overlay_btn" data-i18n="clients_card_btn">узнать больше</a>
            </div>
          </div>
        </li>
        <li class="card">
          <img src="img/cuttica.png">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4>Eugenio Cuttica Foundation</h4>
              <a href="https://cutticafoundation.org/" target="_blank" rel="noopener" class="card_overlay_btn" data-i18n="clients_card_btn">узнать больше</a>
            </div>
          </div>
        </li>
        <li class="card">
          <img src="img/ecopolys.png">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4>ECOPOLYS</h4>
              <a href="https://ecopolys.eu/" target="_blank" rel="noopener" class="card_overlay_btn" data-i18n="clients_card_btn">узнать больше</a>
            </div>
          </div>
        </li>
        <li class="card">
          <img src="img/krona.png">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4>KRONA</h4>
              <a href="https://krona.life/" target="_blank" rel="noopener" class="card_overlay_btn" data-i18n="clients_card_btn">узнать больше</a>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <button class="carousel_btn next" aria-label="Вперёд">&#9654;</button>
  </div>
  <div class="clients_cta">
    <a href="/form.php">
      <button class="clients_cta_btn" data-i18n="clients_cta">Получить консультацию</button>
    </a>
  </div>
</div>
<!-- CLIENTS -->

<!-- SERVICES TIMELINE -->
<div class="services_timeline">
  <div class="timeline">
    <ul class="timeline_list">
      <li data-i18n="tl_item1">Создание ботов в WhatsApp и Telegram</li>
      <li data-i18n="tl_item2">UX/UI дизайн</li>
      <li data-i18n="tl_item3">WEB разработка</li>
      <li data-i18n="tl_item4">SEO и оптимизация запросов</li>
      <li data-i18n="tl_item5">DevOps, настройка и администрирование серверов</li>
      <li data-i18n="tl_item6">Комплексная цифровизация и автоматизация бизнеса</li>
    </ul>
  </div>
  <div class="timeline_cta">
    <h3 class="timeline_cta_title" data-i18n="tl_cta_title">
      Начните создавать сайты вашей мечты вместе с DigiLang прямо сейчас!
    </h3>
    <a href="/form.php">
      <button class="timeline_cta_btn" data-i18n="tl_cta_btn">Заказать сайт</button>
    </a>
  </div>
</div>
<!-- SERVICES TIMELINE -->

<? include 'includes/footer.php'; ?>

<script src="/js/landing.js"></script>
<script src="/js/i18n.js?v=1.0.3"></script>
