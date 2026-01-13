document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("landing_video");
  const source = document.createElement("source");

  const isMobile = window.innerWidth <= 768;

  source.setAttribute("src", isMobile ? "videos/vid_digilang_web_mob.mp4" : "videos/vid_digilang_web.mp4");
  source.setAttribute("type", "video/mp4");

  video.appendChild(source);
  video.load();
});

const track = document.querySelector('.styles_track');
const prev  = document.querySelector('.styles_carousel_btn.prev');
const next  = document.querySelector('.styles_carousel_btn.next');
const badge = document.createElement('span');
badge.className = 'style_card_badge';

function badgeLabel(n){
    const lang = (document.documentElement.lang || '').toLowerCase();
    
    if (lang.startsWith('es')) 
        return `Estilo Nº${n}`;
    
    if (lang.startsWith('en')) 
        return `Style #${n}`;

    return `Стиль №${n}`;
}

function centerIndex(){
    const w = window.innerWidth;
    if (w >= 1100) return 2; // 0..4, центр = 3-я (nth-child(3))
    if (w >= 720)  return 1; // 0..2, центр = 2-я
    return 0;                // мобайл: одна карточка
}

// 3D трансформация карточек (заметная перспектива)
function update3D() {
    const w = window.innerWidth;
    const center = centerIndex();

    // На мобильных отключаем 3D полностью
    if (w < 720) {
        Array.from(track.children).forEach((card, index) => {
            const offset = index - center;
            const absOffset = Math.abs(offset);
            
            // На мобилке показываем только центральную карточку
            if (absOffset > 0) {
                card.style.opacity = '0';
                card.style.visibility = 'hidden';
                card.style.pointerEvents = 'none';
            } else {
                card.style.visibility = 'visible';
                card.style.pointerEvents = 'auto';
                card.style.opacity = '1';
            }
            
            // Сбрасываем все 3D эффекты
            card.style.transform = 'none';
            card.style.zIndex = '';
            card.style.boxShadow = '';
        });

        return;
    }

    // Настройки заметной 3D перспективы
    const angleStep = w >= 1100 ? 18 : 20; // угол поворота (немного уменьшен)
    const scaleStep = 0.03; // небольшое уменьшение
    const opacityStep = 0.08; // легкое затемнение

    Array.from(track.children).forEach((card, index) => {
        const offset = index - center;
        const absOffset = Math.abs(offset);
        
        // Определяем сколько карточек показывать
        const visibleRange = w >= 1100 ? 2 : (w >= 720 ? 1 : 0); // desktop: ±2, tablet: ±1, mobile: 0
        
        // Скрываем карточки за пределами видимого диапазона
        if (absOffset > visibleRange) {
            card.style.opacity = '0';
            card.style.visibility = 'hidden';
            card.style.pointerEvents = 'none';
            return; // пропускаем дальнейшую обработку
        }
        
        // Показываем видимые карточки
        card.style.visibility = 'visible';
        card.style.pointerEvents = 'auto';
        
        // Вычисляем трансформации
        const rotateY = offset * angleStep; // карточки поворачиваются К ЦЕНТРУ
        const scale = Math.max(0.92, 1 - absOffset * scaleStep);
        const opacity = Math.max(0.85, 1 - absOffset * opacityStep);
        const translateZ = offset === 0 ? 40 : -absOffset * 30; // центральная ближе
        
        // Компенсация визуального сжатия: боковые карточки двигаются к центру
        // Чем дальше от центра, тем больше компенсация
        const translateX = offset !== 0 ? -offset * (absOffset * 8) : 0;
        
        // Применяем с компенсацией отступов
        card.style.transform = `
            perspective(1200px)
            translateX(${translateX}px)
            translateZ(${translateZ}px) 
            rotateY(${rotateY}deg) 
            scale(${scale})
        `;

        card.style.opacity = opacity;
        card.style.zIndex = offset === 0 ? 10 : Math.max(1, 5 - absOffset);
        
        // Усиленная тень для центральной карточки
        if (offset === 0) {
            card.style.boxShadow = '0 20px 50px rgba(0, 0, 0, .5)';
        } else {
            card.style.boxShadow = `0 ${12 - absOffset * 2}px ${28 - absOffset * 4}px rgba(0, 0, 0, .3)`;
        }
    });
}

function moveBadgeToCenter() {
    const idx = centerIndex();
    const centerEl = track.children[idx];

    if (!centerEl) return;

    const num = centerEl.dataset.style || (idx + 1);
    badge.textContent = badgeLabel(num);
    centerEl.appendChild(badge);

    update3D(); // обновляем 3D после перемещения badge
}

let isAnimating = false;
let shift = 0;

function calcShift() {
    const first = track.querySelector('.style_card');
    const gap = parseFloat(getComputedStyle(track).gap || 0);
    shift = first.getBoundingClientRect().width + gap;
    moveBadgeToCenter();
}

function animateToZero(startX, done) {
    track.style.transition = 'none';
    track.style.transform  = `translate3d(${startX}px,0,0)`;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
        track.style.transition = 'transform .5s cubic-bezier(0.4, 0, 0.2, 1)';
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

    // Перемещаем элемент
    track.append(track.firstElementChild);

    // Обновляем badge и 3D одновременно
    moveBadgeToCenter();

    // Запускаем анимацию
    animateToZero(shift);
}

function goPrev() {
    if (isAnimating) return;
    isAnimating = true;

    // Перемещаем элемент
    track.prepend(track.lastElementChild);

    // Обновляем badge и 3D одновременно
    moveBadgeToCenter();

    // Запускаем анимацию
    animateToZero(-shift);
}

// Инициализация
calcShift();
update3D();

// События
window.addEventListener('resize', () => {
    calcShift();
    update3D();
});

next.addEventListener('click', goNext);
prev.addEventListener('click', goPrev);

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
        track.style.transition = 'transform .5s cubic-bezier(0.4, 0, 0.2, 1)';
        track.style.transform  = `translateX(${-shift}px)`;

        track.addEventListener('transitionend', function onEnd() {
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
        
        track.style.transition = 'transform .5s cubic-bezier(0.4, 0, 0.2, 1)';
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