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

  function draw() {
    frame = 0;
    const positions = stages.map(({ stage }) => stage.getBoundingClientRect().top);
    const introEnd = positions[1];
    const progress = Math.min(1, Math.max(0, 1 - introEnd / innerHeight));
    header.style.setProperty('--journey-header', Math.min(1, progress * 2));
    header.style.setProperty('--journey-header-events', progress > .25 ? 'auto' : 'none');
    stages.forEach(({ card }, index) => {
      if (index === stages.length - 1) return;
      const nextTop = positions[index + 1];
      const ratio = Math.min(1, Math.max(0, 1 - nextTop / overlap));
      const ease = ratio * ratio * (3 - 2 * ratio);
      card.style.setProperty('--journey-lift', -overlap * .52 * ease + 'px');
      card.style.setProperty('--journey-tilt', (compact.matches ? 4 : 11) * ease + 'deg');
      card.style.setProperty('--journey-blur', (compact.matches ? 3 : 7) * ease + 'px');
      card.style.setProperty('--journey-light', 1 - ease * .48);
      card.style.setProperty('--journey-opacity', 1 - ease);
      card.style.setProperty('--journey-events', ratio > .72 ? 'none' : 'auto');
    });
  }
  function schedule() {
    if (!reduced.matches && !frame) frame = requestAnimationFrame(draw);
  }
  function layout() {
    document.body.classList.toggle('journey-active', !reduced.matches);
    if (reduced.matches) return;
    overlap = Math.round(innerHeight * (compact.matches ? .31 : .46));
    main.style.setProperty('--journey-overlap', overlap + 'px');
    const height = innerHeight;
    const sizes = stages.map(({ card }) => card.offsetHeight);
    stages.forEach(({ card }, index) => {
      card.style.setProperty('--journey-pin', Math.min(0, height - sizes[index]) + 'px');
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
