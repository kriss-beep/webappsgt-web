/* =========================================================
   WebAppsGT — interacciones
   ========================================================= */
const CONFIG = {
  whatsapp: "50239953189",
  whatsappMsg: "Hola WebAppsGT, quiero cotizar un proyecto.",
  cal: "https://cal.com/info-info-bj9rxs/30min",
  email: "info@webappscorp.com",
  socials: {
    instagram: "https://www.instagram.com/webapps_corp/",
    facebook: "https://www.facebook.com/profile.php?id=100075669811616",
    linkedin: "https://www.linkedin.com/company/webapps-corporation/home/"
  }
};
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover:hover) and (pointer:fine)').matches;
const HAS_GSAP = !!(window.gsap && window.ScrollTrigger);
if (HAS_GSAP) gsap.registerPlugin(ScrollTrigger);

/* ---------- links ---------- */
document.querySelectorAll('.cal').forEach(a => { a.href = CONFIG.cal; a.target = "_blank"; a.rel = "noopener"; });
const waUrl = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(CONFIG.whatsappMsg);
document.querySelectorAll('.wa-link').forEach(a => a.href = waUrl);
const ICONS = {
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.2 21 14.4V21h-4v-5.8c0-1.4 0-3.2-1.95-3.2S12.8 13.5 12.8 15.1V21H9z"/></svg>'
};
const LABELS = { instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn" };
['socials1', 'socials2'].forEach(id => {
  const el = document.getElementById(id); if (!el) return;
  el.innerHTML = Object.entries(CONFIG.socials).map(([k, u]) => `<a class="icon-btn" href="${u}" target="_blank" rel="noopener" aria-label="${LABELS[k]} de WebAppsGT">${ICONS[k]}</a>`).join('');
});

/* ---------- split text ---------- */
function splitWords(el) {
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const w = document.createElement('span'); w.className = 'w';
          const i = document.createElement('span'); i.textContent = part; w.appendChild(i); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
  };
  walk(el);
  return el.querySelectorAll('.w>span');
}
document.querySelectorAll('.split').forEach(splitWords);

/* ---------- scramble ---------- */
const GLYPHS = '!<>-_\\/[]{}—=+*^?#01';
function scramble(el) {
  const final = el.dataset.txt || (el.dataset.txt = el.textContent);
  let f = 0; const total = 22;
  const tick = () => {
    el.textContent = final.split('').map((c, i) => {
      if (c === ' ') return ' ';
      return i < (f / total) * final.length ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }).join('');
    if (++f <= total) requestAnimationFrame(tick); else el.textContent = final;
  };
  tick();
}

/* ---------- typed ---------- */
(function () {
  const el = document.getElementById('typed'); if (!el) return;
  const words = ['landing pages', 'apps móviles', 'software a la medida', 'soluciones SaaS', 'tiendas que venden'];
  let w = 0, c = words[0].length, del = true;
  setInterval(() => {
    const word = words[w];
    if (del) { c--; if (c <= 0) { del = false; w = (w + 1) % words.length; } }
    else { c++; if (c >= words[w].length) { del = true; c = words[w].length + 8; } }
    el.textContent = words[w].slice(0, Math.max(0, Math.min(c, words[w].length))) || ' ';
  }, 80);
})();

/* ---------- nav / progress ---------- */
const nav = document.getElementById('nav'), pr = document.getElementById('progress');
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY;
  nav.classList.toggle('scrolled', y > 30);
  nav.classList.toggle('hide', y > lastY && y > 600 && !document.getElementById('mmenu').classList.contains('open'));
  lastY = y;
  pr.style.width = (y / (document.documentElement.scrollHeight - innerHeight) * 100) + '%';
}, { passive: true });
const mm = document.getElementById('mmenu');
document.getElementById('burger').onclick = () => mm.classList.toggle('open');
mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mm.classList.remove('open')));
// active link
const navLinks = [...document.querySelectorAll('.nav-links a')];
const secIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
['proceso', 'proyectos', 'servicios', 'nosotros', 'faq'].forEach(id => { const s = document.getElementById(id); if (s) secIO.observe(s); });

/* ---------- cursor ---------- */
if (FINE) {
  const cur = document.getElementById('cursor'), dot = document.getElementById('cursorDot'), txt = document.getElementById('cursorTxt');
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; });
  (function loop() { cx += (mx - cx) * .18; cy += (my - cy) * .18; cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
  document.addEventListener('mouseover', e => {
    const lab = e.target.closest('[data-cursor]');
    const link = e.target.closest('a,button,summary,input,textarea,select');
    cur.classList.toggle('label', !!lab && !link);
    cur.classList.toggle('hover', !!link);
    txt.textContent = lab && !link ? lab.dataset.cursor : '';
  });
  // magnetic
  document.querySelectorAll('.btn,.icon-btn').forEach(b => {
    b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
    b.addEventListener('mouseleave', () => b.style.transform = '');
  });
}
// spotlight vars
document.addEventListener('pointermove', e => {
  const c = e.target.closest && e.target.closest('.why,.svc'); if (!c) return;
  const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
});

/* ---------- shared geo ---------- */
const LW = 240, LH = 120;
const _bin = atob(window.LAND || ''), BITS = new Uint8Array(_bin.length);
for (let i = 0; i < _bin.length; i++) BITS[i] = _bin.charCodeAt(i);
function isLand(lat, lon) { let x = Math.floor((lon + 180) / 360 * LW), y = Math.floor((90 - lat) / 180 * LH); x = (x % LW + LW) % LW; y = Math.min(LH - 1, Math.max(0, y)); const i = y * LW + x; return (BITS[i >> 3] >> (7 - (i & 7))) & 1; }
function ll(lat, lon, r) { const ph = (90 - lat) * Math.PI / 180, th = (lon + 180) * Math.PI / 180; return [-r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)]; }

