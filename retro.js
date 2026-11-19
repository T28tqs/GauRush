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

  const features = [
    { name:'VIEW & PLAY', label:'VIEWPORT / PLAYBACK', title:'Inspect <br>every frame.', description:'Scrub the timeline and inspect a capture from different angles. Open a single Gaussian file, a folder of frames, or add multiple captures to your scene.', details:['Orbit, pan, and zoom','Perspective & orthographic views','Sequence playback & frame scrubbing'], file:'view', aria:'GauRush sequence playback demo using a synthetic splat capture' },
    { name:'CROP VOLUMES', label:'CLEANUP / CROP VOLUMES', title:'Keep what <br>matters.', description:'Add a fixed crop box while the Gaussian sequence plays. Preview the result across frames, and keep your crop volumes organized in the layer system.', details:['Box, sphere, cylinder & cone shapes','Move, rotate & scale in the viewport','Toggle crop volumes in the layer system'], file:'crop', aria:'GauRush demo adding a fixed crop box to an animated splat sequence' },
    { name:'LASSO CLEANUP', label:'CLEANUP / LASSO SELECTION', title:'A cleaner <br>capture.', description:'Draw around unwanted splats directly in the viewport and delete the selection from the current frame. Refine the details a volume crop cannot reach.', details:['Freehand selection in the viewport','Delete unwanted splats','Refine individual frames'], file:'lasso', aria:'GauRush lasso cleanup demo showing selection and deletion of stray splats' },
    { name:'ANIMATE', label:'ANIMATION / KEYFRAME TIMELINE', title:'Follow <br>the action.', description:'Animate crop position, rotation, and scale. Adjust timing and interpolation directly in the timeline to keep the crop with your moving capture.', details:['Transform keyframes & Auto Key','Select and retime multiple keyframes','Adjust interpolation in the timeline'], file:'animate', aria:'GauRush crop animation and keyframe timeline demo' }
  ];
  const tabs = [...document.querySelectorAll('.media-strip [role="tab"]')];
  const panel = document.querySelector('#workspace-panel');
  const video = document.querySelector('#workspace-demo');
  const mediaStatus = document.querySelector('#media-status');
  const fallback = document.querySelector('.media-fallback');
  let videoVisible = false, currentFeature = 0;
  function tryPlay() {
    if (videoVisible && !reduced.matches && !document.hidden) video.play().catch(() => { mediaStatus.textContent = 'PRESS PLAY TO WATCH'; });
  }
  function selectFeature(index) {
    const f = features[index];
    currentFeature = index;
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    panel.setAttribute('aria-labelledby', tabs[index].id);
    panel.querySelector('.panel-label').textContent = f.label;
    panel.querySelector('h3').innerHTML = f.title;
    panel.querySelector('p').textContent = f.description;
    panel.querySelectorAll('.workflow-details li').forEach((li, i) => li.textContent = f.details[i]);
    document.querySelector('#video-counter').textContent = f.name;
    fallback.hidden = true;
    fallback.href = 'assets/' + f.file + '.webm';
    panel.classList.remove('changing');
    requestAnimationFrame(() => panel.classList.add('changing'));
    if (video.getAttribute('src') !== 'assets/' + f.file + '.webm') {
      video.pause();
      video.poster = 'assets/' + f.file + '.jpg';
      video.src = 'assets/' + f.file + '.webm';
      video.setAttribute('aria-label', f.aria);
      mediaStatus.textContent = 'LOADING VIDEO';
      video.load();
      tryPlay();
    }
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectFeature(i));
    tab.addEventListener('keydown', e => {
      const directions = { ArrowLeft:i-1, ArrowRight:i+1, ArrowUp:i-1, ArrowDown:i+1, Home:0, End:tabs.length-1 };
      if (!(e.key in directions)) return;
      e.preventDefault();
      const next = (directions[e.key] + tabs.length) % tabs.length;
      selectFeature(next); tabs[next].focus();
    });
  });
  video.addEventListener('playing', () => { mediaStatus.textContent = 'PLAYING / MUTED'; });
  video.addEventListener('pause', () => { mediaStatus.textContent = 'VIDEO PAUSED'; });
  video.addEventListener('loadeddata', () => { mediaStatus.textContent = 'VIDEO READY'; tryPlay(); });
  video.addEventListener('error', () => { mediaStatus.textContent = 'VIDEO UNAVAILABLE'; fallback.hidden = false; });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      videoVisible = entry.isIntersecting;
      if (videoVisible) tryPlay(); else video.pause();
    }, {threshold:.25}).observe(video);
  } else { videoVisible = true; tryPlay(); }
  reduced.addEventListener('change', () => { if (reduced.matches) video.pause(); else tryPlay(); });

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
  document.addEventListener('visibilitychange',()=>{if(document.hidden){video.pause();last=0;}else{schedule();tryPlay();}});
  if('IntersectionObserver' in window)new IntersectionObserver(([entry])=>{heroVisible=entry.isIntersecting;if(heroVisible)schedule();},{threshold:0}).observe(hero);
  if('ResizeObserver' in window)new ResizeObserver(resize).observe(hero);else addEventListener('resize',resize,{passive:true});
  resize();updateMotion();

  const revealNodes=[...document.querySelectorAll('.workspace-heading,.media-strip,.workbench,.system-title,.system-console,.download-heading,.download-content')];
  if('IntersectionObserver' in window&&!reduced.matches) {
    const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('waiting');reveal.unobserve(entry.target);}}),{threshold:.08});
    revealNodes.forEach(el=>{el.classList.add('reveal','waiting');reveal.observe(el);});
  }
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
