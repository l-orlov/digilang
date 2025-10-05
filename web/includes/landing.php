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
    <video id="landing_video" autoplay muted loop playsinline class="landing_video_bg"></video>
    <div class="landing_video_overlay">
      <div class="landing_video_text">
        <h1 data-i18n="hero_title">У вас нет сайта?</h1>
        <ul class="landing_video_list">
          <li data-i18n="hero_bullet1">В современном мире клиенты выбирают тех, кого видят онлайн.</li>
          <li data-i18n="hero_bullet2">У кого нет сайта — у того нет будущего.</li>
          <li data-i18n="hero_bullet3">Мы создадим сайт, оцифруем и автоматизируем ваш бизнес!</li>
        </ul>
        <button class="btn button_text" data-i18n="hero_cta">Получить консультацию</button>
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

<!-- STYLES -->
<div class="landing_styles">
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
<script>
(function () {
  const track = document.querySelector('.styles_track');
  const prev  = document.querySelector('.styles_carousel_btn.prev');
  const next  = document.querySelector('.styles_carousel_btn.next');

  // один общий бэдж
  const badge = document.createElement('span');
  badge.className = 'style_card_badge';

  // локализация подписи (по желанию)
  function badgeLabel(n){
    const lang = (document.documentElement.lang || '').toLowerCase();
    if (lang.startsWith('es')) return `Estilo Nº${n}`;
    if (lang.startsWith('en')) return `Style #${n}`;
    return `Стиль №${n}`;
  }

  // какой DOM-индекс центральной карточки сейчас видим?
  function centerIndex(){
    const w = window.innerWidth;
    if (w >= 1100) return 2; // 0..4, центр = 3-я (nth-child(3))
    if (w >= 720)  return 1; // 0..2, центр = 2-я
    return 0;                // мобайл: одна карточка
  }

  // переместить бэдж в центр и обновить номер
  function moveBadgeToCenter(){
    const idx = centerIndex();
    const centerEl = track.children[idx];
    if (!centerEl) return;

    const num = centerEl.dataset.style || (idx + 1);
    badge.textContent = badgeLabel(num);

    // положить бэдж внутрь центральной карточки
    centerEl.appendChild(badge);
  }

  let isAnimating = false;
  let shift = 0;

  function calcShift() {
    const first = track.querySelector('.style_card');
    const gap = parseFloat(getComputedStyle(track).gap || 0);
    shift = first.getBoundingClientRect().width + gap;
    moveBadgeToCenter(); // при ресайзе пересчитать центр и переставить бэдж
  }

  function animateToZero(startX, done) {
    track.style.transition = 'none';
    track.style.transform  = `translate3d(${startX}px,0,0)`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        track.style.transition = 'transform .35s ease';
        track.style.transform  = 'translate3d(0,0,0)';
        track.addEventListener('transitionend', () => {
          track.style.transition = 'none';
          isAnimating = false;
          done && done();
        }, { once: true });
      });
    });
  }

  function goNext() {
    if (isAnimating) return;
    isAnimating = true;

    // сначала переставляем — потом двигаем
    track.append(track.firstElementChild);
    moveBadgeToCenter();          // бэдж сразу на новый центр
    animateToZero(shift);
  }

  function goPrev() {
    if (isAnimating) return;
    isAnimating = true;

    track.prepend(track.lastElementChild);
    moveBadgeToCenter();          // бэдж сразу на новый центр
    animateToZero(-shift);
  }

  calcShift();
  window.addEventListener('resize', calcShift);
  next.addEventListener('click', goNext);
  prev.addEventListener('click', goPrev);
})();
</script>
<!-- STYLES -->

<!-- LANDING ABOUT -->
<div class="landing_about">
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
          <h3 class="landing_about_card_panel_title" data-i18n="about_card1_title">Потенциал</h3>
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
          <h3 class="landing_about_card_panel_title" data-i18n="about_card1_title">Потенциал</h3>
          <p data-i18n="about_card3_desc">
            Сайты и системы, созданные нами, приносят прибыль и работают в интересах вашего бизнеса.
          </p>
        </div>
      </div>
    </div>
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
  document.addEventListener('click', e => {
    if (!e.target.closest('.landing_about_card')) closeAll();
  });
})();
</script>
<!-- LANDING ABOUT -->

