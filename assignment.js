
  // Mobile menu toggle
  const btnMenu = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  btnMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Initialize
  fetchCategories();

