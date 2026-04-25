/* ============================================================
   SAFE ASSETS RELOCATION — script.js
   Features: Nav, Hamburger, Slider, FAQ, Form, Counters, Scroll Reveal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Sticky Navbar ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── 2. Hamburger / Mobile Menu ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── 3. Mobile sub-menu toggles ── */
  document.querySelectorAll('.mobile-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.nextElementSibling;
      if (sub) {
        const isOpen = sub.style.maxHeight && sub.style.maxHeight !== '0px';
        sub.style.maxHeight = isOpen ? '0px' : sub.scrollHeight + 'px';
        btn.querySelector('.toggle-icon').textContent = isOpen ? '+' : '−';
      }
    });
  });

  /* ── 4. Testimonial Slider ── */
  const slider = document.querySelector('.testimonial-slider');
  const dotsWrap = document.querySelector('.slider-dots');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');

  if (slider) {
    const cards = slider.querySelectorAll('.testimonial-card');
    let current = 0;
    let perView = getPerView();
    let total = Math.ceil(cards.length / perView);
    let autoTimer;

    function getPerView() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i+1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function goTo(index) {
      current = (index + total) % total;
      const offset = current * (100 / perView) * perView;
      const pct = -(current * (100 / cards.length) * perView);
      // Use pixel-based offset
      const cardWidth = cards[0].offsetWidth + 28; // gap = 28
      slider.style.transform = `translateX(-${current * cardWidth * perView}px)`;
      dotsWrap && dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function goToSmooth(index) {
      current = (index + total) % total;
      const cardWidth = cards[0].offsetWidth + 28;
      slider.style.transform = `translateX(-${current * cardWidth * perView}px)`;
      dotsWrap && dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goToSmooth(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goToSmooth(current + 1); resetAuto(); });

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goToSmooth(current + 1), 5000);
    }

    // Touch support
    let startX = 0;
    slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? goToSmooth(current + 1) : goToSmooth(current - 1); resetAuto(); }
    });

    window.addEventListener('resize', () => {
      const newPer = getPerView();
      if (newPer !== perView) {
        perView = newPer;
        total = Math.ceil(cards.length / perView);
        current = 0;
        buildDots();
        goToSmooth(0);
      }
    });

    buildDots();
    resetAuto();
  }

  /* ── 5. FAQ Accordion ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-question.open').forEach(q => {
        q.classList.remove('open');
        q.nextElementSibling.style.maxHeight = '0';
      });
      // Open clicked if was closed
      if (!isOpen) {
        btn.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ── 6. Animated Counters ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const suffix = el.dataset.suffix || '';
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString() + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
  }

  const counterEls = document.querySelectorAll('.count-up');
  if (counterEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !e.target.dataset.animated) {
          e.target.dataset.animated = 'true';
          animateCounter(e.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => obs.observe(el));
  }

  /* ── 7. Scroll Reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObs.observe(el));
  }

  /* ── 8. Form Validation ── */
  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[data-required]').forEach(field => {
      const group = field.closest('.form-group');
      if (!group) return;
      group.classList.remove('error');
      const val = field.value.trim();
      if (!val) { group.classList.add('error'); valid = false; return; }
      if (field.type === 'tel' && !/^[6-9]\d{9}$/.test(val)) {
        group.classList.add('error');
        const msg = group.querySelector('.error-msg');
        if (msg) msg.textContent = 'Enter valid 10-digit mobile number';
        valid = false;
      }
      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        group.classList.add('error'); valid = false;
      }
    });
    return valid;
  }

  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm(form)) {
        const success = form.querySelector('.form-success');
        const btn = form.querySelector('[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
        setTimeout(() => {
          form.reset();
          if (success) { success.style.display = 'block'; }
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Submit'; }
        }, 1200);
      }
    });
    // Live validation
    form.querySelectorAll('[data-required]').forEach(field => {
      field.addEventListener('blur', () => {
        const group = field.closest('.form-group');
        if (group && field.value.trim()) group.classList.remove('error');
      });
    });
  });

  /* ── 9. Smooth Scroll for Anchor Links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 90, behavior: 'smooth' });
      }
    });
  });

/* ── 10. Set Active Nav Link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || href === './' + currentPage)) {
      link.classList.add('active');
    }
  });


  /* ✅ FIXED: Top Bar INSIDE */
  const topBar = document.getElementById('top-bar');
  if (topBar) {
    const TB_H = window.innerWidth <= 600 ? 38 : 42;
    window.addEventListener('scroll', () => {
      if (window.scrollY > TB_H + 20) {
        topBar.classList.add('tb-hidden');
        if (navbar) navbar.classList.add('tb-gone');
      } else {
        topBar.classList.remove('tb-hidden');
        if (navbar) navbar.classList.remove('tb-gone');
      }
    }, { passive: true });
  }

}); // ✅ ONLY ONE closing