/* =========================================================
   HERO GLOBE
   ========================================================= */
(function () {
  const wrap = document.getElementById('globeWrap'), canvas = document.getElementById('globe');
  if (!window.THREE || !wrap) return;
  const R = 1, v3 = (lat, lon, r = R) => new THREE.Vector3(...ll(lat, lon, r));
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(35, 1, .1, 100); camera.position.set(0, 0, 4.9);
  const globe = new THREE.Group(); scene.add(globe); globe.rotation.x = .32;
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(R * .985, 64, 64), new THREE.MeshBasicMaterial({ color: 0x06070a })));
  const N = 26000, pos = [], col = [], sz = [], orange = new THREE.Color(0xfb5a00), white = new THREE.Color(0xdfe3ec), blue = new THREE.Color(0x3b6fd1);
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, lat = Math.asin(y) * 180 / Math.PI, lon = ((i * 137.50776) % 360) - 180;
    if (!isLand(lat, lon)) continue; const p = ll(lat, lon, R * 1.002); pos.push(...p);
    const r = Math.random(); const c = r < .07 ? orange : (r < .12 ? blue : white); col.push(c.r, c.g, c.b); sz.push(r < .07 ? 1.5 : 1);
  }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); dg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); dg.setAttribute('size', new THREE.Float32BufferAttribute(sz, 1));
  const dotMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, uniforms: { uPx: { value: 1 }, uT: { value: 0 } },
    vertexShader: `attribute float size;attribute vec3 color;varying vec3 vC;varying float vF;uniform float uPx;uniform float uT;
      void main(){vC=color;vec4 mv=modelViewMatrix*vec4(position,1.);vec3 n=normalize(normalMatrix*position);vF=smoothstep(-.05,.5,n.z);
      float tw=.8+.2*sin(uT*2.+position.x*30.+position.y*20.);gl_PointSize=size*uPx*2.2*tw*(4.4/-mv.z);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `varying vec3 vC;varying float vF;void main(){vec2 c=gl_PointCoord-.5;float d=length(c);if(d>.5)discard;gl_FragColor=vec4(vC,(1.-smoothstep(.25,.5,d))*vF);}`
  });
  globe.add(new THREE.Points(dg, dotMat));
  const gridMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .05 });
  for (let lat = -60; lat <= 60; lat += 30) { const pts = []; for (let lon = -180; lon <= 180; lon += 4) pts.push(v3(lat, lon, R * 1.003)); globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat)); }
  for (let lon = -180; lon < 180; lon += 30) { const pts = []; for (let lat = -90; lat <= 90; lat += 4) pts.push(v3(lat, lon, R * 1.003)); globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat)); }
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.12, 64, 64), new THREE.ShaderMaterial({
    transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec3 vN;void main(){float i=pow(max(0.,.62-dot(vN,vec3(0,0,1.))),2.6);vec3 c=mix(vec3(.98,.35,0.),vec3(.25,.4,.95),clamp(vN.y*.6+.5,0.,1.));gl_FragColor=vec4(c*i*.9,i*.9);}`
  })));
  const GT = [14.63, -90.51];
  const dest = [[25.76, -80.19], [40.71, -74.0], [34.05, -118.24], [19.43, -99.13], [4.71, -74.07], [-23.55, -46.63], [40.42, -3.70], [51.51, -0.13], [43.65, -79.38], [9.93, -84.08], [-34.6, -58.38], [18.47, -69.9]];
  const arcs = [];
  dest.forEach((d, i) => {
    const a = v3(GT[0], GT[1]), b = v3(d[0], d[1]), dist = a.distanceTo(b);
    const mid = a.clone().add(b).multiplyScalar(.5).normalize().multiplyScalar(R + dist * .32);
    const pts = new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(80);
    const g = new THREE.BufferGeometry().setFromPoints(pts); g.setAttribute('t', new THREE.Float32BufferAttribute(pts.map((_, k) => k / 80), 1));
    const m = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uP: { value: 0 }, uC: { value: new THREE.Color(0xfb5a00) } },
      vertexShader: `attribute float t;varying float vT;void main(){vT=t;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `uniform float uP;uniform vec3 uC;varying float vT;void main(){float a=smoothstep(uP-.35,uP,vT)*step(vT,uP);gl_FragColor=vec4(mix(uC,vec3(1.),a*.4),max(a,.22*step(vT,min(uP,1.))));}`
    });
    globe.add(new THREE.Line(g, m));
    const dot = new THREE.Mesh(new THREE.SphereGeometry(.012, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff })); dot.position.copy(b.clone().multiplyScalar(1.004)); globe.add(dot);
    arcs.push({ m, off: i * .55, dur: 3.2 + Math.random() * 1.2 });
  });
  const home = v3(GT[0], GT[1], R * 1.005);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(.022, 16, 16), new THREE.MeshBasicMaterial({ color: 0xfb5a00 })); beacon.position.copy(home); globe.add(beacon);
  const pulses = [0, 1, 2].map(i => { const r = new THREE.Mesh(new THREE.RingGeometry(.03, .036, 48), new THREE.MeshBasicMaterial({ color: 0xfb5a00, transparent: true, side: THREE.DoubleSide, depthWrite: false })); r.position.copy(home); r.lookAt(home.clone().multiplyScalar(2)); globe.add(r); return { r, o: i / 3 }; });
  globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([home, home.clone().multiplyScalar(1.18)]), new THREE.LineBasicMaterial({ color: 0xfb5a00, transparent: true, opacity: .8 })));
  const orbit = new THREE.Group(); scene.add(orbit);
  const mkOrbit = (rad, tilt, rotY, op) => {
    const g = new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(0, 0, rad, rad).getPoints(200).map(p => new THREE.Vector3(p.x, 0, p.y)));
    const l = new THREE.LineLoop(g, new THREE.LineDashedMaterial({ color: 0xffffff, transparent: true, opacity: op, dashSize: .03, gapSize: .03 })); l.computeLineDistances();
    const grp = new THREE.Group(); grp.rotation.set(tilt, rotY, 0); grp.add(l);
    const sat = new THREE.Mesh(new THREE.SphereGeometry(.018, 12, 12), new THREE.MeshBasicMaterial({ color: 0xfb5a00 })); grp.add(sat); orbit.add(grp);
    return { sat, rad, sp: .25 + Math.random() * .2, ph: Math.random() * 6 };
  };
  const orbs = [mkOrbit(1.42, 1.15, .4, .14), mkOrbit(1.62, -.9, -.6, .08)];
  const sp = []; for (let i = 0; i < 500; i++) { const v = new THREE.Vector3(Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize().multiplyScalar(3 + Math.random() * 4); sp.push(v.x, v.y, v.z); }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0x9aa0ad, size: .012, transparent: true, opacity: .5 })));
  globe.rotation.y = -1.05;
  let drag = false, lx = 0, ly = 0, vx = 0, vy = 0, tx = globe.rotation.x;
  wrap.addEventListener('pointerdown', e => { drag = true; wrap.classList.add('drag', 'used'); lx = e.clientX; ly = e.clientY; vx = vy = 0; });
  addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY; vx = dx * .005; vy = dy * .005; globe.rotation.y += vx; tx = Math.max(-1.1, Math.min(1.1, tx + vy)); });
  const up = () => { drag = false; wrap.classList.remove('drag'); }; addEventListener('pointerup', up); addEventListener('pointercancel', up);
  let px = 0, py = 0; addEventListener('mousemove', e => { px = (e.clientX / innerWidth - .5); py = (e.clientY / innerHeight - .5); });
  function size() { const s = Math.max(10, wrap.getBoundingClientRect().width); renderer.setSize(s, s, false); dotMat.uniforms.uPx.value = renderer.getPixelRatio() * (s / 700); }
  size(); addEventListener('resize', size);
  let visible = true; new IntersectionObserver(e => visible = e[0].isIntersecting).observe(wrap);
  const clock = new THREE.Clock(); let first = true, boost = 0;
  window.__globeBoost = () => { boost = .09; };
  (function loop() {
    requestAnimationFrame(loop); if (!visible) return; const t = clock.getElapsedTime();
    if (!drag) { globe.rotation.y += (REDUCE ? 0 : .0016) + vx + boost; vx *= .95; boost *= .96; }
    globe.rotation.x += (tx - globe.rotation.x) * .08; if (!drag) tx += (.32 - tx) * .004;
    scene.rotation.y += ((px * .25) - scene.rotation.y) * .03; scene.rotation.x += ((py * .15) - scene.rotation.x) * .03;
    dotMat.uniforms.uT.value = t;
    arcs.forEach(a => a.m.uniforms.uP.value = (((t + a.off) % a.dur) / a.dur) * 1.5);
    pulses.forEach(p => { const k = (t * .6 + p.o) % 1; p.r.scale.setScalar(1 + k * 5); p.r.material.opacity = (1 - k) * .8; });
    orbs.forEach(o => { const a = t * o.sp + o.ph; o.sat.position.set(Math.cos(a) * o.rad, 0, Math.sin(a) * o.rad); });
    orbit.rotation.y = t * .03;
    renderer.render(scene, camera);
    if (first) { canvas.classList.add('ready'); first = false; }
  })();
})();

/* =========================================================
   MORPH — scroll-driven particle assembly
   chaos → liquid blob → logo → laptop → globe
   ========================================================= */
const Morph = (function () {
  const canvas = document.getElementById('morph'), sec = document.getElementById('proceso');
  if (!window.THREE || !canvas) return null;
  const mobile = innerWidth < 820;
  const N = mobile ? 7000 : 12000;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(40, 1, .1, 100);
  camera.position.set(0, 0, 6.2);
  const group = new THREE.Group(); scene.add(group);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const S = [], C = []; // shapes positions & colors
  const W = [1, 1, 1], O = [0.984, 0.353, 0], B = [0.23, 0.44, 0.82], G = [0.55, 0.58, 0.64];
  const pick = (po, pb) => { const r = Math.random(); return r < po ? O : (r < po + pb ? B : W); };

  // 0 chaos
  { const p = new Float32Array(N * 3), c = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { const r = Math.cbrt(Math.random()) * 4.2, th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1);
      p.set([r * Math.sin(ph) * Math.cos(th) * 1.6, r * Math.sin(ph) * Math.sin(th) * .9, r * Math.cos(ph) - .5], i * 3);
      c.set(Math.random() < .5 ? G : pick(.12, .1), i * 3); }
    S.push(p); C.push(c); }
  // 1 liquid blob (base dirs; animated each frame)
  const blobDir = new Float32Array(N * 3);
  { const p = new Float32Array(N * 3), c = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996; blobDir.set([Math.cos(th) * r, y, Math.sin(th) * r], i * 3);
      const sh = .55 + Math.pow(1 - Math.abs(y), .5) * .05; const v = .7 + Math.random() * .3; c.set(Math.random() < .06 ? O : [v, v, v * 1.03], i * 3); }
    S.push(p); C.push(c); }
  // 2 logo (sampled from icon.png) — filled async
  const logoP = new Float32Array(N * 3), logoC = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { logoP.set([rnd(-2, 2), rnd(-.6, .6), rnd(-.1, .1)], i * 3); logoC.set(O, i * 3); }
  S.push(logoP); C.push(logoC);
  const img = new Image(); img.src = 'assets/icon.png';
  img.onload = () => {
    const cw = img.naturalWidth, ch = img.naturalHeight, cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
    const ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0); let d;
    try { d = ctx.getImageData(0, 0, cw, ch).data; } catch (e) { return; }
    const pts = []; for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) { const k = (y * cw + x) * 4; if (d[k + 3] > 120) pts.push([x, y, d[k] > 200 && d[k + 2] < 100]); }
    if (!pts.length) return;
    const sc = (mobile ? 3.0 : 4.4) / cw;
    for (let i = 0; i < N; i++) { const q = pts[Math.floor(Math.random() * pts.length)];
      logoP.set([(q[0] + Math.random() - cw / 2) * sc, -(q[1] + Math.random() - ch / 2) * sc + .15, rnd(-.12, .12)], i * 3);
      logoC.set(q[2] ? O : W, i * 3); }
  };
  // 3 laptop with UI
  { const p = new Float32Array(N * 3), c = new Float32Array(N * 3);
    const sw = mobile ? 2.4 : 3.2, sh = sw * .62, tilt = -.22, bd = sw * .62;
    const ui = (u, v) => { // u,v in 0..1 on screen; return color or null
      if (u < .02 || u > .98 || v < .03 || v > .97) return W;               // bezel frame
      if (v > .88 && v < .93) return u < .2 ? O : (u > .78 && u < .92 ? O : (u > .4 && u < .65 && Math.random() < .5 ? G : null)); // nav
      if (v > .58 && v < .76 && u > .08 && u < .55) return Math.random() < .55 ? W : null;   // headline
      if (v > .48 && v < .54 && u > .08 && u < .3) return O;                                // cta
      if (v > .44 && v < .82 && u > .6 && u < .92) return Math.random() < .35 ? B : null;    // hero image
      if (v > .1 && v < .36) { const col = Math.floor((u - .08) / .29); const lu = (u - .08) - col * .29; if (u > .08 && u < .95 && lu < .25) return Math.random() < (v > .3 ? .8 : .22) ? (v > .3 ? W : G) : null; }
      return null;
    };
    let i = 0, guard = 0;
    const nScreen = Math.floor(N * .62);
    while (i < nScreen && guard++ < N * 60) { const u = Math.random(), v = Math.random(), col = ui(u, v); if (!col) continue;
      const x = (u - .5) * sw, y = v * sh, z = 0; const cy = y * Math.cos(tilt), cz = -y * Math.sin(tilt) * -1;
      p.set([x, cy - .35, cz + rnd(-.01, .01)], i * 3); c.set(col, i * 3); i++; }
    while (i < N) { // base / keyboard
      const u = Math.random(), v = Math.random(); let col = G;
      const kx = (u * 14) % 1, ky = (v * 6) % 1, inKeys = v > .42 && v < .92 && u > .08 && u < .92, pad = v > .08 && v < .34 && u > .36 && u < .64;
      if (inKeys) { if (kx > .78 || ky > .72) continue; col = Math.random() < .04 ? O : [.75, .77, .82]; }
      else if (pad) { if (!(u < .37 || u > .63 || v < .09 || v > .33)) continue; col = W; }
      else if (!(u < .01 || u > .99 || v < .02 || v > .98) && Math.random() < .8) continue;
      p.set([(u - .5) * sw, -.35 - .02, (1 - v) * bd * 1.0 + .02], i * 3); c.set(col, i * 3); i++; }
    S.push(p); C.push(c); }
  // 4 globe
  { const p = new Float32Array(N * 3), c = new Float32Array(N * 3); const R = mobile ? 1.35 : 1.75;
    let i = 0; const M = N * 3.2;
    for (let k = 0; k < M && i < N; k++) { const y = 1 - (k / (M - 1)) * 2, lat = Math.asin(y) * 180 / Math.PI, lon = ((k * 137.50776) % 360) - 180;
      if (!isLand(lat, lon)) continue; p.set(ll(lat, lon, R), i * 3); c.set(pick(.08, .06), i * 3); i++; }
    while (i < N) { const th = Math.random() * 6.283, rr = R * rnd(1.35, 1.5); p.set([Math.cos(th) * rr, rnd(-.02, .02), Math.sin(th) * rr], i * 3); c.set(Math.random() < .3 ? O : G, i * 3); i++; }
    S.push(p); C.push(c); }

  const rand = new Float32Array(N * 3); for (let i = 0; i < N * 3; i++) rand[i] = Math.random() * 2 - 1;
  const geo = new THREE.BufferGeometry();
  const P = new Float32Array(S[0]), Cc = new Float32Array(C[0]);
  geo.setAttribute('position', new THREE.BufferAttribute(P, 3)); geo.setAttribute('color', new THREE.BufferAttribute(Cc, 3));
  const sizes = new Float32Array(N); for (let i = 0; i < N; i++) sizes[i] = Math.random() < .08 ? 2 : 1; geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uPx: { value: 1 }, uT: { value: 0 } },
    vertexShader: `attribute float size;attribute vec3 color;varying vec3 vC;varying float vA;uniform float uPx;uniform float uT;
      void main(){vC=color;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=size*uPx*(7.0/-mv.z);vA=clamp(1.4-(-mv.z-4.0)*.25,.25,1.);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `varying vec3 vC;varying float vA;void main(){vec2 c=gl_PointCoord-.5;float d=length(c);if(d>.5)discard;gl_FragColor=vec4(vC,(1.-smoothstep(.1,.5,d))*.85*vA);}`
  });
  const pts = new THREE.Points(geo, mat); group.add(pts);

  function size() { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); group.scale.setScalar(Math.min(1, camera.aspect / .8)); mat.uniforms.uPx.value = renderer.getPixelRatio() * Math.min(w, h) / 380; }
  size(); addEventListener('resize', size);

  let prog = 0, target = 0, mx = 0, my = 0, visible = false;
  addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
  new IntersectionObserver(e => visible = e[0].isIntersecting).observe(sec);
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const blob = S[1];
  const offX = () => innerWidth >= 1024 ? 1.1 : 0, offY = () => innerWidth < 820 ? .12 : 0;
  const clock = new THREE.Clock(); let spin = 0;
  const steps = [...document.querySelectorAll('.mstep')], rail = [...document.querySelectorAll('#rail div')];
  const mP = document.getElementById('mP'), mN = document.getElementById('mN'); mN.textContent = N.toLocaleString('es');
  let lastStep = -1;
  function frame() {
    requestAnimationFrame(frame); if (!visible) return;
    const t = clock.getElapsedTime(); prog += (target - prog) * .08;
    const seg = Math.min(3.999, Math.max(0, prog)), i0 = Math.floor(seg), f = ease(seg - i0), i1 = i0 + 1;
    // animate blob (liquid metal)
    if (i0 <= 1 && i1 >= 1) {
      const R = innerWidth < 820 ? 1.05 : 1.35;
      for (let i = 0; i < N; i++) { const k = i * 3, x = blobDir[k], y = blobDir[k + 1], z = blobDir[k + 2];
        const n = Math.sin(x * 3.1 + t * 1.3) * Math.cos(y * 2.7 - t) * .14 + Math.sin(z * 4.2 + t * 1.7) * .08 + Math.sin((x + z) * 6 + t * 2.2) * .03;
        const r = R * (1 + n); blob[k] = x * r * 1.25; blob[k + 1] = y * r * .62 - .1; blob[k + 2] = z * r * 1.25; }
    }
    const A = S[i0], Bs = S[i1], CA = C[i0], CB = C[i1], wob = Math.sin(f * Math.PI) * .9;
    for (let k = 0; k < N * 3; k++) { P[k] = A[k] + (Bs[k] - A[k]) * f + rand[k] * wob * (.6 + .4 * Math.sin(t * 2 + k)); Cc[k] = CA[k] + (CB[k] - CA[k]) * f; }
    if (i0 === 0 && f < .02) for (let k = 0; k < N * 3; k += 3) { P[k] += Math.sin(t * .6 + rand[k] * 6) * .05; P[k + 1] += Math.cos(t * .5 + rand[k + 1] * 6) * .05; }
    geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
    // rotation per stage
    const st = Math.round(seg);
    spin += (st === 0 || st === 1 || st === 4) ? .0035 : 0;
    const face = (st === 2) ? 0 : (st === 3 ? -.45 : spin);
    group.rotation.y += ((face + mx * .5) - group.rotation.y) * .05;
    group.rotation.x += (((st === 3 ? .32 : st === 4 ? .28 : .1) + my * .3) - group.rotation.x) * .05;
    group.position.x += (offX() - group.position.x) * .05; group.position.y += (offY() - group.position.y) * .05;
    mat.uniforms.uT.value = t;
    renderer.render(scene, camera);
    if (st !== lastStep) { lastStep = st; steps.forEach((s, j) => s.classList.toggle('on', j === st)); rail.forEach((r, j) => r.classList.toggle('on', j === st)); }
    mP.textContent = Math.round(prog / 4 * 100) + '%';
  }
  frame();
  // scroll mapping
  const update = () => { const r = sec.getBoundingClientRect(); const total = r.height - innerHeight; const p = Math.min(1, Math.max(0, -r.top / total)); target = p * 4; };
  addEventListener('scroll', update, { passive: true }); update();
  steps[0].classList.add('on'); rail[0].classList.add('on');
  return {};
})();

