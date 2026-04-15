// ─── Footer form ─────────────────────────────────────────────────────────────
async function footerSend(e) {
  e.preventDefault();
  const name  = document.getElementById('footer_name').value.trim();
  const phone = document.getElementById('footer_phone').value.trim();
  const msg   = document.getElementById('footer_msg').value.trim();

  let url = 'https://wa.me/541144724911?text=';
  const dict = await getLangDict('landing', getLang());

  if (name)  url += `${dict['footer_name_plh'] || 'Name'}: ${name}\n`;
  if (phone) url += `${dict['footer_phone_plh'] || 'Phone'}: ${phone}\n`;
  if (msg)   url += `\n${msg}`;

  window.open(encodeURI(url), '_blank');
}

document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("landing_video");
  const source = document.createElement("source");

  const isMobile = window.innerWidth <= 768;

  source.setAttribute("src", isMobile ? "videos/vid_digilang_web_mob.mp4" : "videos/vid_digilang_web.mp4");
  source.setAttribute("type", "video/mp4");

  video.appendChild(source);
  video.load();
});

// ─── Styles Carousel ─────────────────────────────────────────────────────────
(function () {
  const track   = document.querySelector('.styles_track');
  const prev    = document.querySelector('.styles_carousel_btn.prev');
  const next    = document.querySelector('.styles_carousel_btn.next');
  const viewport = document.querySelector('.styles_viewport');

  const badge = document.createElement('span');
  badge.className = 'style_card_badge';

  const DURATION = 480; // ms — matches CSS card transition

  function badgeLabel(n) {
    const lang = (document.documentElement.lang || '').toLowerCase();
    if (lang.startsWith('es')) return `Estilo Nº${n}`;
    if (lang.startsWith('en')) return `Style #${n}`;
    return `Стиль №${n}`;
  }

  function centerIndex() {
    const w = window.innerWidth;
    if (w >= 1100) return 2;
    if (w >= 720)  return 1;
    return 0;
  }

  function update3D() {
    const w           = window.innerWidth;
    const center      = centerIndex();
    const visibleRange = w >= 1100 ? 2 : w >= 720 ? 1 : 0;

    Array.from(track.children).forEach((card, i) => {
      const offset = i - center;
      const abs    = Math.abs(offset);

      // Hide cards outside visible range
      if (abs > visibleRange) {
        card.style.opacity       = '0';
        card.style.visibility    = 'hidden';
        card.style.pointerEvents = 'none';
        card.style.transform     = 'perspective(1400px) translateZ(-80px)';
        card.style.zIndex        = '0';
        card.style.boxShadow     = 'none';
        return;
      }

      card.style.visibility    = 'visible';
      card.style.pointerEvents = 'auto';

      // Mobile: flat single card, no 3D
      if (w < 720) {
        card.style.transform = 'none';
        card.style.opacity   = '1';
        card.style.zIndex    = '1';
        card.style.boxShadow = '0 12px 32px rgba(0,0,0,.5)';
        return;
      }

      // Desktop / Tablet: 3D fan
      const angleStep  = w >= 1100 ? 24 : 28;
      const rotateY    = offset * angleStep;
      const scale      = 1 - abs * 0.055;
      const opacity    = 1 - abs * 0.2;
      const translateZ = offset === 0 ? 80 : -abs * 60;
      // Compress side cards toward center to compensate perspective foreshortening
      const translateX = -offset * abs * 12;

      card.style.transform = `perspective(1400px) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity   = String(Math.max(0.35, opacity));
      card.style.zIndex    = String(offset === 0 ? 10 : Math.max(1, 5 - abs));
      card.style.boxShadow = offset === 0
        ? '0 28px 64px rgba(0,0,0,.65), 0 0 0 1px rgba(255,255,255,0.06)'
        : `0 ${10 - abs * 2}px ${24 - abs * 4}px rgba(0,0,0,.35)`;
    });
  }

  function moveBadge() {
    const center   = centerIndex();
    const centerEl = track.children[center];
    if (!centerEl) return;
    badge.textContent = badgeLabel(centerEl.dataset.style || center + 1);
    centerEl.appendChild(badge);
  }

  let shift       = 0;
  let isAnimating = false;
  let animTimer   = null;

  function calcShift() {
    const card = track.querySelector('.style_card');
    const gap  = parseFloat(getComputedStyle(track).gap) || 0;
    shift = card.getBoundingClientRect().width + gap;
  }

  function go(direction) {
    if (isAnimating) return;
    isAnimating = true;
    clearTimeout(animTimer);

    if (direction > 0) {
      track.append(track.firstElementChild);
      track.style.transition = 'none';
      track.style.transform  = `translate3d(${shift}px,0,0)`;
    } else {
      track.prepend(track.lastElementChild);
      track.style.transition = 'none';
      track.style.transform  = `translate3d(${-shift}px,0,0)`;
    }

    // Force reflow so the browser sees the instant offset before animating
    void track.offsetWidth;

    track.style.transition = `transform ${DURATION}ms cubic-bezier(0.4,0,0.2,1)`;
    track.style.transform  = 'translate3d(0,0,0)';

    moveBadge();
    update3D();

    animTimer = setTimeout(() => {
      track.style.transition = 'none';
      isAnimating = false;
    }, DURATION + 20);
  }

  // Touch swipe
  let touchStartX = 0;
  viewport.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  }, { passive: true });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft')  go(-1);
  });

  // Init
  calcShift();
  moveBadge();
  update3D();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { calcShift(); update3D(); }, 120);
  });

  next.addEventListener('click', () => go(1));
  prev.addEventListener('click', () => go(-1));
})();

// ─── Landing About cards (mobile tap) ────────────────────────────────────────
(function () {
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

// ─── Clients Carousel ────────────────────────────────────────────────────────
(function () {
  const track    = document.querySelector('.carousel_track');
  const prev     = document.querySelector('.carousel_btn.prev');
  const next     = document.querySelector('.carousel_btn.next');
  const viewport = document.querySelector('.carousel_viewport');

  const DURATION = 480;

  function centerIndex() {
    return window.innerWidth >= 720 ? 1 : 0;
  }

  function updateFlat() {
    const w            = window.innerWidth;
    const center       = centerIndex();
    const visibleRange = w >= 720 ? 1 : 0;

    /* Только на больших экранах показываем всю ленту (половинки по краям) */
    if (w >= 1024) {
      Array.from(track.children).forEach((card) => {
        card.style.opacity       = '1';
        card.style.visibility    = 'visible';
        card.style.pointerEvents = 'auto';
        card.style.transform     = 'none';
        card.style.zIndex        = '1';
      });
      return;
    }

    Array.from(track.children).forEach((card, i) => {
      const offset = i - center;
      const abs    = Math.abs(offset);

      if (abs > visibleRange) {
        card.style.opacity       = '0';
        card.style.visibility    = 'hidden';
        card.style.pointerEvents = 'none';
        card.style.transform     = 'none';
        return;
      }

      card.style.visibility    = 'visible';
      card.style.pointerEvents = 'auto';
      card.style.transform     = 'none';
      card.style.opacity       = '1';
      card.style.zIndex        = '1';
    });
  }

  let shift       = 0;
  let isAnimating = false;
  let animTimer   = null;

  function calcShift() {
    const card = track.querySelector('.card');
    const gap  = parseFloat(getComputedStyle(track).gap) || 0;
    shift = card.getBoundingClientRect().width + gap;
  }

  function go(direction) {
    if (isAnimating) return;
    isAnimating = true;
    clearTimeout(animTimer);

    if (direction > 0) {
      track.append(track.firstElementChild);
      track.style.transition = 'none';
      track.style.transform  = `translate3d(${shift}px,0,0)`;
    } else {
      track.prepend(track.lastElementChild);
      track.style.transition = 'none';
      track.style.transform  = `translate3d(${-shift}px,0,0)`;
    }

    void track.offsetWidth;

    track.style.transition = `transform ${DURATION}ms cubic-bezier(0.4,0,0.2,1)`;
    track.style.transform  = 'translate3d(0,0,0)';

    updateFlat();

    animTimer = setTimeout(() => {
      track.style.transition = 'none';
      isAnimating = false;
    }, DURATION + 20);
  }

  // Touch swipe
  let touchStartX = 0;
  viewport.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  }, { passive: true });

  calcShift();
  updateFlat();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { calcShift(); updateFlat(); }, 120);
  });

  next.addEventListener('click', () => go(1));
  prev.addEventListener('click', () => go(-1));
})();

// ─── Clients Cards Overlay ────────────────────────────────────────────────────
(function () {
  const cards = document.querySelectorAll('.card');

  function closeAll() {
    cards.forEach(c => c.classList.remove('is-open'));
  }

  cards.forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      const wasOpen = card.classList.contains('is-open');
      if (wasOpen) {
        card.classList.remove('is-open');
      } else {
        closeAll();
        card.classList.add('is-open');
      }
    });

    const ov = card.querySelector('.card_overlay');
    ov?.addEventListener('click', e => {
      if (!e.target.closest('.card_overlay_btn') && !e.target.closest('a')) {
        card.classList.remove('is-open');
        e.stopPropagation();
      }
    });
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
  document.addEventListener('click', e => { if (!e.target.closest('.card')) closeAll(); });
  document.addEventListener('touchstart', e => {
    if (!e.target.closest('.card')) closeAll();
  }, { passive: true });
})();
