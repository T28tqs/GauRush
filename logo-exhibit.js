
const section = document.querySelector('.logo-exhibit');
const viewport = section.querySelector('.logo-viewport');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let startPromise;
let active = false;

async function initialize() {
  const [THREE, { GLTFLoader }, { MeshSurfaceSampler }] = await Promise.all([
    import('three'), import('three/addons/loaders/GLTFLoader.js'),
    import('three/addons/math/MeshSurfaceSampler.js')
  ]);
  const model = (await new GLTFLoader().loadAsync(new URL('./assets/gaurush.glb', import.meta.url).href)).scene;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 30);
  const group = new THREE.Group();
  scene.add(group, new THREE.HemisphereLight(0xe8fff4, 0x365247, 2.5));
  const light = new THREE.DirectionalLight(0xc6ffda, 3.5);
  light.position.set(3, 4, 5);
  const rim = new THREE.DirectionalLight(0x57ffa1, 3);
  rim.position.set(-3, 1, -4);
  scene.add(light, rim);

  model.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(model);
  const center = bounds.getCenter(new THREE.Vector3());
  const dimensions = bounds.getSize(new THREE.Vector3());
  const diameter = Math.max(dimensions.x, dimensions.y, dimensions.z);
  if (!Number.isFinite(diameter) || diameter <= 0) throw new Error('Invalid GauRush logo bounds');
  const scale = 2.5 / diameter;
  const positions = [];
  const dispersion = [];
  const sample = new THREE.Vector3();
  const materials = new Set();
  model.traverse(mesh => {
    if (!mesh.isMesh || !mesh.geometry.attributes.position?.count) return;
    const sampler = new MeshSurfaceSampler(mesh).build();
    for (let index = 0; index < 2200; index++) {
      sampler.sample(sample);
      sample.applyMatrix4(mesh.matrixWorld).sub(center).multiplyScalar(scale);
      positions.push(sample.x, sample.y, sample.z);
      dispersion.push(
        sample.x * .65 + (Math.random() - .5) * 1.7,
        sample.y * .65 + (Math.random() - .5) * 1.7,
        sample.z * .65 + (Math.random() - .5) * 1.7
      );
    }
    (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(material => materials.add(material));
  });
  model.position.sub(center);
  const normalized = new THREE.Group();
  normalized.scale.setScalar(scale);
  normalized.add(model);
  group.add(normalized);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('dispersion', new THREE.Float32BufferAttribute(dispersion, 3));
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: { spread: { value: 1 }, opacity: { value: 0 }, density: { value: renderer.getPixelRatio() } },
    vertexShader: 'attribute vec3 dispersion; uniform float spread, density; void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position + dispersion * spread, 1.0); gl_PointSize = 2.3 * density; }',
    fragmentShader: 'uniform float opacity; void main(){ float glow = 1.0 - smoothstep(0.08, 0.5, distance(gl_PointCoord, vec2(0.5))); gl_FragColor = vec4(0.42, 1.0, 0.72, glow * opacity); }',
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const particles = new THREE.Points(geometry, particleMaterial);
  particles.frustumCulled = false;
  group.add(particles);
  for (const material of materials) { material.transparent = true; material.depthWrite = false; }
  renderer.domElement.setAttribute('aria-hidden', 'true');
  viewport.append(renderer.domElement);

  let frame = 0;
  let last = 0;
  let amount = 0;
  let angle = .24;
  let pointerX = 0;
  let pointerY = 0;
  function render() {
    const solid = THREE.MathUtils.smoothstep(amount, .48, .92);
    normalized.visible = solid > 0;
    for (const material of materials) material.opacity = solid;
    particles.visible = amount > 0 && amount < 1;
    particleMaterial.uniforms.spread.value = (1 - amount) ** 1.4;
    particleMaterial.uniforms.opacity.value = Math.sin(Math.PI * amount) * .82;
    renderer.render(scene, camera);
  }
  function schedule() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function tick(time) {
    frame = 0;
    const dt = last ? Math.min((time - last) / 1000, .05) : 1 / 60;
    last = time;
    const target = active ? 1 : 0;
    amount = reduced.matches ? target : THREE.MathUtils.lerp(amount, target, 1 - Math.exp(-5 * dt));
    if (Math.abs(target - amount) < .005) amount = target;
    if (active && !reduced.matches) angle += .26 * dt;
    group.rotation.y = reduced.matches ? .24 : THREE.MathUtils.lerp(group.rotation.y, angle + pointerX * .48, 1 - Math.exp(-5 * dt));
    group.rotation.x = reduced.matches ? 0 : THREE.MathUtils.lerp(group.rotation.x, pointerY * .3, 1 - Math.exp(-5 * dt));
    render();
    if (!reduced.matches && (active || amount > 0)) schedule();
    else last = 0;
  }
  function resize() {
    const width = viewport.clientWidth;
    const height = viewport.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.position.z = 6.8 / Math.min(1, camera.aspect);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    schedule();
  }
  viewport.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || reduced.matches) return;
    const rect = viewport.getBoundingClientRect();
    pointerX = 2 * (event.clientX - rect.left) / rect.width - 1;
    pointerY = 2 * (event.clientY - rect.top) / rect.height - 1;
  });
  viewport.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
  renderer.domElement.addEventListener('webglcontextlost', () => viewport.classList.remove('logo-ready'));
  renderer.domElement.addEventListener('webglcontextrestored', () => { viewport.classList.add('logo-ready'); schedule(); });
  document.addEventListener('visibilitychange', () => { if (active) schedule(); });
  reduced.addEventListener('change', schedule);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(viewport);
  else window.addEventListener('resize', resize);
  resize();
  viewport.classList.add('logo-ready');
  return schedule;
}
function setActive(value) {
  active = value;
  if (!startPromise && value) startPromise = initialize().catch(() => null);
  startPromise?.then(update => update?.());
}
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: .08 })
    .observe(viewport);
} else setActive(true);