/* =========================================================
   PROJECTS
   ========================================================= */
(function () {
  const P = [
    { name: "SaniHands", year: "2025", img: "assets/sani.webp", alt: "Landing page de SaniHands.ai en laptop", desc: "Landing page para SaniHands.ai, plataforma SaaS de higiene de manos. Rápida y enfocada en conversión.", role: "Diseño, desarrollo web y DevOps", type: "SaaS · Landing page", tags: ["UI/UX", "Desarrollo web", "Rendimiento", "SEO básico"] },
    { name: "ConvoFlow", year: "2025", img: "assets/convo.webp", alt: "Landing page de ConvoFlow en laptop", desc: "Landing page diseñada para convertir visitas en leads, con un mensaje claro y un flujo optimizado.", role: "Diseño y desarrollo web", type: "Landing page", tags: ["UI/UX", "Desarrollo web", "Conversión"] },
    { name: "Zoogolf", year: "2025", img: "assets/zoo.webp", alt: "App Zoogolf en un teléfono", desc: "App de golf con una experiencia clara y ágil, lista para escalar.", role: "Diseño y desarrollo de app, branding, publicación y soporte", type: "App móvil", tags: ["App móvil", "Branding", "Publicación", "Soporte"] },
    { name: "Fleur", year: "2026", img: "assets/fleur.webp", alt: "Sitio web de la agencia Fleur en monitor", desc: "Sitio web para una agencia de marketing, construido en Framer.", role: "UI/UX y desarrollo web", type: "Sitio web · Framer", tags: ["UI/UX", "Framer", "Desarrollo web"] }
  ];
  const media = document.getElementById('pmedia'), body = document.getElementById('pbody'), tag = document.getElementById('ptag'), th = document.getElementById('pthumbs'), bar = document.getElementById('ptimer');
  P.forEach((p, i) => { const im = new Image(); im.src = p.img; im.alt = p.alt; im.decoding = 'async'; media.insertBefore(im, th); });
  th.innerHTML = P.map((p, i) => `<button aria-label="Ver ${p.name}"><img src="${p.img}" alt=""></button>`).join('');
  [...th.children].forEach((b, i) => b.onclick = e => { e.stopPropagation(); show(i); reset(); });
  let cur = 0, timer, t0 = 0; const DUR = 6500;
  function show(i) {
    cur = (i + P.length) % P.length; const p = P[cur];
    media.querySelectorAll(':scope>img').forEach((im, k) => im.classList.toggle('on', k === cur));
    [...th.children].forEach((b, k) => b.classList.toggle('on', k === cur));
    media.classList.remove('glitch'); void media.offsetWidth; media.classList.add('glitch');
    tag.textContent = p.type + " · " + p.year;
    body.innerHTML = `<div class="fade"><div class="proj-count"><b>${String(cur + 1).padStart(2, '0')}</b> / ${String(P.length).padStart(2, '0')}</div>
      <h3 class="display">${p.name}</h3><p>${p.desc}</p>
      <dl class="meta"><div><dt>Año</dt><dd>${p.year}</dd></div><div><dt>Rol</dt><dd>${p.role}</dd></div></dl>
      <div class="chips">${p.tags.map(t => `<span class="chip">${t}</span>`).join('')}</div></div>`;
  }
  document.getElementById('prev').onclick = () => { show(cur - 1); reset(); };
  document.getElementById('next').onclick = () => { show(cur + 1); reset(); };
  media.addEventListener('click', () => { show(cur + 1); reset(); });
  function reset() { t0 = performance.now(); }
  (function tick(n) { if (!REDUCE) { const k = (n - t0) / DUR; if (k >= 1) { show(cur + 1); t0 = n; } bar.style.width = Math.min(100, k * 100) + '%'; } requestAnimationFrame(tick); })(0);
  show(0); reset();
  if (FINE) {
    media.addEventListener('mousemove', e => { const r = media.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; const im = media.querySelector(':scope>img.on'); if (im) im.style.transform = `translate(${-x * 22}px,${-y * 22}px) scale(1.02)`; });
    media.addEventListener('mouseleave', () => media.querySelectorAll(':scope>img').forEach(i => i.style.transform = ''));
  }
})();

