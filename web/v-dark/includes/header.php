<div class="header">
    <div class="header_logo">
        <img src="img/digilang_black.png">
    </div>
    <div class="header_top_right">
        <div class="header_nav">
            <nav class="nav_links">
                <a href="#">О нас</a>
                <a href="#">Портфолио</a>
                <a href="#contacts">Контакты</a>
            </nav>
            <button class="burger_menu" onclick="toggleMenuBurger(event)">
                <div class="burger_lines">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>
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