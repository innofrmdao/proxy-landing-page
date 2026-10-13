/* =========================================================
   ProxyForge — script.js
   Vanilla JS interactions for the landing page
   ========================================================= */

(function () {
  'use strict';

  /* =========================================================
     1. NAVBAR — scrolled state + mobile menu toggle
     ========================================================= */
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 8) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* =========================================================
     2. HERO — animated counter for stats
     ========================================================= */
  const counters = document.querySelectorAll('.stat-num');

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);

      // Format with commas for large numbers
      el.textContent =
        value >= 1000
          ? value.toLocaleString() + suffix
          : value + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    };

    requestAnimationFrame(tick);
  };

  // Trigger counters when hero stats are in view
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            counters.forEach(animateCount);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(statsSection);
  }

  /* =========================================================
     3. HERO — live proxy stream (fake but looks real)
     ========================================================= */
  const proxyList = document.getElementById('proxyList');

  const locations = [
    { flag: '🇺🇸', code: 'US' },
    { flag: '🇩🇪', code: 'DE' },
    { flag: '🇬🇧', code: 'UK' },
    { flag: '🇸🇬', code: 'SG' },
    { flag: '🇯🇵', code: 'JP' },
    { flag: '🇧🇷', code: 'BR' },
    { flag: '🇫🇷', code: 'FR' },
    { flag: '🇨🇦', code: 'CA' },
    { flag: '🇦🇺', code: 'AU' },
    { flag: '🇳🇱', code: 'NL' },
  ];

  const randomIP = () => {
    return [
      Math.floor(Math.random() * 223) + 1,
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    ].join('.') + ':' + (Math.random() > 0.5 ? '8080' : '3128');
  };

  const randomSpeed = () => Math.floor(Math.random() * 40) + 15; // 15–55ms

  const renderProxyRow = (loc) => {
    const row = document.createElement('div');
    row.className = 'proxy-row';
    row.innerHTML = `
      <span class="ip">${randomIP()}</span>
      <span class="loc"><span>${loc.flag}</span> ${loc.code}</span>
      <span class="speed">${randomSpeed()} ms</span>
    `;
    return row;
  };

  const initProxyList = () => {
    if (!proxyList) return;
    proxyList.innerHTML = '';
    // Start with 5 rows
    for (let i = 0; i < 5; i++) {
      const loc = locations[i % locations.length];
      proxyList.appendChild(renderProxyRow(loc));
    }
  };

  const rotateProxy = () => {
    if (!proxyList || proxyList.children.length === 0) return;

    // Remove top row
    const first = proxyList.firstElementChild;
    first.style.transition = 'opacity 0.25s, transform 0.25s';
    first.style.opacity = '0';
    first.style.transform = 'translateY(-8px)';

    setTimeout(() => {
      first.remove();
      // Add new row at the bottom
      const loc = locations[Math.floor(Math.random() * locations.length)];
      proxyList.appendChild(renderProxyRow(loc));
    }, 260);
  };

  initProxyList();
  // Rotate a proxy every 2.2s
  setInterval(rotateProxy, 2200);

  /* =========================================================
     4. PRICING — monthly/yearly toggle
     ========================================================= */
  const billingToggle = document.getElementById('billingToggle');
  const priceEls = document.querySelectorAll('.price');

  const updatePrices = (period) => {
    priceEls.forEach((el) => {
      const value = el.dataset[period];
      if (value !== undefined) {
        el.style.opacity = '0';
        setTimeout(() => {
          el.textContent = value;
          el.style.opacity = '1';
        }, 120);
      }
    });
  };

  if (billingToggle) {
    billingToggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.toggle-btn');
      if (!btn) return;

      billingToggle
        .querySelectorAll('.toggle-btn')
        .forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      updatePrices(btn.dataset.period);
    });
  }

  /* =========================================================
     5. FAQ — accordion (only one open at a time)
     ========================================================= */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* =========================================================
     6. TOAST — for demo buttons
     ========================================================= */
  const toast = document.getElementById('toast');
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2600);
  };

  // Any element with data-toast will fire a toast on click
  document.querySelectorAll('[data-toast]').forEach((el) => {
    el.addEventListener('click', (e) => {
      // Let anchor links still navigate
      const msg = el.getAttribute('data-toast');
      if (msg) showToast(msg);
    });
  });

  /* =========================================================
     7. SMOOTH SCROLL — for anchor links (fallback for older browsers)
     ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top =
          target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* =========================================================
     8. SCROLL REVEAL — fade-in sections on view
     ========================================================= */
  const revealEls = document.querySelectorAll(
    '.section-header, .feature-card, .price-card, .loc-card, .faq-item, .cta-inner'
  );

  revealEls.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* =========================================================
     9. CONSOLE SIGNATURE
     ========================================================= */
  console.log(
    '%c⬢ ProxyForge',
    'color:#2563eb;font-size:16px;font-weight:700;',
    '— landing page ready. All interactions are client-side demo.'
  );
})();