/* ---------- services (horizontal) ---------- */
const SVC = [
  ["Diseño UI/UX", "Interfaces modernas y flujos claros que tus usuarios entienden a la primera.", '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/>'],
  ["Desarrollo Web", "Sitios y landing pages rápidos, responsivos y con SEO básico incluido.", '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>'],
  ["Apps Móviles", "Apps para iOS y Android con experiencias intuitivas y escalables.", '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>'],
  ["Software a la medida", "Paneles, automatización, roles e integraciones hechos para tu operación.", '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>'],
  ["Soluciones SaaS", "Diseñamos y construimos productos SaaS: desde la landing hasta la plataforma.", '<path d="M18 10h-1.3A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>'],
  ["SEO y Performance", "Optimización técnica y contenido base para cargar rápido y posicionar mejor.", '<path d="m22 12-4-4v3H3v2h15v3z"/><path d="M3 5v14"/>'],
  ["Ciberseguridad", "Evaluación, hardening y monitoreo para reducir riesgos en tu web y sistemas.", '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'],
  ["DevOps", "Despliegues, servidores y automatización para que tu producto esté siempre en línea.", '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>']
];
document.getElementById('svcTrack').innerHTML = SVC.map((s, i) => `<article class="svc"><div class="n">${String(i + 1).padStart(2, '0')} <span>/ 08</span></div>
  <div class="sico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${s[2]}</svg></div>
  <h3>${s[0]}</h3><p>${s[1]}</p><a href="#contacto" data-svc="${s[0]}">Cotizar <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M8 7h9v9"/></svg></a>
  <span class="big">${String(i + 1).padStart(2, '0')}</span></article>`).join('') +
  `<div class="svc-end"><span style="font:500 12px var(--mono);letter-spacing:.14em">// SIGUIENTE PASO</span><h3>¿Listo para construir?</h3><a class="btn btn-dark cal" href="${CONFIG.cal}" target="_blank" rel="noopener" style="width:max-content">Agendar una cita →</a></div>`;
