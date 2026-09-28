const internalLinks = document.querySelectorAll('a[href^="#"]');

internalLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

const animatedItems = document.querySelectorAll('.project-card, .skill-list > div, .education > div');

const observer = new IntersectionObserver((entries, currentObserver) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    currentObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

animatedItems.forEach((item) => observer.observe(item));
