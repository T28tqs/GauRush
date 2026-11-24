'use strict';
(() => {
  const main = document.querySelector('#main');
  const header = document.querySelector('.site-header');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 760px)');
  const stages = [...main.querySelectorAll(':scope > section')].map((section, index, sections) => {
    const stage = document.createElement('div');
    const card = document.createElement('div');
    stage.className = 'journey-stage';
    card.className = 'journey-card';
    stage.style.setProperty('--journey-layer', sections.length - index);
    section.before(stage);
    stage.append(card);
    card.append(section);
    if (section.nextElementSibling?.matches('.kit-separator')) card.append(section.nextElementSibling);
    if (stage.nextElementSibling?.matches('.kit-separator')) card.append(stage.nextElementSibling);
    return { stage, card };
  });
  let frame = 0;
  let overlap = 0;

  const clamp = value => Math.min(1, Math.max(0, value));
  const ease = value => value * value * (3 - 2 * value);

  function draw() {
    frame = 0;
    const positions = stages.map(({ stage }) => stage.getBoundingClientRect().top);
    const introEnd = positions[1];
    const progress = Math.min(1, Math.max(0, 1 - introEnd / innerHeight));
    header.style.setProperty('--journey-header', Math.min(1, progress * 2));
    header.style.setProperty('--journey-header-events', progress > .25 ? 'auto' : 'none');
    const headerHeight = header.offsetHeight;
    stages.forEach(({ card }, index) => {
      const top = positions[index];
      const nextTop = positions[index + 1] ?? Infinity;
      const incoming = index > 0 && top > headerHeight && top <= headerHeight + overlap;
      const ratio = clamp(1 - (nextTop - headerHeight) / overlap);
      const tilt = ease(clamp(ratio / .68));
      const slide = ease(clamp((ratio - .25) / .75));
      const fade = ease(clamp((ratio - .68) / .32));

      // Align the incoming card to the viewport while it is still underneath.
      const inset = incoming ? headerHeight - top : 0;
      const lift = inset - (innerHeight + headerHeight) * slide;
      card.style.setProperty('--journey-lift', lift + 'px');
      card.style.setProperty('--journey-tilt', (compact.matches ? 12 : 23) * tilt + 'deg');
      card.style.setProperty('--journey-blur', (compact.matches ? 4 : 8) * tilt + 'px');
      card.style.setProperty('--journey-light', 1 - tilt * .52);
      card.style.setProperty('--journey-opacity', 1 - fade);
      card.style.setProperty('--journey-events', ratio > .42 ? 'none' : 'auto');
    });
  }

  function schedule() {
    if (!reduced.matches && !frame) frame = requestAnimationFrame(draw);
  }
  function layout() {
    document.body.classList.toggle('journey-active', !reduced.matches);
    if (reduced.matches) return;
    overlap = Math.round(innerHeight * (compact.matches ? .51 : .68));
    main.style.setProperty('--journey-overlap', overlap + 'px');
    const height = innerHeight;
    const sizes = stages.map(({ card }) => card.offsetHeight);
    stages.forEach(({ card }, index) => {
      card.style.setProperty('--journey-pin', Math.min(index === 0 ? 0 : header.offsetHeight, height - sizes[index]) + 'px');
    });
    schedule();
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', layout, { passive: true });
  reduced.addEventListener('change', layout);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(layout);
    stages.forEach(({ card }) => observer.observe(card));
  }
  layout();
  if (!reduced.matches) draw();
})();
