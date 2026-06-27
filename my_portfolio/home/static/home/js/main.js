document.addEventListener('DOMContentLoaded', function () {

  // ============================
  // Scroll Reveal Animations
  // ============================
  (function scrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    function checkReveals() {
      var windowHeight = window.innerHeight;
      var revealPoint = 100;

      reveals.forEach(function (el) {
        var top = el.getBoundingClientRect().top;
        if (top < windowHeight - revealPoint) {
          el.classList.add('reveal--visible');
        }
      });
    }

    checkReveals();
    window.addEventListener('scroll', checkReveals);
  })();

  // ============================
  // Navbar Scroll Effect
  // ============================
  (function navbarScroll() {
    var navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 50) {
        navbar.style.borderBottomColor = 'rgba(0, 255, 65, 0.15)';
      } else {
        navbar.style.borderBottomColor = 'var(--border-color)';
      }
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
      menu.classList.toggle('navbar__mobile-menu--open');
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('navbar__mobile-menu--open');
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
  // Skills Universe - Draggable Planets
  // ============================
  (function skillsUniverse() {
    var canvas = document.getElementById('skills-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var wrapper = document.getElementById('skills-wrapper');
    var dragArea = document.getElementById('skills-drag-area');
    var dataScript = document.getElementById('skills-data');

    // Read skills from Django JSON
    var rawSkills = [];
    try {
      rawSkills = JSON.parse(dataScript.textContent);
    } catch(e) { return; }
    if (!rawSkills.length) return;

    // Devicon class → unicode character mapping
    var deviconMap = {
      'devicon-python-plain': '\ue706',
      'devicon-django-plain': '\ue707',
      'devicon-javascript-plain': '\ue781',
      'devicon-react-original': '\ue788',
      'devicon-html5-plain': '\ue749',
      'devicon-css3-plain': '\ue74a',
      'devicon-java-plain': '\ue704',
      'devicon-cplusplus-plain': '\ue708',
      'devicon-nodejs-plain': '\ue718',
      'devicon-postgresql-plain': '\ue724',
      'devicon-git-plain': '\ue702',
      'devicon-docker-plain': '\uf21f',
      'devicon-amazonwebservices-original': '\uf0e4',
      'devicon-linux-plain': '\uf17c',
      'devicon-tailwindcss-plain': '\ue6b0',
      'devicon-typescript-plain': '\ue783',
      'devicon-mongodb-plain': '\ue734',
      'devicon-redis-plain': '\ue73d',
      'devicon-nginx-original': '\ue776',
      'devicon-flask-original': '\ue731',
      'devicon-fastapi-plain': '\ue734',
      'devicon-vuejs-plain': '\ue781',
      'devicon-angularjs-plain': '\ue753',
      'devicon-nextjs-original': '\ue789',
      'devicon-graphql-plain': '\ue789',
      'devicon-heroku-original': '\ue77b',
      'devicon-ubuntu-plain': '\ue77c',
      'devicon-bash-plain': '\ue77d',
      'devicon-kubernetes-plain': '\ue77e',
    };

    var skills = rawSkills.map(function(s) {
      return {
        name: s.name,
        category: s.category,
        icon: deviconMap[s.icon] || '\u25c7',
      };
    });

    var categoryColors = {
      frontend: { main: '#00d4ff', glow: 'rgba(0,212,255,0.25)', ring: 'rgba(0,212,255,0.15)', text: '#00d4ff' },
      backend:  { main: '#00ff41', glow: 'rgba(0,255,65,0.25)',  ring: 'rgba(0,255,65,0.15)',  text: '#00ff41' },
      tools:    { main: '#ffb000', glow: 'rgba(255,176,0,0.25)', ring: 'rgba(255,176,0,0.15)', text: '#ffb000' },
    };

    var planetRadius = 46;
    var stars = [];
    var nebulaClouds = [];
    var mouseX = 0, mouseY = 0;
    var grabbed = null;
    var hovered = null;
    var grabOffsetX, grabOffsetY;
    var animFrame;
    var dpr = window.devicePixelRatio || 1;

    function resize() {
      var rect = wrapper.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      canvas._w = rect.width;
      canvas._h = rect.height;
      if (stars.length === 0) initStars();
      if (nebulaClouds.length === 0) initNebula();
      layoutPlanets();
    }

    function initStars() {
      stars = [];
      for (var i = 0; i < 120; i++) {
        stars.push({
          x: Math.random() * (canvas._w || 800),
          y: Math.random() * (canvas._h || 600),
          r: Math.random() * 2 + 0.3,
          speed: Math.random() * 0.4 + 0.05,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function initNebula() {
      var w = canvas._w || 800, h = canvas._h || 600;
      nebulaClouds = [];
      var colors = ['rgba(0,212,255,0.03)', 'rgba(0,255,65,0.02)', 'rgba(255,176,0,0.02)', 'rgba(255,51,85,0.015)'];
      for (var i = 0; i < 3; i++) {
        nebulaClouds.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * w * 0.3 + w * 0.1,
          color: colors[i % colors.length],
          speed: Math.random() * 0.02 + 0.005,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function layoutPlanets() {
      var w = canvas._w || 800, h = canvas._h || 600;
      var cols = Math.min(4, skills.length);
      var rows = Math.ceil(skills.length / cols);
      var cellW = w / (cols + 1);
      var cellH = h / (rows + 1);
      var startX = cellW;
      var startY = cellH;

      skills.forEach(function(s, i) {
        if (s._initialized) return;
        var col = i % cols;
        var row = Math.floor(i / cols);
        s.x = startX + col * cellW + (Math.random() - 0.5) * cellW * 0.3;
        s.y = startY + row * cellH + (Math.random() - 0.5) * cellH * 0.3;
        s.vx = 0;
        s.vy = 0;
        s.floatPhase = Math.random() * Math.PI * 2;
        s.floatSpeed = 0.6 + Math.random() * 0.6;
        s.floatAmpX = 2 + Math.random() * 3;
        s.floatAmpY = 2 + Math.random() * 3;
        s.ringAngle = Math.random() * Math.PI;
        s.moonAngle = Math.random() * Math.PI * 2;
        s._initialized = true;
      });
    }

    // ─── Drawing ──────────────────────────────────────────

    function drawStars(time) {
      stars.forEach(function(s) {
        var twinkle = Math.sin(time * s.speed + s.phase) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + (0.25 * twinkle) + ')';
        ctx.fill();
      });
    }

    function drawNebula(time) {
      nebulaClouds.forEach(function(n) {
        var driftX = Math.sin(time * n.speed + n.phase) * 20;
        var driftY = Math.cos(time * n.speed * 0.7 + n.phase) * 15;
        var grad = ctx.createRadialGradient(n.x + driftX, n.y + driftY, 0, n.x + driftX, n.y + driftY, n.r);
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(n.x + driftX - n.r, n.y + driftY - n.r, n.r * 2, n.r * 2);
      });
    }

    function drawPlanet(s, time) {
      var col = categoryColors[s.category];

      // Floating offset
      var fx = 0, fy = 0;
      if (s !== grabbed) {
        fx = Math.sin(time * s.floatSpeed + s.floatPhase) * s.floatAmpX;
        fy = Math.cos(time * s.floatSpeed * 0.8 + s.floatPhase * 1.3) * s.floatAmpY;
      }
      var px = s.x + fx;
      var py = s.y + fy;

      // Orbital ring
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(s.ringAngle + time * 0.1);
      ctx.beginPath();
      ctx.ellipse(0, 0, planetRadius + 10, planetRadius * 0.35, 0, 0, Math.PI * 2);
      ctx.strokeStyle = col.ring;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Planet glow
      ctx.save();
      ctx.shadowColor = col.glow;
      ctx.shadowBlur = s === hovered ? 40 : 25;
      ctx.beginPath();
      ctx.arc(px, py, planetRadius, 0, Math.PI * 2);

      // Planet surface gradient
      var grad = ctx.createRadialGradient(px - planetRadius * 0.3, py - planetRadius * 0.3, 0, px, py, planetRadius);
      grad.addColorStop(0, '#ffffff');
      var c = col.main;
      grad.addColorStop(0.3, c);
      grad.addColorStop(0.7, c);
      grad.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Border
      ctx.strokeStyle = col.main;
      ctx.lineWidth = s === hovered ? 2 : 1;
      ctx.stroke();
      ctx.restore();

      // Inner highlight arc (top-left shine)
      ctx.save();
      ctx.beginPath();
      ctx.arc(px - planetRadius * 0.2, py - planetRadius * 0.2, planetRadius * 0.5, -Math.PI * 0.8, -Math.PI * 0.1);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Icon
      ctx.save();
      ctx.font = '24px "devicon", "JetBrains Mono", sans-serif';
      ctx.fillStyle = col.text;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.icon, px, py - 4);
      ctx.restore();

      // Name
      ctx.save();
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillStyle = s === hovered ? col.text : '#e0e0e0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(s.name, px, py + planetRadius + 8);
      ctx.restore();

      // Small orbiting moon
      var moonR = 3;
      var moonDist = planetRadius + 16;
      var moonAngle = s.moonAngle + time * 1.2;
      var mx = px + Math.cos(moonAngle) * moonDist;
      var my = py + Math.sin(moonAngle) * moonDist;
      ctx.beginPath();
      ctx.arc(mx, my, moonR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fill();
    }

    function draw() {
      var w = canvas._w || canvas.width;
      var h = canvas._h || canvas.height;
      var time = Date.now() * 0.001;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Background
      var bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
      bgGrad.addColorStop(0, 'rgba(0,255,65,0.015)');
      bgGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      drawNebula(time);
      drawStars(time);

      // Draw planets
      skills.forEach(function(s) { drawPlanet(s, time); });

      ctx.restore();
    }

    function loop() {
      // Apply inertia deceleration on released planets
      skills.forEach(function(s) {
        if (s !== grabbed) {
          s.vx *= 0.95;
          s.vy *= 0.95;
          s.x += s.vx;
          s.y += s.vy;
        }
      });
      draw();
      animFrame = requestAnimationFrame(loop);
    }

    // ─── Interaction ──────────────────────────────────────

    function getPos(e) {
      var rect = wrapper.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function findNearestPlanet(x, y) {
      var best = null;
      var bestDist = planetRadius + 15;
      for (var i = skills.length - 1; i >= 0; i--) {
        var s = skills[i];
        var dx = x - s.x;
        var dy = y - s.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < bestDist) {
          bestDist = dist;
          best = s;
        }
      }
      return best;
    }

    dragArea.addEventListener('mousedown', function (e) {
      var pos = getPos(e);
      var planet = findNearestPlanet(pos.x, pos.y);
      if (planet) {
        grabbed = planet;
        grabOffsetX = pos.x - planet.x;
        grabOffsetY = pos.y - planet.y;
        planet.vx = 0;
        planet.vy = 0;
        planet._prevX = pos.x;
        planet._prevY = pos.y;
        dragArea.style.cursor = 'grabbing';
      }
    });

    document.addEventListener('mousemove', function (e) {
      var pos = getPos(e);
      mouseX = pos.x;
      mouseY = pos.y;

      if (grabbed) {
        var newX = pos.x - grabOffsetX;
        var newY = pos.y - grabOffsetY;
        grabbed.vx = (newX - grabbed.x) * 0.6;
        grabbed.vy = (newY - grabbed.y) * 0.6;
        grabbed.x = newX;
        grabbed.y = newY;
      }

      // Hover detection
      var hPlanet = findNearestPlanet(pos.x, pos.y);
      hovered = hPlanet;
      if (!grabbed) {
        dragArea.style.cursor = hovered ? 'grab' : 'default';
      }
    });

    document.addEventListener('mouseup', function () {
      if (grabbed) {
        grabbed = null;
      }
      dragArea.style.cursor = hovered ? 'grab' : 'default';
    });

    // Touch support
    var touchId = null;
    dragArea.addEventListener('touchstart', function (e) {
      var touch = e.touches[0];
      if (!touch) return;
      touchId = touch.identifier;
      var rect = wrapper.getBoundingClientRect();
      var tx = touch.clientX - rect.left;
      var ty = touch.clientY - rect.top;
      var planet = findNearestPlanet(tx, ty);
      if (planet) {
        grabbed = planet;
        grabOffsetX = tx - planet.x;
        grabOffsetY = ty - planet.y;
        planet.vx = 0;
        planet.vy = 0;
        planet._prevX = tx;
        planet._prevY = ty;
      }
    }, { passive: true });

    dragArea.addEventListener('touchmove', function (e) {
      var touch = findTouch(e);
      if (!touch) return;
      e.preventDefault();
      var rect = wrapper.getBoundingClientRect();
      var tx = touch.clientX - rect.left;
      var ty = touch.clientY - rect.top;
      if (grabbed) {
        var newX = tx - grabOffsetX;
        var newY = ty - grabOffsetY;
        grabbed.vx = (newX - grabbed.x) * 0.6;
        grabbed.vy = (newY - grabbed.y) * 0.6;
        grabbed.x = newX;
        grabbed.y = newY;
      }
    }, { passive: false });

    function findTouch(e) {
      for (var i = 0; i < e.touches.length; i++) {
        if (e.touches[i].identifier === touchId) return e.touches[i];
      }
      return e.touches[0];
    }

    dragArea.addEventListener('touchend', function () {
      if (grabbed) {
        grabbed = null;
      }
      touchId = null;
    }, { passive: true });

    window.addEventListener('resize', function () {
      resize();
    });

    resize();
    loop();
  })();

  // ============================
  // Contact Form - Submit
  // ============================
  (function contactForm() {
    var form = document.querySelector('#contact form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = '$ sending_message...';
    });
  })();

});
