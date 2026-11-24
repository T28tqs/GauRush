'use strict';
(() => {
  const map = document.querySelector('.workflow-map');
  const sphere = map.querySelector('.map-core-graphic');
  const list = map.querySelector('.map-nodes');
  const nodes = [...list.children];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const particles = document.createElement('div');
  particles.className = 'map-particles';
  particles.setAttribute('aria-hidden', 'true');
  for (let index = 0; index < 110; index++) {
    const particle = document.createElement('i');
    const duration = 6 + Math.random() * 12;
    particle.style.setProperty('--x', Math.random() * 100 + '%');
    particle.style.setProperty('--y', Math.random() * 100 + '%');
    particle.style.setProperty('--size', 1 + Math.random() * 2 + 'px');
    particle.style.setProperty('--delay', -Math.random() * duration * 2 + 's');
    particle.style.setProperty('--duration', duration + 's');
    particle.style.setProperty('--drift-x', (Math.random() - .5) * 95 + 'px');
    particles.append(particle);
  }
  map.prepend(particles);

  function measureOrigins() {
    const bounds = sphere.getBoundingClientRect();
    const listBounds = list.getBoundingClientRect();
    const scale = listBounds.width / list.offsetWidth;
    if (!scale) return;
    const x = (bounds.left + bounds.width / 2 - listBounds.left) / scale;
    const y = (bounds.top + bounds.height / 2 - listBounds.top) / scale;
    nodes.forEach(node => {
      node.style.setProperty('--origin-x', x - node.offsetLeft - node.offsetWidth / 2 + 'px');
      node.style.setProperty('--origin-y', y - node.offsetTop - node.offsetHeight / 2 + 'px');
    });
  }
  function setExpanded(expanded) {
    if (map.classList.contains('map-expanded') === expanded) return;
    measureOrigins();
    map.classList.toggle('map-expanded', expanded);
    if (!reduced.matches) {
      sphere.animate([
        { scale: 1 }, { scale: expanded ? 1.13 : .92 }, { scale: 1 }
      ], { duration: 720, easing: 'ease-in-out' });
    }
  }
  if ('IntersectionObserver' in window) {
    measureOrigins();
    map.classList.add('map-animated');
    new IntersectionObserver(([entry]) => {
      setExpanded(entry.isIntersecting);
    }, { rootMargin: '-70px 0px -12% 0px' }).observe(map);
  }
  if ('ResizeObserver' in window) new ResizeObserver(measureOrigins).observe(map);

  function resetCursor() {
    nodes.forEach(node => {
      node.style.removeProperty('--cursor-x');
      node.style.removeProperty('--cursor-y');
      node.style.removeProperty('--cursor-glow');
    });
  }
  map.addEventListener('pointerleave', resetCursor);
  map.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || reduced.matches || !map.classList.contains('map-expanded')) return;
    const positions = nodes.map(node => node.getBoundingClientRect());
    positions.forEach((bounds, index) => {
      const dx = event.clientX - bounds.left - bounds.width / 2;
      const dy = event.clientY - bounds.top - bounds.height / 2;
      const strength = Math.max(0, 1 - Math.hypot(
        Math.max(0, Math.abs(dx) - bounds.width / 2),
        Math.max(0, Math.abs(dy) - bounds.height / 2)
      ) / 140);
      nodes[index].style.setProperty('--cursor-x', Math.max(-14, Math.min(14, dx * .10)) * strength + 'px');
      nodes[index].style.setProperty('--cursor-y', Math.max(-12, Math.min(12, dy * .10)) * strength + 'px');
      nodes[index].style.setProperty('--cursor-glow', strength * .45);
    });
  }, { passive: true });
})();