document.querySelectorAll('[data-svc]').forEach(a => a.addEventListener('click', () => {
  const sel = document.querySelector('select[name=servicio]'), v = a.dataset.svc.toLowerCase();
  const map = { 'diseño': 'Diseño UI/UX', 'desarrollo': 'Desarrollo web / landing page', 'apps': 'App móvil', 'software': 'Software a la medida', 'soluciones': 'Solución SaaS', 'seo': 'SEO y performance', 'ciberseguridad': 'Ciberseguridad', 'devops': 'DevOps' };
  sel.value = map[v.split(' ')[0]] || 'Otro';
}));

/* ---------- testimonials ---------- */
const TST = [
  ["Nos entregaron una app con una experiencia clara y ágil, lista para escalar.", "Rolando Flores", "Zoogolf · App móvil", "RF"],
  ["Una landing rápida y enfocada en conversión para nuestro SaaS.", "SaniHands", "SaaS y landing page", "SH"],
  ["Un sitio claro, confiable y con muy buen rendimiento.", "Alex Carrera", "Micoope · Sitio web", "AC"],
  ["Clarificaron nuestro mensaje y optimizaron el flujo de la página para generar más leads.", "ConvoFlow", "Landing page", "CF"],
  ["Nuestro sitio ahora se ve profesional, con mejor estructura y más velocidad.", "Lilian", "Tesla Diagnóstico · Sitio web", "L"]
];
const tcard = t => `<figure class="t"><div class="stars">★★★★★</div><q>${t[0]}</q><figcaption class="who"><span class="av">${t[3]}</span><span><b>${t[1]}</b><small>${t[2]}</small></span></figcaption></figure>`;
const r1 = [0, 1, 2, 3, 4].map(i => TST[i]), r2 = [3, 4, 0, 1, 2].map(i => TST[i]);
document.getElementById('tr1').innerHTML = [...r1, ...r1].map(tcard).join('');
document.getElementById('tr2').innerHTML = [...r2, ...r2].map(tcard).join('');

