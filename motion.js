/* Visibility-aware video and one coherent instrument motion layer. */
'use strict';
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const master = document.querySelector('#motion-toggle');
  const footerControl = document.querySelector('#footer-motion-toggle');
  const videos = [...document.querySelectorAll('.scene-video')];
  const visible = new Map();
  const source = window.GAURUSH_BACKGROUND_MEDIA;
  if (source?.poster) document.documentElement.style.setProperty('--scene-image', 'url("' + source.poster + '")');
  const motionOn = () => master?.getAttribute('aria-pressed') === 'true';
  function sync() {
    const on = motionOn() && !document.hidden;
    document.body.classList.toggle('ambient-paused', !on);
    if (footerControl) {
      footerControl.setAttribute('aria-pressed',String(motionOn()));
      footerControl.textContent = motionOn() ? 'Pause background motion' : 'Play background motion';
    }
    videos.forEach(video => {
      if (on && visible.get(video) && source?.video) {
        if (!video.hasAttribute('src')) { video.src = source.video; video.load(); }
        video.play().catch(() => {
          const retry = video.parentElement.querySelector('.video-retry');
          if (retry && !video.error) retry.hidden = false;
        });
      } else video.pause();
    });
  }
  videos.forEach(video => {
    video.muted = true; video.defaultMuted = true; video.loop = true; video.playsInline = true;
    if (source?.poster) video.poster = source.poster;
    video.addEventListener('loadeddata', () => { video.parentElement.classList.add('video-ready'); });
    video.addEventListener('playing', () => {
      const retry = video.parentElement.querySelector('.video-retry');
      if (retry) retry.hidden = true;
    });
    video.addEventListener('error', () => {
      video.parentElement.classList.remove('video-ready');
      video.pause();
      const retry = video.parentElement.querySelector('.video-retry');
      if (retry) retry.hidden = true;
    });
    const section = video.parentElement;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {visible.set(video,entry.isIntersecting);sync();},{threshold:0}).observe(section);
    } else visible.set(video,true);
    section.querySelector('.video-retry')?.addEventListener('click',() => {
      if (!motionOn()) master?.click();
      if (!video.hasAttribute('src') && source?.video) video.src = source.video;
      video.play().catch(()=>{});
    });
  });
  footerControl?.addEventListener('click',()=>master?.click());
  if (master) new MutationObserver(sync).observe(master,{attributes:true,attributeFilter:['aria-pressed']});
  document.addEventListener('visibilitychange',sync);
  reduce.addEventListener('change',sync);
  sync();

  const ambient = [...document.querySelectorAll('.kit-separator,.kit-orbit,.timeline-art')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('motion-live',entry.isIntersecting)),{threshold:.05});
    ambient.forEach(el=>observer.observe(el));
  } else ambient.forEach(el=>el.classList.add('motion-live'));
  const timeline = document.querySelector('.timeline-art');
  if (timeline) {
    const fit = () => timeline.style.setProperty('--timeline-travel', Math.min(115,timeline.clientWidth*.16)+'px');
    fit(); if ('ResizeObserver' in window) new ResizeObserver(fit).observe(timeline);
  }

  // A bounded startup sequence assembles the instrument panels around the capture.
  const entrances = [
    [document.querySelector('.hero .signal-panel'),-18,0,0],
    [document.querySelector('.hero .study-panel'),18,0,110],
    [document.querySelector('.hero .kit-wordmark'),0,-10,190],
    [document.querySelector('.hero h1'),0,9,260],
    [document.querySelector('.hero-copy p'),0,7,330]
  ];
  let startup = [];
  if (!reduce.matches && motionOn()) entrances.forEach(([el,x,y,delay]) => {
    if (!el?.animate || getComputedStyle(el).display==='none') return;
    startup.push(el.animate([
      {opacity:.2,transform:'translate('+x+'px,'+y+'px)',filter:'blur(2px)'},
      {opacity:1,transform:'translate(0,0)',filter:'blur(0)'}
    ],{duration:700,delay,easing:'cubic-bezier(.16,1,.3,1)'}));
  });

  const scenes = [
    ['.hero', '.scene-image,.scene-video,.hero-upper,.hero-copy,.hero-bottom,#particle-field,.scene-corners'],
    ['.showcase', 'iframe'],
    ['.kit-separator', '.kit-ribbon,.kit-star'],
    ['.workspace', '.workspace-heading,.feature-scroll-controls,.feature-slides'],
    ['.system', '.system-title,.workflow-map,.map-note'],
    ['.compatibility', 'h2,.compatibility-grid'],
    ['.download', '.download-art,.scene-video,.download-heading,.download-content,.first-run'],
    ['.site-footer', '.brand,span,.text-link']
  ].map(([selector, parts]) => {
    const scene = document.querySelector(selector);
    scene.querySelectorAll(':scope > :is(' + parts + ')').forEach((part, index) => {
      part.classList.add('scroll-motion-part');
      part.style.setProperty('--scroll-motion-offset', String(Math.min(index, 3) * 5));
    });
    return scene;
  });

  const smooth = value => {
    const clamped = Math.min(1, Math.max(0, value));
    return clamped * clamped * (3 - 2 * clamped);
  };
  let scrollFrame = 0;
  function updateScenes() {
    scrollFrame = 0;
    const enabled = !reduce.matches;
    document.body.classList.toggle('scroll-motion-on', enabled);
    if (!enabled) return;

    const height = window.innerHeight;
    const positions = scenes.map(scene => scene.getBoundingClientRect());
    scenes.forEach((scene, index) => {
      const { top, bottom } = positions[index];
      const entering = smooth((top - height * .72) / (height * .28));
      const leaving = 1 - smooth(bottom / (height * .28));
      const amount = Math.max(entering, leaving);
      scene.style.setProperty('--scroll-motion-amount', amount.toFixed(4));
      scene.style.setProperty('--scroll-motion-travel', (entering - leaving).toFixed(4));
    });
  }
  function scheduleScenes() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScenes);
  }
  window.addEventListener('scroll', scheduleScenes, { passive: true });
  window.addEventListener('resize', scheduleScenes, { passive: true });
  window.addEventListener('pageshow', scheduleScenes);
  reduce.addEventListener('change', updateScenes);
  if ('ResizeObserver' in window) {
    const resizeScenes = new ResizeObserver(scheduleScenes);
    scenes.forEach(scene => resizeScenes.observe(scene));
  }
  updateScenes();

  reduce.addEventListener('change', () => {
    if (reduce.matches) startup.forEach(animation => animation.finish());
  });
  if (master) new MutationObserver(() => {
    if (!motionOn()) startup.forEach(animation => animation.finish());
  }).observe(master, { attributes: true, attributeFilter: ['aria-pressed'] });
})();
