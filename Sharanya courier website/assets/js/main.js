/* ==========================================================================
   SHARANYA COURIER SERVICE - MAIN JS INTERACTIVITY
   Navbar, Mobile Drawer, Counters, Testimonials, Toast & Scroll Effects
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initStatsCounter();
  initTestimonialsCarousel();
  initSmoothScroll();
  initFormToastHandlers();
});

/* --- NAVBAR STICKY & ACTIVE LINK --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Highlight Active Link
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --- MOBILE HAMBURGER DRAWER --- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav-overlay');

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile drawer when clicking a link
  const mobileLinks = mobileNav.querySelectorAll('.nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* --- STATS COUNTER ANIMATION --- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseFloat(target.getAttribute('data-target'));
        const suffix = target.getAttribute('data-suffix') || '';
        const decimals = target.getAttribute('data-decimals') || '0';
        let current = 0;
        const duration = 2000;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = countTo / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= countTo) {
            current = countTo;
            clearInterval(timer);
          }
          target.innerText = (decimals === '1' ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
        }, stepTime);

        obs.unobserve(target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => observer.observe(num));
}

/* --- TESTIMONIAL CAROUSEL SLIDER --- */
function initTestimonialsCarousel() {
  const testimonials = [
    {
      quote: "Sharanya Courier delivered our high-value medical equipment from Mumbai to Delhi in less than 12 hours! Incredible live tracking precision and professional handling.",
      name: "Dr. Rajesh Malhotra",
      role: "Director, LifeCare Health Solutions",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    {
      quote: "As an e-commerce brand dispatching 5,000+ orders weekly across India, Sharanya's automated logistics network reduced our transit delays by 40%.",
      name: "Priya Sharma",
      role: "Operations Head, StyleCraft E-Store",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
    },
    {
      quote: "The express air freight team handled our urgent automotive parts shipment seamlessly. Instant pricing calculator and zero hassle customs support!",
      name: "Vikram Sengupta",
      role: "Supply Chain Manager, Apex Auto Ltd.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    }
  ];

  const cardContainer = document.querySelector('.testimonial-card-dynamic');
  if (!cardContainer) return;

  let currentIndex = 0;

  function renderTestimonial(index) {
    const item = testimonials[index];
    cardContainer.style.opacity = '0';
    cardContainer.style.transform = 'translateY(10px)';

    setTimeout(() => {
      cardContainer.innerHTML = `
        <div class="stars-row">
          <i class="lucide-star">★</i><i class="lucide-star">★</i><i class="lucide-star">★</i><i class="lucide-star">★</i><i class="lucide-star">★</i>
        </div>
        <p class="testimonial-quote">"${item.quote}"</p>
        <div class="author-info">
          <img src="${item.avatar}" alt="${item.name}" class="author-avatar" />
          <div style="text-align: left;">
            <h4 style="color:#FFF; font-size:1.1rem;">${item.name}</h4>
            <p style="color:var(--text-light-muted); font-size:0.85rem;">${item.role}</p>
          </div>
        </div>
      `;
      cardContainer.style.transition = 'all 0.4s ease';
      cardContainer.style.opacity = '1';
      cardContainer.style.transform = 'translateY(0)';
    }, 200);
  }

  renderTestimonial(0);

  // Auto loop every 6 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    renderTestimonial(currentIndex);
  }, 6000);
}

/* --- SMOOTH SCROLL FOR INTERNAL LINKS --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          targetElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* --- FORM SUBMISSION & TOAST NOTIFICATION --- */
function initFormToastHandlers() {
  const forms = document.querySelectorAll('form[data-toast]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = form.getAttribute('data-toast') || 'Request submitted successfully!';
      showToast(message);
      form.reset();
    });
  });
}

// Global Toast Display Helper
window.showToast = function(msg) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="lucide-check-circle" style="color:var(--accent-orange); font-size:1.2rem;"></i> ${msg}`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
};
