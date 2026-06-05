/* ============================================================
   Los Shakas - Bar y Restaurante
   js/main.js  --  Shared across all 4 pages
   ============================================================ */

const LANG_KEY = 'lshakas_lang';

/* ----------------------------------------------------------
   1. PAGE LOADER
   ---------------------------------------------------------- */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Hide loader after 1.5s, then remove from accessibility tree
  setTimeout(() => {
    loader.classList.add('hidden');
    setTimeout(() => {
      loader.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }, 400);
  }, 1500);
}

/* ----------------------------------------------------------
   2. LANGUAGE TOGGLE
   ---------------------------------------------------------- */
function getLang() {
  return localStorage.getItem(LANG_KEY) || 'es';
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  applyLang(lang);
  updateLangButtons(lang);
}

function applyLang(lang) {
  // Fade-effect on body sections
  document.body.classList.add('lang-transitioning');

  setTimeout(() => {
    // Swap all data-es / data-en elements
    document.querySelectorAll('[data-es][data-en]').forEach(el => {
      el.textContent = el.getAttribute('data-' + lang);
    });

    // Also handle elements that only carry one lang attribute pair
    // for HTML content (data-es-html / data-en-html)
    document.querySelectorAll('[data-es-html][data-en-html]').forEach(el => {
      el.innerHTML = el.getAttribute('data-' + lang + '-html');
    });

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Update page title if available
    const titleEl = document.querySelector('[data-es-title][data-en-title]');
    if (titleEl) {
      document.title = titleEl.getAttribute('data-' + lang + '-title');
    }

    document.body.classList.remove('lang-transitioning');
  }, 100);
}

function updateLangButtons(lang) {
  document.querySelectorAll('.lang-btn-es').forEach(btn => {
    btn.classList.toggle('active', lang === 'es');
  });
  document.querySelectorAll('.lang-btn-en').forEach(btn => {
    btn.classList.toggle('active', lang === 'en');
  });
}

function initLang() {
  const lang = getLang();

  // Immediately apply (no transition on first load)
  document.querySelectorAll('[data-es][data-en]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang);
  });
  document.querySelectorAll('[data-es-html][data-en-html]').forEach(el => {
    el.innerHTML = el.getAttribute('data-' + lang + '-html');
  });
  document.documentElement.lang = lang;

  updateLangButtons(lang);

  // Wire toggle buttons
  document.querySelectorAll('.lang-btn-es').forEach(btn => {
    btn.addEventListener('click', () => setLang('es'));
  });
  document.querySelectorAll('.lang-btn-en').forEach(btn => {
    btn.addEventListener('click', () => setLang('en'));
  });
}

/* ----------------------------------------------------------
   3. STICKY NAV + SCROLL BLUR
   ---------------------------------------------------------- */
function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ----------------------------------------------------------
   4. HAMBURGER MENU
   ---------------------------------------------------------- */
function initHamburger() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  const navEl = document.getElementById('main-nav');
  document.addEventListener('click', (e) => {
    if (navEl && !navEl.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
}

/* ----------------------------------------------------------
   5. INTERSECTION OBSERVER -- scroll reveal
   ---------------------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings by index within their parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 80;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  items.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------------
   6. GALLERY LIGHTBOX
   ---------------------------------------------------------- */
function initLightbox() {
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightbox-img');
  const lbClose    = document.getElementById('lightbox-close');
  const lbPrev     = document.getElementById('lightbox-prev');
  const lbNext     = document.getElementById('lightbox-next');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item img'));

  if (!lightbox || !galleryItems.length) return;

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lbImg.src = galleryItems[currentIndex].src;
    lbImg.alt = galleryItems[currentIndex].alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    lbImg.src = galleryItems[currentIndex].src;
    lbImg.alt = galleryItems[currentIndex].alt;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    lbImg.src = galleryItems[currentIndex].src;
    lbImg.alt = galleryItems[currentIndex].alt;
  }

  // Wire gallery item clicks
  document.querySelectorAll('.gallery-item').forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', showPrev);
  lbNext.addEventListener('click', showNext);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });

  // Touch swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) showNext();
      else showPrev();
    }
  }, { passive: true });
}

/* ----------------------------------------------------------
   7. ACTIVE NAV LINK
   ---------------------------------------------------------- */
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-page-link').forEach(link => {
    const href = link.getAttribute('href');
    const isActive = href === page || (page === '' && href === 'index.html');
    link.classList.toggle('active', isActive);
  });
}

/* ----------------------------------------------------------
   INIT
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflow = 'hidden'; // prevent scroll during loader
  initLoader();
  initLang();
  initNav();
  initHamburger();
  initReveal();
  initLightbox();
  setActiveNav();
});
