/* GauRush — native, dependency-free interaction and motion. */
'use strict';
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.hero');
  const menu = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('#mobile-navigation');
  function closeMenu(returnFocus = false) {
    mobileNav.hidden = true;
    menu.setAttribute('aria-expanded', 'false');
    if (returnFocus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    mobileNav.hidden = !open;
    menu.setAttribute('aria-expanded', String(open));
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mobileNav.hidden) closeMenu(true); });
  matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

  const strip = document.querySelector('#feature-strip');
  const originals = [...strip.children];
  const controls = document.querySelector('.feature-scroll-controls');
  function copySlides() {
    return originals.map(slide => {
      const copy = slide.cloneNode(true);
      const video = copy.querySelector('video');
      video.removeAttribute('src');
      video.controls = false;
      copy.inert = true;
      copy.setAttribute('aria-hidden', 'true');
      return copy;
    });
  }
  strip.prepend(...copySlides());
  strip.append(...copySlides());
  const cards = [...strip.children];
  const featureCount = originals.length;
  const videos = originals.map(slide => slide.querySelector('video'));
  const visibleVideos = new Set();
  const autoplayButton = document.querySelector('#feature-autoplay');
  let currentFeature = 0;
  let autoAdvance = !reduced.matches;
  let carouselVisible = !('IntersectionObserver' in window);
  let interacting = false;
  let glideFrame = 0;
  let glidePosition = 0;
  let previousTime = 0;
  let resumeTimer;

  function stopGlide() {
    cancelAnimationFrame(glideFrame);
    glideFrame = 0;
  }
  function glide(time) {
    if (previousTime) {
      const speed = Math.max(24, Math.min(64, strip.clientWidth / 18));
      glidePosition += speed * Math.min(time - previousTime, 40) / 1000;
      glidePosition = wrapPosition(glidePosition);
      strip.scrollLeft = glidePosition;
      updateCurrentSlide();
    }
    previousTime = time;
    glideFrame = requestAnimationFrame(glide);
  }
  function startGlide() {
    if (glideFrame || !autoAdvance || !carouselVisible || interacting || resumeTimer || document.hidden) return;
    glidePosition = strip.scrollLeft;
    previousTime = 0;
    glideFrame = requestAnimationFrame(glide);
  }
  function setAutoAdvance(enabled) {
    autoAdvance = enabled;
    autoplayButton.textContent = enabled ? 'Pause' : 'Play';
    autoplayButton.setAttribute('aria-label', enabled ? 'Pause automatic scrolling' : 'Start automatic scrolling');
    if (enabled) startGlide();
    else stopGlide();
  }
  controls.hidden = false;

  function updatePlayback() {
    videos.forEach((video, index) => {
      if (index === currentFeature && visibleVideos.has(video) && !reduced.matches && !document.hidden) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }
  function cardPosition(card) {
    return card.offsetLeft + (card.offsetWidth - strip.clientWidth) / 2;
  }
  function wrapPosition(position) {
    const start = cardPosition(cards[featureCount]);
    const end = cardPosition(cards[2 * featureCount]);
    const distance = end - start;
    if (distance <= 0 || (position >= start && position < end)) return position;
    return start + ((position - start) % distance + distance) % distance;
  }
  function updateCurrentSlide() {
    const first = cardPosition(cards[0]);
    const spacing = cardPosition(cards[1]) - first;
    if (spacing <= 0) return;
    const index = Math.round((strip.scrollLeft - first) / spacing);
    const feature = index % featureCount;
    if (feature === currentFeature) return;
    currentFeature = feature;
    updatePlayback();
  }
  function scrollToCard(index, behavior = 'instant') {
    strip.scrollTo({ left: cardPosition(cards[index]), behavior });
  }
  function resumeAfterScroll() {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      resumeTimer = 0;
      if (interacting) return;
      strip.scrollLeft = wrapPosition(strip.scrollLeft);
      updateCurrentSlide();
      startGlide();
    }, 700);
  }
  function interruptGlide() {
    stopGlide();
    resumeAfterScroll();
  }
  function stepFeature(step) {
    interruptGlide();
    strip.scrollLeft = wrapPosition(strip.scrollLeft);
    updateCurrentSlide();
    scrollToCard(featureCount + currentFeature + step, reduced.matches ? 'instant' : 'smooth');
  }
  strip.addEventListener('scroll', () => {
    if (glideFrame) return;
    updateCurrentSlide();
    resumeAfterScroll();
  }, { passive: true });
  strip.addEventListener('wheel', event => {
    if (event.deltaX || event.shiftKey) interruptGlide();
  }, { passive: true });
  strip.addEventListener('keydown', event => {
    if (event.target !== strip) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    stepFeature(event.key === 'ArrowLeft' ? -1 : 1);
  });
  controls.querySelectorAll('[data-feature-step]').forEach(button => {
    button.addEventListener('click', () => stepFeature(Number(button.dataset.featureStep)));
  });
  autoplayButton.addEventListener('click', () => setAutoAdvance(!autoAdvance));
  strip.addEventListener('focusin', event => {
    if (event.target !== strip) setAutoAdvance(false);
  });
  strip.addEventListener('pointerdown', () => {
    interacting = true;
    interruptGlide();
  });
  function endInteraction() {
    if (!interacting) return;
    interacting = false;
    resumeAfterScroll();
  }
  window.addEventListener('pointerup', endInteraction);
  window.addEventListener('pointercancel', endInteraction);
  scrollToCard(featureCount);
  setAutoAdvance(autoAdvance);
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => {
      scrollToCard(featureCount + currentFeature);
      glidePosition = strip.scrollLeft;
    }).observe(strip);
  }
  videos.forEach((video, index) => {
    const status = originals[index].querySelector('.media-status');
    video.addEventListener('playing', () => { status.textContent = 'PLAYING / MUTED'; });
    video.addEventListener('pause', () => { status.textContent = 'VIDEO PAUSED'; });
    video.addEventListener('error', () => {
      status.textContent = 'VIDEO UNAVAILABLE';
      originals[index].querySelector('.media-fallback').hidden = false;
    });
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      carouselVisible = entry.isIntersecting;
      if (carouselVisible) startGlide();
      else stopGlide();
    }).observe(strip);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({ target, intersectionRatio }) => {
        if (intersectionRatio >= .25) visibleVideos.add(target);
        else visibleVideos.delete(target);
      });
      updatePlayback();
    }, { threshold: .25 });
    videos.forEach(video => observer.observe(video));
  } else {
    videos.forEach(video => visibleVideos.add(video));
    updatePlayback();
  }
  reduced.addEventListener('change', () => {
    if (reduced.matches) setAutoAdvance(false);
    updatePlayback();
  });
  document.addEventListener('visibilitychange', () => {
    updatePlayback();
    if (document.hidden) stopGlide();
    else startGlide();
  });

  // One animation loop serves the illustrative point field, radial graph, and 3D study.
  const field = document.querySelector('#particle-field');
  const study = document.querySelector('#splat-study');
  const graph = document.querySelector('#signal-graph');
  const fieldCtx = field.getContext('2d'), studyCtx = study.getContext('2d'), graphCtx = graph.getContext('2d');
  const motionButton = document.querySelector('#motion-toggle');
  let running = !reduced.matches, heroVisible = true, frame = 0, last = 0, elapsed = 0;
  let yaw = .35, pitch = -.35, drag = null, fieldWidth = 1, fieldHeight = 1;
  const pointer = {x:-9999,y:-9999};
  const points = Array.from({length:1200}, (_, i) => {
    const u = (i % 60) / 60 * Math.PI * 2, v = Math.floor(i / 60) / 20 * Math.PI * 2;
    return {x:(1 + .32 * Math.cos(v))*Math.cos(u),y:.32*Math.sin(v),z:(1+.32*Math.cos(v))*Math.sin(u),warm:i%11===0};
  });
  let seed = 7421;
  function random(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  const dust = Array.from({length:180}, () => ({u:.18 + random()*.82,v:random(),x:0,y:0,vx:0,vy:0,size:.45+random()*1.05,warm:random()>.82,phase:random()*Math.PI*2}));
  document.querySelector('#study-points').textContent = points.length.toLocaleString('en-US') + ' POINTS';
  function fit(canvas, context) {
    if (!context) return;
    const rect = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(rect.width*dpr); canvas.height = Math.round(rect.height*dpr);
    context.setTransform(dpr,0,0,dpr,0,0);
    return {width:rect.width,height:rect.height};
  }
  let studySize = {width:245,height:122}, graphSize = {width:260,height:98};
  function resize() {
    const size = fit(field,fieldCtx);
    if (size) { fieldWidth=size.width; fieldHeight=size.height; }
    studySize = fit(study,studyCtx) || studySize; graphSize = fit(graph,graphCtx) || graphSize;
    draw(0);
  }
  function draw(delta) {
    const angle = yaw + elapsed*.075, tilt = pitch, ca=Math.cos(angle),sa=Math.sin(angle),ct=Math.cos(tilt),st=Math.sin(tilt);
    if(studyCtx) {
      const {width:w,height:h}=studySize;
      studyCtx.clearRect(0,0,w,h);
      studyCtx.strokeStyle='#29434b'; studyCtx.lineWidth=.6;
      studyCtx.beginPath(); studyCtx.ellipse(w/2,h/2,w*.36,h*.4,0,0,Math.PI*2); studyCtx.stroke();
      const projected = points.map(p => {const x=p.x*ca-p.z*sa,z=p.x*sa+p.z*ca,y=p.y*ct-z*st,zz=p.y*st+z*ct; const s=3.6/(3.6+zz);return {x:w/2+x*s*w*.25,y:h/2+y*s*h*.55,z:zz,s,warm:p.warm};}).sort((a,b)=>b.z-a.z);
      for(const p of projected) {studyCtx.globalAlpha=Math.min(.95,.35+(1.6-p.z)*.19);studyCtx.fillStyle=p.warm?'#f4b879':'#93dfdf';studyCtx.fillRect(p.x,p.y,Math.max(.55,p.s*.85),Math.max(.55,p.s*.85));}
      studyCtx.globalAlpha=1;
    }
    if(graphCtx) {
      const {width:w,height:h}=graphSize;
      graphCtx.clearRect(0,0,w,h); graphCtx.lineWidth=.5;graphCtx.strokeStyle='#23404d';
      for(let i=1;i<5;i++){graphCtx.beginPath();graphCtx.moveTo(10,h*i/5);graphCtx.lineTo(w-10,h*i/5);graphCtx.stroke();}
      for(let i=0;i<9;i++){graphCtx.beginPath();graphCtx.moveTo(10+(w-20)*i/8,8);graphCtx.lineTo(10+(w-20)*i/8,h-5);graphCtx.stroke();}
      graphCtx.beginPath();
      for(let i=0;i<=120;i++){const t=i/120*Math.PI*2,y=h*.55-(.26*Math.cos(t*3+angle)+.12*Math.sin(t*7-angle))*h;const x=10+(w-20)*i/120;if(i===0)graphCtx.moveTo(x,y);else graphCtx.lineTo(x,y);}
      graphCtx.strokeStyle='#f4b879';graphCtx.lineWidth=1;graphCtx.stroke();graphCtx.lineTo(w-10,h-5);graphCtx.lineTo(10,h-5);graphCtx.closePath();graphCtx.fillStyle='#f4b87914';graphCtx.fill();
    }
    if(fieldCtx) {
      fieldCtx.clearRect(0,0,fieldWidth,fieldHeight);
      const step=Math.min(delta*60,2);
      for(const p of dust) {
        const bx=p.u*fieldWidth+Math.sin(elapsed*.13+p.phase)*10,by=p.v*fieldHeight+Math.cos(elapsed*.1+p.phase)*9;
        const dx=bx+p.x-pointer.x,dy=by+p.y-pointer.y,d=Math.sqrt(dx*dx+dy*dy);
        if(running&&d<110&&d>1){const force=(1-d/110)*.75*step;p.vx+=dx/d*force;p.vy+=dy/d*force;}
        p.vx+=(0-p.x)*.012*step;p.vy+=(0-p.y)*.012*step;
        p.vx*=Math.pow(.89,step);p.vy*=Math.pow(.89,step);p.x+=p.vx*step;p.y+=p.vy*step;
        fieldCtx.globalAlpha=.28+.28*Math.sin(p.phase+elapsed*.2)**2;fieldCtx.fillStyle=p.warm?'#f4b879':'#a5e8e1';
        fieldCtx.fillRect(bx+p.x,by+p.y,p.size,p.size);
      }
      fieldCtx.globalAlpha=1;
    }
  }
  function tick(time) {
    frame=0;
    if (!running || !heroVisible || document.hidden) {last=0;return;}
    const delta=last?Math.min((time-last)/1000,.05):0;
    last=time;elapsed+=delta;draw(delta);frame=requestAnimationFrame(tick);
  }
  function schedule() { if (running&&heroVisible&&!document.hidden&&!frame) frame=requestAnimationFrame(tick); }
  function updateMotion() {
    motionButton.setAttribute('aria-pressed',String(running));
    motionButton.textContent=running?'Pause motion':'Play motion';
    motionButton.setAttribute('aria-label',running?'Pause ambient animation':'Play ambient animation');
    if(!running){cancelAnimationFrame(frame);frame=0;last=0;draw(0);}else schedule();
  }
  motionButton.addEventListener('click',()=>{running=!running;updateMotion();});
  document.querySelector('#scene-reset').addEventListener('click',()=>{yaw=.35;pitch=-.35;elapsed=0;dust.forEach(p=>{p.x=p.y=p.vx=p.vy=0});draw(0);});
  hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=hero.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;},{passive:true});
  hero.addEventListener('pointerleave',()=>{pointer.x=pointer.y=-9999;});
  study.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,yaw,pitch};study.setPointerCapture(e.pointerId);});
  study.addEventListener('pointermove',e=>{if(!drag)return;yaw=drag.yaw+(e.clientX-drag.x)*.012;pitch=Math.max(-1.5,Math.min(1.5,drag.pitch+(e.clientY-drag.y)*.012));if(!running)draw(0);});
  study.addEventListener('pointerup',()=>{drag=null;});
  study.addEventListener('pointercancel',()=>{drag=null;});
  study.addEventListener('lostpointercapture',()=>{drag=null;});
  reduced.addEventListener('change',()=>{running=!reduced.matches;updateMotion();scrollMotion();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){last=0;}else{schedule();}});
  if('IntersectionObserver' in window)new IntersectionObserver(([entry])=>{heroVisible=entry.isIntersecting;if(heroVisible)schedule();},{threshold:0}).observe(hero);
  if('ResizeObserver' in window)new ResizeObserver(resize).observe(hero);else addEventListener('resize',resize,{passive:true});
  resize();updateMotion();

  const progress=document.querySelector('.scroll-progress');
  let scrollFrame=0;
  function scrollMotion() {
    scrollFrame=0;
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform='scaleX('+(max>0?scrollY/max:0)+')';
    const r=hero.getBoundingClientRect();
    if(r.bottom>0)hero.style.setProperty('--scene-y',reduced.matches?'0px':Math.min(45,Math.max(0,-r.top*.065)).toFixed(1)+'px');
  }
  addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(scrollMotion);},{passive:true});
  scrollMotion();
  const navLinks=[...document.querySelectorAll('.site-header nav a')];
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}});},{rootMargin:'-20% 0px -50% 0px',threshold:0}).observe(hero);
  ['workspace','features'].forEach(id=>{
    if(!('IntersectionObserver' in window))return;
    new IntersectionObserver(([entry])=>{if(entry.isIntersecting)navLinks.forEach(link=>{if(link.hash==='#'+id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});},{rootMargin:'-20% 0px -50% 0px',threshold:0}).observe(document.getElementById(id));
  });
})();
