/* Shared site behavior: nav scroll, mobile menu, reveal */
(function(){
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.mobile-menu');

  // Determine nav style mode from data attr: "hero-dark" or "light"
  const mode = nav?.dataset.mode || 'light';

  function updateNav() {
    if (!nav) return;
    const scrolled = window.scrollY > 40;
    nav.classList.remove('transparent-dark', 'solid-dark', 'solid-light');
    if (mode === 'hero-dark') {
      if (scrolled) nav.classList.add('solid-dark');
      else nav.classList.add('transparent-dark');
    } else {
      nav.classList.add('solid-light');
    }
  }
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  // Mobile menu
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      nav.classList.toggle('menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        nav.classList.remove('menu-open');
        document.body.style.overflow = '';
      });
    });
  }

  // Reveal on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Stat counter animation
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.round(target * eased);
        el.textContent = val + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-target]').forEach(el => statObserver.observe(el));
})();