<!-- CLIENTS -->
<div class="landing_clients">
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
          <img src="img/1.png" alt="">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4 data-i18n="clients_card1_title">Проект 1</h4>
              <a href="#" class="card_overlay_btn" data-i18n="clients_card_btn">узнать больше</a>
            </div>
          </div>
        </li>
        <li class="card">
          <img src="img/2.png" alt="">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4 data-i18n="clients_card2_title">Проект 2</h4>
              <a href="#" class="card_overlay_btn" data-i18n="clients_card_btn">узнать больше</a>
            </div>
          </div>
        </li>
        <li class="card">
          <img src="img/3.png" alt="">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4 data-i18n="clients_card3_title">Проект 3</h4>
              <a href="#" class="card_overlay_btn" data-i18n="clients_card_btn">узнать больше</a>
            </div>
          </div>
        </li>
        <li class="card">
          <img src="img/4.png" alt="">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4 data-i18n="clients_card4_title">Проект 4</h4>
              <a href="#" class="card_overlay_btn" data-i18n="clients_card_btn">узнать больше</a>
            </div>
          </div>
        </li>
        <li class="card">
          <img src="img/5.png" alt="">
          <div class="card_overlay" aria-hidden="true">
            <div class="card_overlay_content">
              <h4 data-i18n="clients_card5_title">Проект 5</h4>
              <a href="#" class="card_overlay_btn" data-i18n="clients_card_btn">узнать больше</a>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <button class="carousel_btn next" aria-label="Вперёд">&#9654;</button>
  </div>
  <div class="clients_cta">
    <button class="clients_cta_btn" data-i18n="clients_cta">Получить консультацию</button>
  </div>
</div>
<script>
(function(){
  const track = document.querySelector('.carousel_track');
  const prev  = document.querySelector('.carousel_btn.prev');
  const next  = document.querySelector('.carousel_btn.next');
  let isAnimating = false;
  let shift = 0;
  function calcShift(){
    const slide = track.querySelector('.card');
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || 0);
    shift = slide.getBoundingClientRect().width + gap;
  }
  function goNext(){
    if (isAnimating) return;
    isAnimating = true;
    track.style.transition = 'transform .35s ease';
    track.style.transform  = `translateX(${-shift}px)`;
    track.addEventListener('transitionend', function onEnd(){
      track.removeEventListener('transitionend', onEnd);
      track.append(track.firstElementChild);      // первый -> в конец
      track.style.transition = 'none';
      track.style.transform  = 'translateX(0)';
      void track.offsetWidth;
      isAnimating = false;
    }, {once:true});
  }
  function goPrev(){
    if (isAnimating) return;
    isAnimating = true;
    track.style.transition = 'none';
    track.prepend(track.lastElementChild);        // последний -> в начало
    track.style.transform  = `translateX(${-shift}px)`;
    void track.offsetWidth;
    track.style.transition = 'transform .35s ease';
    track.style.transform  = 'translateX(0)';
    track.addEventListener('transitionend', () => { isAnimating = false; }, {once:true});
  }
  calcShift();
  window.addEventListener('resize', calcShift);
  next.addEventListener('click', goNext);
  prev.addEventListener('click', goPrev);
})();

(function(){
  const cards = document.querySelectorAll('.card');
  function closeAll(){
    cards.forEach(c => c.classList.remove('is-open'));
  }
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;      // ссылки не трогаем
      const wasOpen = card.classList.contains('is-open');
      if (wasOpen) {
        card.classList.remove('is-open');     // повторный клик — закрыть
      } else {
        closeAll();                            // открыть только одну
        card.classList.add('is-open');
      }
    });
    const ov = card.querySelector('.card_overlay');
    ov?.addEventListener('click', (e) => {
      if (!e.target.closest('.card_overlay_btn') && !e.target.closest('a')) {
        card.classList.remove('is-open');
        e.stopPropagation();                  // чтобы не сработал верхний обработчик
      }
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.card')) closeAll();
  });
  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.card')) closeAll();
  }, { passive: true });
})();
</script>
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
    <button class="timeline_cta_btn" data-i18n="tl_cta_btn">Заказать сайт</button>
  </div>
</div>
<!-- SERVICES TIMELINE -->

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
