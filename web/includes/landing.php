<!-- HEADER -->
<? include 'includes/landing_header.php'; ?>
<script>
function toggleLangMenuHeader() {
  const menu = document.getElementById('header_lang_menu');
  menu.classList.toggle('hidden');
}
document.addEventListener('DOMContentLoaded', () => {
  initLang('main');
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

<!-- FOOTER -->
<? include 'includes/landing_footer.php'; ?>
<script>
function toggleLangMenuFooter() {
  const menu = document.getElementById('footer_lang_menu');
  menu.classList.toggle('hidden');
}
document.addEventListener('DOMContentLoaded', () => {
  initLang('main');
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
