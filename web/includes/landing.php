<? include 'includes/header.php'; ?>

<!-- LANDING with video background -->
<div class="landing_video_block">
    <video id="landing_video" autoplay muted loop playsinline class="landing_video_bg"></video>
    <div class="landing_video_overlay">
      <div class="landing_video_text">
        <h1 data-i18n="hero_title">Don't have a website yet?</h1>
        <ul class="landing_video_list">
          <li data-i18n="hero_bullet1">In today's world, customers choose those they can see online.</li>
          <li data-i18n="hero_bullet2">No website means no future.</li>
          <li data-i18n="hero_bullet3">We'll build your site and digitize and automate your business.</li>
        </ul>
        <a href="?page=form">
          <button class="btn button_text" data-i18n="hero_cta" style="cursor: pointer;" >Get a consultation</button>
        </a>
      </div>
    </div>
</div>
<!-- LANDING with video background -->

<!-- STYLES -->
<div id='styles' class="landing_styles">
  <div class="landing_styles_header">
    <span class="landing_styles_line landing_styles_line--left"></span>
    <h2 class="landing_styles_title" data-i18n="styles_title">Style menu</h2>
    <span class="landing_styles_line landing_styles_line--right"></span>
    <span class="landing_styles_dot"></span>
  </div>
  <p class="landing_styles_tagline" data-i18n="styles_tagline">
    Dynamic, premium or creative—your business in the right form.
  </p>

  <div class="styles_carousel">
    <button class="styles_carousel_btn prev" aria-label="Previous">&#9664;</button>
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
    <button class="styles_carousel_btn next" aria-label="Next">&#9654;</button>
  </div>

  <p class="landing_styles_note" data-i18n="styles_note">
    Choose the style that suits you best. We'll adapt the selected style to your needs.
  </p>
</div>
<!-- STYLES -->

<!-- LANDING ABOUT -->
<div id='about' class="landing_about">
  <div class="landing_about_header">
    <span class="about__line about__line--left"></span>
    <h2 class="landing_about_title" data-i18n="about_title">About us</h2>
    <span class="about__line about__line--right"></span>
    <span class="about__dot"></span>
  </div>
  <div class="landing_about_grid">
    <div class="landing_about_text">
      <p data-i18n="about_p1">
        We are a digital solutions laboratory. We believe your ideas deserve a professional, high-quality, and beautiful realization in the digital world.
      </p>
      <p data-i18n="about_p2">
        Our team will digitize your business and stay with you at every stage of the work. Simple, fast, and effective.
      </p>
    </div>
    <div class="landing_about_cards">
      <div class="landing_about_card" data-card="1">
        <div class="card_face">
          <div class="landing_about_card_icon">
            <img src="img/potential.png" alt="">
          </div>
          <h3 class="landing_about_card_title" id="about_card1_title" data-i18n="about_card1_title">Potential</h3>
          <button class="landing_about_card_chev" type="button" aria-expanded="false" aria-controls="about_card1_panel">
            <img src="img/chev_down.png" alt="">
          </button>
        </div>
        <div class="landing_about_card_panel" id="about_card1_panel" role="region" aria-labelledby="about_card1_title">
          <div class="landing_about_card_panel_chev">
            <img src="img/chev_down_black.png">
          </div>
          <h3 class="landing_about_card_panel_title" data-i18n="about_card1_title">Potential</h3>
          <p data-i18n="about_card1_desc">
            From idea to finished product: communication and support at every stage in our web lab.
          </p>
        </div>
      </div>
      <div class="landing_about_card" data-card="2">
        <div class="card_face">
          <div class="landing_about_card_icon">
            <img src="img/style.png" alt="">
          </div>
          <h3 class="landing_about_card_title" id="about_card2_title" data-i18n="about_card2_title">Style</h3>
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
            We create digital spaces that reflect your brand's style and energy.
          </p>
        </div>
      </div>
      <div class="landing_about_card" data-card="3">
        <div class="card_face">
          <div class="landing_about_card_icon">
            <img src="img/need.png" alt="">
          </div>
          <h3 class="landing_about_card_title" id="about_card3_title" data-i18n="about_card3_title">Necessity</h3>
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
            The sites and systems we build generate profit and work in the interests of your business.
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
    <h2 class="clients_title" data-i18n="clients_title">Our clients</h2>
    <span class="clients_line clients_line--right"></span>
  </div>
  <p class="clients_sub" data-i18n="clients_sub">
    We are proud of what we do and always look for ways to grow.
  </p>
  <div class="carousel">
    <button class="carousel_btn prev" aria-label="Previous">&#9664;</button>
    <div class="carousel_viewport">
      <ul class="carousel_track">
        <li class="card">
          <img src="img/cesar.png">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4>Cesar Vidal Scasso</h4>
              <a href="https://cesarvidalscasso.com/" target="_blank" rel="noopener" class="card_overlay_btn" data-i18n="clients_card_btn">learn more</a>
            </div>
          </div>
        </li>
        <li class="card">
          <img src="img/cuttica.png">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4>Eugenio Cuttica Foundation</h4>
              <a href="https://cutticafoundation.org/" target="_blank" rel="noopener" class="card_overlay_btn" data-i18n="clients_card_btn">learn more</a>
            </div>
          </div>
        </li>
        <li class="card">
          <img src="img/ecopolys.png">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4>ECOPOLYS</h4>
              <a href="https://ecopolys.eu/" target="_blank" rel="noopener" class="card_overlay_btn" data-i18n="clients_card_btn">learn more</a>
            </div>
          </div>
        </li>
        <li class="card">
          <img src="img/krona.png">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4>KRONA</h4>
              <a href="https://krona.life/" target="_blank" rel="noopener" class="card_overlay_btn" data-i18n="clients_card_btn">learn more</a>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <button class="carousel_btn next" aria-label="Next">&#9654;</button>
  </div>
  <div class="clients_cta">
    <a href="?page=form">
      <button class="clients_cta_btn" data-i18n="clients_cta">Get a consultation</button>
    </a>
  </div>
</div>
<!-- CLIENTS -->

<!-- SERVICES TIMELINE -->
<div class="services_timeline">
  <div class="timeline">
    <ul class="timeline_list">
      <li data-i18n="tl_item1">Bot development for WhatsApp and Telegram</li>
      <li data-i18n="tl_item2">UX/UI design</li>
      <li data-i18n="tl_item3">Web development</li>
      <li data-i18n="tl_item4">SEO and search optimization</li>
      <li data-i18n="tl_item5">DevOps, server setup and administration</li>
      <li data-i18n="tl_item6">End-to-end digitization and business automation</li>
    </ul>
  </div>
  <div class="timeline_cta">
    <h3 class="timeline_cta_title" data-i18n="tl_cta_title">
      Start building the website of your dreams with DigiLang right now!
    </h3>
    <a href="?page=form">
      <button class="timeline_cta_btn" data-i18n="tl_cta_btn">Order a website</button>
    </a>
  </div>
</div>
<!-- SERVICES TIMELINE -->

<? include 'includes/footer.php'; ?>

<script src="/js/landing.js"></script>
<script src="/js/i18n.js?v=1.0.3"></script>