/* ---------- faq ---------- */
const FAQ = [
  ["¿Qué servicios ofrece WebAppsGT?", "Diseño UI/UX, desarrollo web y landing pages, apps móviles para iOS y Android, software a la medida, soluciones SaaS, SEO y performance, ciberseguridad y DevOps."],
  ["¿Cómo es el proceso de trabajo?", "Trabajamos en cuatro etapas: brief, diseño, desarrollo y lanzamiento. En cada etapa revisas y apruebas antes de avanzar, para que no haya sorpresas."],
  ["¿Cuánto tiempo tarda un proyecto?", "Depende del alcance. Una landing page suele tomar entre 2 y 4 semanas; apps y software a la medida se planifican por fases. Te damos un cronograma claro desde la primera reunión."],
  ["¿Qué necesito para comenzar?", "Solo una idea clara de tu objetivo. Agenda una cita de 30 minutos y nosotros te guiamos con el brief: público, contenido, referencias y prioridades."],
  ["¿Incluyen diseño y desarrollo en el mismo servicio?", "Sí. El mismo equipo diseña y desarrolla tu proyecto, así el resultado final es fiel al diseño aprobado."],
  ["¿Puedo pedir cambios o revisiones?", "Sí. Cada etapa incluye rondas de revisión para ajustar el diseño y el contenido antes de avanzar."],
  ["¿La web queda optimizada para velocidad y SEO?", "Sí. Todos nuestros sitios incluyen optimización de rendimiento y SEO técnico base, además de tracking de conversiones."],
  ["¿Ofrecen soporte y mantenimiento después del lanzamiento?", "Sí. Ofrecemos soporte, mantenimiento, medición y mejoras continuas para que tu producto siga creciendo."]
];
document.getElementById('faqlist').innerHTML = FAQ.map((f, i) => `<details class="rv"${i ? '' : ' open'}><summary>${f[0]}<span class="pm">+</span></summary><div class="ans"><div><p>${f[1]}</p></div></div></details>`).join('');

