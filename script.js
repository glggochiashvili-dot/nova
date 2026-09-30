/**
 * NEXORA - Interactive Landing Page Logic
 * Features:
 * - Theme Switcher (Dark/Light mode with localStorage persistence)
 * - Sticky Header with Glassmorphism on Scroll
 * - Active Scrollspy Navigation
 * - Mobile Drawer Menu Toggle
 * - Statistics Number Counter Animation (IntersectionObserver)
 * - Interactive Feature Category Filter
 * - Form Validation with Loading State and Animated Toast Notification
 * - Interactive 3D Card Hover Tilt Effect
 * - Back to Top Button
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Theme Switcher (Dark / Light Mode) ---
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('nexora-theme') || 'dark';

  document.body.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('nexora-theme', newTheme);
    });
  }

  // --- 2. Header Scroll Effect & Back-to-Top Visibility ---
  const siteHeader = document.getElementById('site-header');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header styling
    if (scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // Back to top button
    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- 3. Mobile Navigation Menu Toggle ---
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggleBtn && mobileMenuDrawer) {
    const toggleMobileMenu = () => {
      const isOpen = mobileMenuDrawer.classList.toggle('active');
      mobileToggleBtn.classList.toggle('active', isOpen);
      mobileToggleBtn.setAttribute('aria-expanded', isOpen);
    };

    mobileToggleBtn.addEventListener('click', toggleMobileMenu);

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenuDrawer.classList.remove('active');
        mobileToggleBtn.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 4. Scrollspy Active Navigation Links ---
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  const onScrollSpy = () => {
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        desktopNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScrollSpy, { passive: true });

  // --- 5. Animated Number Counters (Hero Metrics) ---
  const metricNumbers = document.querySelectorAll('.metric-number');
  let metricsAnimated = false;

  const animateCounters = () => {
    metricNumbers.forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      let current = 0;
      const increment = target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
          clearInterval(timer);
        } else {
          counter.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
        }
      }, stepTime);
    });
  };

  if ('IntersectionObserver' in window && metricNumbers.length > 0) {
    const metricsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !metricsAnimated) {
          animateCounters();
          metricsAnimated = true;
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    const metricsContainer = document.querySelector('.hero-metrics');
    if (metricsContainer) {
      metricsObserver.observe(metricsContainer);
    }
  } else {
    animateCounters();
  }

  // --- 6. Features Tab Filter ---
  const filterTabs = document.querySelectorAll('.filter-tab');
  const featureCards = document.querySelectorAll('.feature-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-category');

      featureCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');

        if (filter === 'all' || cardCategory === filter) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- 7. Hero Dashboard 3D Tilt Effect on Desktop ---
  const heroCard = document.querySelector('.glass-dashboard-card');
  if (heroCard && window.matchMedia('(min-width: 1024px)').matches) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // --- 8. Contact Form Handling & Toast Notification ---
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const toastNotification = document.getElementById('toast-notification');
  const toastCloseBtn = document.getElementById('toast-close-btn');

  let toastTimer;

  const showToast = (title, message, isSuccess = true) => {
    const toastTitle = document.getElementById('toast-title');
    const toastMsg = document.getElementById('toast-message');

    if (toastTitle) toastTitle.textContent = title;
    if (toastMsg) toastMsg.textContent = message;

    toastNotification.classList.add('active');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 4500);
  };

  if (toastCloseBtn) {
    toastCloseBtn.addEventListener('click', () => {
      toastNotification.classList.remove('active');
      clearTimeout(toastTimer);
    });
  }

  if (contactForm) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.classList.add('error');
        nameError.classList.add('visible');
        isValid = false;
      } else {
        nameInput.classList.remove('error');
        nameError.classList.remove('visible');
      }

      // Validate Email
      if (!validateEmail(emailInput.value.trim())) {
        emailInput.classList.add('error');
        emailError.classList.add('visible');
        isValid = false;
      } else {
        emailInput.classList.remove('error');
        emailError.classList.remove('visible');
      }

      // Validate Message
      if (messageInput.value.trim().length < 10) {
        messageInput.classList.add('error');
        messageError.classList.add('visible');
        isValid = false;
      } else {
        messageInput.classList.remove('error');
        messageError.classList.remove('visible');
      }

      if (!isValid) return;

      // Simulate API submission
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        contactForm.reset();

        showToast(
          'მადლობა, შეტყობინება მიღებულია!',
          'ჩვენი ექსპერტი უახლოეს 15 წუთში დაგიკავშირდებათ.',
          true
        );
      }, 1200);
    });

    // Realtime error clearing
    [nameInput, emailInput, messageInput].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => {
          input.classList.remove('error');
          const errorSpan = input.closest('.form-group')?.querySelector('.error-msg');
          if (errorSpan) errorSpan.classList.remove('visible');
        });
      }
    });
  }
});
