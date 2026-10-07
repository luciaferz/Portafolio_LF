const internalLinks = document.querySelectorAll('a[href^="#"]');

internalLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

const animatedItems = document.querySelectorAll(
  '.hero .eyebrow, .hero h1, .hero .hero-bottom, .hero .hero-line, ' +
  '.section-heading, .project-card, .about-copy, .skill-list > div, ' +
  '.education > div, .contact h2, .contact-note, .contact-row'
);

animatedItems.forEach((item, index) => {
  item.classList.add('cascade-item');
  item.style.setProperty('--cascade-delay', `${(index % 5) * 45}ms`);
});

const revealItems = (items) => {
  items.forEach((item) => item.classList.add('is-visible'));
};

if (!('IntersectionObserver' in window)) {
  revealItems(animatedItems);
} else {
  const observer = new IntersectionObserver((entries, currentObserver) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    currentObserver.unobserve(entry.target);
  });
  }, { threshold: 0.12 });

  animatedItems.forEach((item) => observer.observe(item));
}

// El primer bloque entra también al abrir la página desde un enlace o desde la caché.
const revealHero = () => {
  window.setTimeout(() => {
    revealItems(document.querySelectorAll('.hero .cascade-item'));
  }, 80);
};

revealHero();
window.addEventListener('pageshow', revealHero);