/* ---------- form ---------- */
document.getElementById('cform').addEventListener('submit', e => {
  e.preventDefault(); const f = e.target; if (!f.reportValidity()) return;
  const d = new FormData(f);
  const subject = `Nuevo proyecto: ${d.get('servicio')} — ${d.get('nombre')}`;
  const bodyTxt = `Nombre: ${d.get('nombre')}\nCorreo: ${d.get('correo')}\nServicio: ${d.get('servicio')}\n\n${d.get('mensaje')}`;
  location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTxt)}`;
  document.getElementById('fok').style.display = 'block';
});

/* ---------- footer giant spotlight ---------- */
const giant = document.getElementById('giant');
document.getElementById('footer').addEventListener('mousemove', e => { const r = giant.getBoundingClientRect(); giant.style.setProperty('--gx', (e.clientX - r.left) + 'px'); giant.style.setProperty('--gy', (e.clientY - r.top) + 'px'); });

/* ---------- why tilt ---------- */
if (FINE) document.querySelectorAll('.why').forEach(c => {
  c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`; });
  c.addEventListener('mouseleave', () => c.style.transform = '');
});

/* =========================================================
   GSAP: intro, reveals, scrub effects
   ========================================================= */
function counters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const to = +el.dataset.count;
    const run = () => { const t0 = performance.now(), d = 1500; (function f(n) { const k = Math.min(1, (n - t0) / d), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e); if (k < 1) requestAnimationFrame(f); })(t0); };
    if (HAS_GSAP) ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: run }); else run();
  });
}

