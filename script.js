/* =========================================
   TAVARES ARQ — JS
   ========================================= */

// ---- NAV scroll state ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ---- Mobile burger ----
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
  // Animate burger
  const spans = burger.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.cssText = 'transform: rotate(45deg) translate(5px,5px)';
    spans[1].style.cssText = 'opacity:0; transform: scaleX(0)';
    spans[2].style.cssText = 'transform: rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => s.style.cssText = '');
  }
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    burger.querySelectorAll('span').forEach(s => s.style.cssText = '');
  });
});

// ---- Intersection Observer: reveal animations ----
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ---- Counter animation ----
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const startTime = performance.now();

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease out expo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterEls = document.querySelectorAll('.metric__number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counterEls.forEach(el => counterObserver.observe(el));

// ---- Smooth active nav links ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--clr-text)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ---- Form submission ----
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  // Simple validation
  const nome = form.querySelector('#nome').value.trim();
  const email = form.querySelector('#email').value.trim();
  const mensagem = form.querySelector('#mensagem').value.trim();

  if (!nome || !email || !mensagem) {
    shakeForm(form);
    return;
  }

  // Simulate send
  btn.textContent = 'Enviando...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.textContent = '✓ Mensagem enviada!';
    btn.style.background = '#2d6a4f';
    btn.style.opacity = '1';
    form.reset();
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 3500);
  }, 1200);
});

function shakeForm(el) {
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
}

// Inject shake keyframe
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);

// ---- Subtle parallax on hero shapes ----
const shapes = document.querySelectorAll('.shape');
window.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (clientX - cx) / cx;
  const dy = (clientY - cy) / cy;

  shapes.forEach((shape, i) => {
    const depth = (i + 1) * 6;
    shape.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
  });
}, { passive: true });

// ---- Step timeline line height fix ----
// Ensure lines connect dots properly
function alignStepLines() {
  const steps = document.querySelectorAll('.step');
  steps.forEach((step, i) => {
    const line = step.querySelector('.step__line');
    const content = step.querySelector('.step__content');
    if (line && content) {
      const contentHeight = content.offsetHeight;
      line.style.height = contentHeight + 26 + 'px';
    }
  });
}
window.addEventListener('load', alignStepLines);
window.addEventListener('resize', alignStepLines);
