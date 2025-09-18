<!-- HEADER -->
<? include 'includes/landing_header.php'; ?>
<script>
function toggleLangMenuHeader() {
  const menu = document.getElementById('header_lang_menu');
  menu.classList.toggle('hidden');
}
document.addEventListener('DOMContentLoaded', () => {
  initLang('landing');
});
document.addEventListener('click', function (e) {
  const langBox = document.querySelector('.header_lang');
  const menu = document.getElementById('header_lang_menu');
  if (!langBox.contains(e.target)) {
    menu.classList.add('hidden');
  }
});
</script>
<!-- HEADER -->

<!-- LANDING with video background -->
<div class="landing_video_block">
    <div class="landing_video_gradient"></div>
    <video id="landing_video" autoplay muted loop playsinline class="landing_video_bg"></video>

    <div class="landing_video_overlay">
        <div class="landing_video_logo">
            <img src="img/logo.png" alt="DigiLang Logo">
            <p>Креативная лаборатория</p>
        </div>
        <div class="landing_video_text">
            <h1>У вас еще нет сайта?<br>Тогда нужно<br>обратиться к нам.</h1>
            <button class="btn button_text">Связаться</button>
        </div>
    </div>
</div>
<script>
document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("landing_video");
  const source = document.createElement("source");

  const isMobile = window.innerWidth <= 768;

  source.setAttribute("src", isMobile ? "videos/vid_digilang_web_mob.mp4" : "videos/vid_digilang_web.mp4");
  source.setAttribute("type", "video/mp4");

  video.appendChild(source);
  video.load();
});
</script>
<!-- LANDING with video background -->

<!-- LANDING ABOUT -->
<div class="landing_about">
  <div class="landing_about_header">
    <span class="about__line about__line--left"></span>
    <h2 class="landing_about_title" data-i18n="about_title">о нас</h2>
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

      <!-- Card 2 -->
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
          <h3 class="landing_about_card_panel_title" data-i18n="about_card1_title">Потенциал</h3>
          <p data-i18n="about_card2_desc">
            Создаём цифровые пространства, которые отражают стиль и энергию вашего бренда.
          </p>
        </div>
      </div>

      <!-- Card 3 -->
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
          <h3 class="landing_about_card_panel_title" data-i18n="about_card1_title">Потенциал</h3>
          <p data-i18n="about_card3_desc">
            Сайты и системы, созданные нами, приносят прибыль и работают в интересах вашего бизнеса.
          </p>
        </div>
      </div>
    </div>

    <!-- <div class="landing_about_cards">
      <div class="landing_about_card">
        <div class="landing_about_card_icon">
          <img src="img/potential.png">
        </div>
        <h3 class="landing_about_card_title" data-i18n="about_card1_title">Потенциал</h3>
        <button class="landing_about_card_chev" type="button" aria-label="Подробнее">
          <img src="img/chev_down.png" alt="">
        </button>
      </div>

      <div class="landing_about_card">
        <div class="landing_about_card_icon">
          <img src="img/style.png">
        </div>
        <h3 class="landing_about_card_title" data-i18n="about_card2_title">Стиль</h3>
        <button class="landing_about_card_chev" type="button" aria-label="Подробнее">
          <img src="img/chev_down.png" alt="">
        </button>
      </div>

      <div class="landing_about_card">
        <div class="landing_about_card_icon">
          <img src="img/need.png">
        </div>
        <h3 class="landing_about_card_title" data-i18n="about_card3_title">Необходимость</h3>
        <button class="landing_about_card_chev" type="button" aria-label="Подробнее">
          <img src="img/chev_down.png" alt="">
        </button>
      </div>
    </div> -->
  </div>
</div>
<script>
  (function(){
    const cards = document.querySelectorAll('.landing_about_card');

    function closeAll() {
      cards.forEach(c => {
        c.classList.remove('is-open');
        const btn = c.querySelector('.landing_about_card_chev');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }

    cards.forEach(card => {
      card.addEventListener('click', () => {
        const isOpen = card.classList.contains('is-open');
        closeAll();
        if (!isOpen) {
          card.classList.add('is-open');
          const btn = card.querySelector('.landing_about_card_chev');
          if (btn) btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Закрытие по Esc и по клику вне
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
    document.addEventListener('click', e => {
      if (!e.target.closest('.landing_about_card')) closeAll();
    });
  })();
</script>
<!-- LANDING ABOUT -->


<!-- FOOTER -->
<? include 'includes/landing_footer.php'; ?>
<script>
function toggleLangMenuFooter() {
  const menu = document.getElementById('footer_lang_menu');
  menu.classList.toggle('hidden');
}
document.addEventListener('DOMContentLoaded', () => {
  initLang('landing');
});
document.addEventListener('click', function (e) {
  const langBox = document.querySelector('.footer_lang');
  const menu = document.getElementById('footer_lang_menu');
  if (!langBox.contains(e.target)) {
    menu.classList.add('hidden');
  }
});

const lang = localStorage.getItem('lang') || 'es';
  const currentLangEl = document.getElementById('current-lang');
  if (currentLangEl) {
    currentLangEl.textContent = lang.toUpperCase();
  }
</script>
<!-- FOOTER -->

<script src="/js/i18n.js?v=1.0.2"></script>
