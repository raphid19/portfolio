document.addEventListener('DOMContentLoaded', function () {

  // ============================
  // AOS (Animate on Scroll)
  // ============================
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic',
  });

  // ============================
  // Hero Particles
  // ============================
  (function createParticles() {
    var container = document.getElementById('particles');
    if (!container) return;
    for (var i = 0; i < 30; i++) {
      var particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particle.style.width = particle.style.height = (Math.random() * 4 + 2) + 'px';
      container.appendChild(particle);
    }
  })();

  // ============================
  // Typewriter Effect
  // ============================
  (function typewriter() {
    var el = document.getElementById('typewriter');
    if (!el) return;
    var phrases = [
      'Full Stack Developer',
      'Python & Django Enthusiast',
      'Open Source Contributor',
      'Problem Solver',
    ];
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var currentText = '';

    function type() {
      var fullText = phrases[phraseIndex];
      if (isDeleting) {
        currentText = fullText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        currentText = fullText.substring(0, charIndex + 1);
        charIndex++;
      }
      el.textContent = currentText;

      if (!isDeleting && charIndex === fullText.length) {
        isDeleting = true;
        setTimeout(type, 2000);
        return;
      }
      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 500);
        return;
      }
      setTimeout(type, isDeleting ? 50 : 100);
    }
    type();
  })();

  // ============================
  // Skill Bars Animation
  // ============================
  (function animateSkillBars() {
    var bars = document.querySelectorAll('.skill-bar');
    if (!bars.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          var width = bar.getAttribute('data-width');
          bar.style.setProperty('--target-width', width);
          bar.classList.add('animate');
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(function (bar) { observer.observe(bar); });
  })();

  // ============================
  // Navbar Scroll Effect
  // ============================
  (function navbarScroll() {
    var navbar = document.getElementById('navbar');
    var lastScroll = 0;

    window.addEventListener('scroll', function () {
      var currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        navbar.classList.add('bg-dark-900/95', 'shadow-lg', 'shadow-black/20');
      } else {
        navbar.classList.remove('bg-dark-900/95', 'shadow-lg', 'shadow-black/20');
      }
      lastScroll = currentScroll;
    });
  })();

  // ============================
  // Mobile Menu Toggle
  // ============================
  (function mobileMenu() {
    var btn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function () {
      menu.classList.toggle('hidden');
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.add('hidden');
      });
    });
  })();

  // ============================
  // Smooth Scroll for Nav Links
  // ============================
  (function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  })();

  // ============================
  // Contact Form - AJAX Submit
  // ============================
  (function contactForm() {
    var form = document.querySelector('#contact form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending...';
    });
  })();

});