function initScroll() {
  if (!HAS_GSAP || REDUCE) {
    document.querySelectorAll('.rv,.hero-in').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; });
    document.querySelectorAll('.fl').forEach(e => e.style.backgroundPosition = '0 0');
    counters(); return;
  }
  // split headings (except hero, handled in intro)
  document.querySelectorAll('.split:not(#heroTitle)').forEach(h => {
    gsap.from(h.querySelectorAll('.w>span'), { yPercent: 115, rotate: 4, duration: 1.1, ease: 'expo.out', stagger: .06, scrollTrigger: { trigger: h, start: 'top 85%' } });
  });
  // generic reveals
  ScrollTrigger.batch('.rv', { start: 'top 90%', onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .08, overwrite: true }) });
  // scramble eyebrows
  document.querySelectorAll('.scramble').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => scramble(el) }));
  counters();
  // statement fill
  gsap.to('.fl', { backgroundPosition: '0% 0', ease: 'none', stagger: .5, scrollTrigger: { trigger: '#statement', start: 'top 70%', end: 'center 40%', scrub: 1 } });
  // project media reveal
  gsap.fromTo('#pmedia', { clipPath: 'inset(12% 18% 12% 18% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none', scrollTrigger: { trigger: '#pmedia', start: 'top 95%', end: 'top 35%', scrub: 1 } });
  // hero parallax out
  gsap.to('#heroTitle', { yPercent: -18, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('#globeWrap', { scale: .82, opacity: .35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  // horizontal services (desktop)
  ScrollTrigger.matchMedia({
    '(min-width: 821px)': function () {
      const track = document.getElementById('svcTrack'), hs = document.getElementById('hscroll');
      const dist = () => track.scrollWidth - innerWidth;
      gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: hs, start: 'center center', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, onUpdate: s => document.getElementById('hsb').style.width = (s.progress * 100) + '%' } });
    },
    '(max-width: 820px)': function () {
      const hs = document.getElementById('hscroll'); hs.style.overflowX = 'auto'; hs.style.scrollSnapType = 'x mandatory';
      hs.addEventListener('scroll', () => document.getElementById('hsb').style.width = (hs.scrollLeft / (hs.scrollWidth - hs.clientWidth) * 100) + '%', { passive: true });
    }
  });
  // marquee driven by scroll velocity
  const mq = document.getElementById('mq'); let mx = 0, vel = 0;
  ScrollTrigger.create({ onUpdate: s => { vel = s.getVelocity(); } });
  gsap.ticker.add(() => { const w = mq.scrollWidth / 2; mx -= 1 + Math.min(14, Math.abs(vel) / 220); vel *= .9; if (mx <= -w) mx += w; mq.style.transform = `translateX(${mx}px)`; });
  // morph section pinned text title fade
  gsap.from('.morph-title .w>span', { yPercent: 115, duration: 1, ease: 'expo.out', stagger: .04, scrollTrigger: { trigger: '#proceso', start: 'top 60%' } });
  ScrollTrigger.refresh();
}
document.querySelectorAll('.morph-title').forEach(splitWords);

/* ---------- preloader + intro ---------- */
(function () {
  const L = document.getElementById('loader'), num = document.getElementById('ldNum'), bar = document.getElementById('ldBar'), st = document.getElementById('ldStatus');
  const msgs = ['Inicializando…', 'Cargando módulos…', 'Renderizando globo…', 'Compilando interfaz…', 'Listo'];
  const imgs = [...document.images].filter(i => !i.loading || i.loading !== 'lazy');
  let loaded = 0; const total = Math.max(1, imgs.length);
  imgs.forEach(i => { if (i.complete) loaded++; else i.addEventListener('load', () => loaded++, { once: true }), i.addEventListener('error', () => loaded++, { once: true }); });
  let shown = 0; const start = performance.now(), MIN = REDUCE ? 200 : 1700;
  function step(n) {
    const real = Math.min(1, loaded / total), time = Math.min(1, (n - start) / MIN), k = Math.min(real, time);
    shown += (k * 100 - shown) * .12;
    const v = Math.round(shown); num.textContent = String(v).padStart(3, '0'); bar.style.width = v + '%';
    st.textContent = msgs[Math.min(msgs.length - 1, Math.floor(v / 25))];
    if (v >= 99 && time >= 1) return done();
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
  setTimeout(() => { if (document.body.classList.contains('loading')) done(); }, 5000);
  let finished = false;
  function done() {
    if (finished) return; finished = true;
    num.textContent = '100'; document.body.classList.remove('loading');
    if (HAS_GSAP && !REDUCE) {
      const tl = gsap.timeline();
      tl.to(L, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' })
        .set(L, { display: 'none' })
        .from('#heroTitle .w>span', { yPercent: 115, rotate: 5, duration: 1.2, ease: 'expo.out', stagger: .08 }, '-=.45')
        .to('.hero-in', { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .1 }, '-=.9')
        .add(() => window.__globeBoost && window.__globeBoost(), '-=1.4');
      gsap.set('.hero-in', { opacity: 0, y: 30 });
    } else { L.style.display = 'none'; }
    initScroll();
  }
})();
