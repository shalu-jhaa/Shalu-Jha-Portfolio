/* ===================================================================
   SHALU JHAA — PORTFOLIO SCRIPT
   Handles: loader, cursor, particles, typing, reveals, nav, forms,
            tilt cards, modal, counters, back-to-top
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------
     1. LOADING SCREEN
  ----------------------------------------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 1300);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => loader.classList.add('hidden'), 2600);

  /* -----------------------------------------------------------
     2. CUSTOM CURSOR
  ----------------------------------------------------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const mouseLight = document.getElementById('mouseLight');
  let ringX = window.innerWidth / 2, ringY = window.innerHeight / 2;
  let mouseX = ringX, mouseY = ringY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    mouseLight.style.left = mouseX + 'px';
    mouseLight.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, input, textarea, .chip, .skill-category, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });

  /* -----------------------------------------------------------
     3. PARTICLE BACKGROUND (canvas)
  ----------------------------------------------------------- */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const colors = ['rgba(59,130,246,', 'rgba(34,211,238,', 'rgba(168,85,247,'];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  function initParticles() {
    const count = window.innerWidth < 768 ? 35 : 70;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.2
    }));
  }
  initParticles();

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  /* -----------------------------------------------------------
     4. TYPED TEXT ANIMATION (hero)
  ----------------------------------------------------------- */
  const typedEl = document.getElementById('typedText');
  const phrases = ['Software Engineer', 'AI Enthusiast', 'Problem Solver', 'C++ Developer'];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function typeLoop() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      charIdx++;
      typedEl.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      charIdx--;
      typedEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 65);
  }
  typeLoop();

  /* -----------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS
  ----------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-scale');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* -----------------------------------------------------------
     6. SKILL BAR FILL ANIMATION (on view)
  ----------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach(bar => skillObserver.observe(bar));

  /* -----------------------------------------------------------
     7. ANIMATED COUNTERS (hero stats)
  ----------------------------------------------------------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const isDecimal = el.dataset.decimal === 'true';
        let current = 0;
        const step = target / 40;
        const tick = () => {
          current += step;
          if (current >= target) {
            el.textContent = isDecimal ? (target / 10).toFixed(1) : target;
          } else {
            el.textContent = isDecimal ? (current / 10).toFixed(1) : Math.floor(current);
            requestAnimationFrame(tick);
          }
        };
        tick();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* -----------------------------------------------------------
     8. NAVBAR SCROLL STATE + ACTIVE LINK
  ----------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

  function onScroll() {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 40);
    backToTop.classList.toggle('show', scrollY > 600);

    // scroll progress
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollY / docHeight) * 100;
    scrollProgress.style.width = progress + '%';

    // active section detection
    let activeId = sections[0].id;
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.4) activeId = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === activeId);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* -----------------------------------------------------------
     9. MOBILE NAVIGATION
  ----------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });

  /* -----------------------------------------------------------
     10. TILT EFFECT ON PROJECT CARDS
  ----------------------------------------------------------- */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) * 6;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  /* -----------------------------------------------------------
     11. PROJECT PREVIEW MODAL
  ----------------------------------------------------------- */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');

  const projectData = {
    churn: {
      eyebrow: 'Machine Learning · Classification',
      title: 'Bank Customer Churn Prediction',
      desc: 'Analyzed over 10,000 customer records to uncover behavioral and demographic patterns linked to churn. Built and compared multiple classification models, tuning for both precision and recall to support proactive retention strategies.',
      stack: ['Python', 'NumPy', 'Pandas', 'Seaborn', 'Scikit-learn'],
      points: [
        'Cleaned and engineered features from raw transactional data',
        'Performed exploratory data analysis to surface churn drivers',
        'Trained Logistic Regression and Random Forest classifiers',
        'Achieved 89% prediction accuracy on the held-out test set'
      ]
    },
    door: {
      eyebrow: 'Computer Vision · IoT · Cloud',
      title: 'Smart Door Authentication System',
      desc: 'Designed an end-to-end contactless access system combining real-time face recognition with cloud-connected IoT hardware, giving administrators secure, remote control over entry logs and permissions.',
      stack: ['React.js', 'AWS Cloud', 'IoT', 'Python', 'TensorFlow', 'OpenCV'],
      points: [
        'Implemented real-time face recognition with OpenCV & TensorFlow',
        'Connected door hardware to the cloud via IoT protocols',
        'Built a React.js dashboard for access monitoring',
        'Reached 91% recognition accuracy in varied lighting conditions'
      ]
    }
  };

  function openModal(key) {
    const data = projectData[key];
    if (!data) return;
    modalContent.innerHTML = `
      <span class="modal-content-eyebrow">${data.eyebrow}</span>
      <h3>${data.title}</h3>
      <p>${data.desc}</p>
      <div class="project-stack">
        ${data.stack.map(s => `<span class="stack-chip">${s}</span>`).join('')}
      </div>
      <ul>${data.points.map(p => `<li>${p}</li>`).join('')}</ul>
    `;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-preview-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.project));
  });
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* -----------------------------------------------------------
     12. CONTACT FORM VALIDATION + SUCCESS ANIMATION
  ----------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function setError(input, hasError) {
    const group = input.closest('.form-group');
    group.classList.toggle('error', hasError);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#fname');
    const email = form.querySelector('#femail');
    const subject = form.querySelector('#fsubject');
    const message = form.querySelector('#fmessage');

    let valid = true;

    if (!name.value.trim()) { setError(name, true); valid = false; } else setError(name, false);
    if (!email.value.trim() || !isValidEmail(email.value.trim())) { setError(email, true); valid = false; } else setError(email, false);
    if (!subject.value.trim()) { setError(subject, true); valid = false; } else setError(subject, false);
    if (!message.value.trim()) { setError(message, true); valid = false; } else setError(message, false);

    if (!valid) return;

    // Simulate sending (no backend wired up — replace with real endpoint as needed)
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitText = document.getElementById('submitText');
    submitText.textContent = 'Sending...';
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      formSuccess.classList.add('show');
      form.reset();
      submitText.textContent = 'Send Message';
      submitBtn.style.opacity = '1';
      setTimeout(() => formSuccess.classList.remove('show'), 4000);
    }, 900);
  });

  /* -----------------------------------------------------------
     13. RESUME DOWNLOAD BUTTON (graceful placeholder)
  ----------------------------------------------------------- */
  const resumeBtn = document.getElementById('resumeBtn');
  resumeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resumeBtn.querySelector('span').textContent = 'Resume coming soon';
    setTimeout(() => { resumeBtn.querySelector('span').textContent = 'Resume'; }, 2200);
  });

});
