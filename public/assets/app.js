(function () {
'use strict';

function jxGet(ctx, path) {
  if (path === 'true') return true;
  if (path === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
  var v = ctx, parts = path.split('.');
  for (var i = 0; i < parts.length; i++) { if (v == null) return ''; v = v[parts[i]]; }
  return v;
}
function jxEsc(v) {
  return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function jxRender(tpl, ctx) {
  tpl = tpl.replace(/<sc-for\s+list="\{\{\s*([\w.$]+)\s*\}\}"\s+as="(\w+)"[^>]*>([\s\S]*?)<\/sc-for>/g, function (m, path, as, inner) {
    var list = jxGet(ctx, path) || [];
    return list.map(function (item, i) {
      var c = Object.create(ctx); c[as] = item; c.$index = i;
      return jxRender(inner, c);
    }).join('');
  });
  return tpl.replace(/\{\{\s*([\w.$]+)\s*\}\}/g, function (m, p) {
    var v = jxGet(ctx, p);
    return typeof v === 'function' ? '' : jxEsc(v);
  });
}

class DCLogic {
  constructor() { this.props = {}; this.state = {}; }
  setState(p) { Object.assign(this.state, p); if (this.componentDidUpdate) this.componentDidUpdate(); if (window.__jxRefresh) window.__jxRefresh(); }
  forceUpdate() { if (window.__jxRefresh) window.__jxRefresh(); }
}

class Component extends DCLogic {
  componentDidMount() {
    this._tries = 0;
    this._ktries = 0;
    this._boot();
    this._bootSkills();
    this._htries = 0;
    this._bootHangar();
    this._gtries = 0;
    this._bootGlass();
    this._botCycle = setInterval(() => {
      if (Date.now() < (this._botPause || 0)) return;
      var b0 = (this.state && this.state.bot) || 0;
      this.setState({ bot: (b0 + 1) % 5 });
    }, 5200);
    this._cycle = setInterval(() => {
      if (Date.now() < (this._pauseUntil || 0)) return;
      var a = (this.state && this.state.active) || 0;
      this.setState({ active: (a + 1) % 8 });
    }, 4200);
  }
  _pickSkill(i) {
    this._pauseUntil = Date.now() + 15000;
    this.setState({ active: ((i % 8) + 8) % 8 });
  }
  _skillData() {
    if (this._sd) return this._sd;
    this._sd = [
      { name: 'Mechanic', col: '#22F2E1', cat: 'AUTO', where: 'GLASSES + PHONE', icon: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z', body: 'Look under the hood and Jessi talks you through what she sees \u2014 fluids, belts, leaks \u2014 and what to check next.', ask: '"What\u2019s this drip under the engine?"' },
      { name: 'Plant Doctor', col: '#7CFF6B', cat: 'HOME & GARDEN', where: 'GLASSES + PHONE', icon: 'M12 22V12M12 12c0-5 4-8 9-8 0 5-4 8-9 8zM12 15c0-4-3-6-8-6 0 4 3 6 8 6z', body: 'Identify plants, pests and problems, with planting advice for your local growing zone and frost dates.', ask: '"What\u2019s eating my squash?"' },
      { name: 'Kitchen', col: '#FFB547', cat: 'FAMILY', where: 'GLASSES + PHONE', icon: 'M6 13.9A4 4 0 0 1 7 6a5 5 0 0 1 10 0 4 4 0 0 1 1 7.9V21H6zM6 17h12', body: 'Look in the fridge, get dinner ideas from what you have, and get walked through the recipe hands-free.', ask: '"What can I make tonight with this?"' },
      { name: 'Translator', col: '#FF3DCB', cat: 'TRAVEL', where: 'GLASSES + PHONE', icon: 'M5 8h8M9 4v4M7 8c0 4 3 7 6 8M11 8c-1 4-4 7-7 8M14 20l4-10 4 10M15.5 17h5', body: 'Read signs and menus where you look, and help you hold a conversation in another language.', ask: '"What does this sign say?"' },
      { name: 'Field Tech', col: '#9B7BFF', cat: 'WORK', where: 'GLASSES + PHONE', icon: 'M12 2a10 10 0 1 0 10 10M12 12l6-6M12 7v1M7 12h1M16 12h1', body: 'Read gauges and nameplates, pull up the right manual, and log what you checked \u2014 without putting your tools down.', ask: '"Log this pressure reading and flag it if it\u2019s high."' },
      { name: 'Tutor', col: '#5AB8FF', cat: 'FAMILY', where: 'PHONE', icon: 'M2 7l10-4 10 4-10 4zM6 9v5c3 2 9 2 12 0V9M22 7v6', body: 'Snap a homework problem and Jessi teaches the steps instead of just handing over the answer.', ask: '"Help me understand this fraction problem."' },
      { name: 'Shopper', col: '#FF7A45', cat: 'EVERYDAY', where: 'GLASSES + PHONE', icon: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0', body: 'Compare products on the shelf, read labels and check whether it fits what you actually need.', ask: '"Which of these two drills is the better deal?"' },
      { name: 'Job Estimator', col: '#F2F55A', cat: 'WORK', where: 'GLASSES + PHONE', icon: 'M4 2h16v20H4zM8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h8', body: 'Walk a job, call out measurements and materials, and get a draft estimate and materials list before you leave the site.', ask: '"Estimate drywall for this room."' }
    ];
    return this._sd;
  }
  _bootSkills() {
    if (this._k) return;
    if (!window.THREE || !this.skillCanvas) {
      if (this._ktries++ < 100) this._kretry = setTimeout(() => this._bootSkills(), 100);
      return;
    }
    try { this._setupSkills(); } catch (e) { this._k = null; }
  }
  _setupSkills() {
    var THREE = window.THREE, c = this.skillCanvas, self = this, data = this._skillData();
    var renderer = new THREE.WebGLRenderer({ canvas: c, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x04050B, 1);
    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x04050B, 9, 30);
    var camera = new THREE.PerspectiveCamera(46, 1, 0.1, 200);
    camera.position.set(0, 2.6, 11);
    var root = new THREE.Group(); scene.add(root);
    var ADD = THREE.AdditiveBlending;

    var gc = document.createElement('canvas'); gc.width = gc.height = 128;
    var g2 = gc.getContext('2d'), gr = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g2.fillStyle = gr; g2.fillRect(0, 0, 128, 128);
    var glowTex = new THREE.CanvasTexture(gc);
    function glowSprite(col, sc) {
      var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color(col), transparent: true, depthWrite: false, blending: ADD }));
      sp.scale.set(sc, sc, 1); return sp;
    }
    function labelSprite(text, col) {
      var cv = document.createElement('canvas'); cv.width = 512; cv.height = 96;
      var x = cv.getContext('2d');
      x.font = '700 40px "JetBrains Mono", monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.shadowColor = col; x.shadowBlur = 18; x.fillStyle = '#EAF2FF'; x.fillText(text, 256, 48);
      var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false }));
      sp.scale.set(2.6, 0.49, 1); return sp;
    }

    // drifting dust
    var DN = 1600, dp = new Float32Array(DN * 3);
    for (var i = 0; i < DN; i++) { dp[i*3] = (Math.random() - 0.5) * 44; dp[i*3+1] = Math.random() * 18 - 7; dp[i*3+2] = Math.random() * -30 + 8; }
    var dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
    var dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0x9DB4FF, size: 0.05, transparent: true, opacity: 0.6, depthWrite: false }));
    scene.add(dust);

    // holo floor
    var polar = new THREE.PolarGridHelper(9, 24, 10, 96, 0x8B5CFF, 0x8B5CFF);
    polar.material.transparent = true; polar.material.opacity = 0.32; polar.material.depthWrite = false;
    polar.position.y = -2.4; root.add(polar);

    // Jessi core
    var core = new THREE.Group(); root.add(core);
    var coreWire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.0, 1)), new THREE.LineBasicMaterial({ color: 0x22F2E1, transparent: true, opacity: 0.85, depthWrite: false, blending: ADD }));
    var coreIn = new THREE.Mesh(new THREE.IcosahedronGeometry(0.46, 1), new THREE.MeshBasicMaterial({ color: 0xFF3DCB, wireframe: true, transparent: true, opacity: 0.9 }));
    var coreGlow = glowSprite('#22F2E1', 5.2);
    var coreLabel = labelSprite('JESSI', '#22F2E1'); coreLabel.position.y = 1.6; coreLabel.scale.set(2.2, 0.41, 1);
    core.add(coreWire, coreIn, coreGlow, coreLabel);

    // skill ring
    var R = 4.4, ring = new THREE.Group(); root.add(ring);
    var op = new THREE.EllipseCurve(0, 0, R, R, 0, Math.PI * 2).getPoints(200).map(function (q) { return new THREE.Vector3(q.x, 0, q.y); });
    var orbit = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(op), new THREE.LineDashedMaterial({ color: 0x8B5CFF, dashSize: 0.2, gapSize: 0.16, transparent: true, opacity: 0.55, depthWrite: false }));
    orbit.computeLineDistances(); ring.add(orbit);

    var nodes = data.map(function (d, idx) {
      var th = idx / data.length * Math.PI * 2, col = new THREE.Color(d.col);
      var grp = new THREE.Group();
      var baseY = Math.sin(th * 2) * 0.35;
      grp.position.set(Math.cos(th) * R, baseY, Math.sin(th) * R);
      var wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.4, 0)), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.95, depthWrite: false, blending: ADD }));
      var solid = new THREE.Mesh(new THREE.OctahedronGeometry(0.19, 0), new THREE.MeshBasicMaterial({ color: col }));
      var glow = glowSprite(d.col, 1.7); glow.material.opacity = 0.45;
      var label = labelSprite(d.name.toUpperCase(), d.col); label.position.y = 0.85; label.scale.set(1.7, 0.32, 1); label.material.opacity = 0.55;
      var hit = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
      hit.userData.idx = idx;
      grp.add(wire, solid, glow, label, hit); ring.add(grp);
      var beam = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), grp.position.clone()]), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.1, depthWrite: false, blending: ADD }));
      ring.add(beam);
      return { grp: grp, wire: wire, glow: glow, label: label, hit: hit, beam: beam, th: th, baseY: baseY, col: col };
    });

    var haloMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.95, depthWrite: false, blending: ADD });
    var halo = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.03, 8, 72), haloMat); ring.add(halo);
    var halo2 = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.012, 8, 72), haloMat); ring.add(halo2);
    var pulses = [0, 1, 2].map(function (k) { var p = glowSprite('#FFFFFF', 0.6); ring.add(p); return { p: p, t: k / 3 }; });

    var st = { active: (self.state && self.state.active) || 0, rot: 0, front: Math.PI / 2 - 0.55 };
    st.rot = nodes[st.active].th - st.front;
    var wide = true;
    function resize() {
      var wd = c.clientWidth || 1, ht = c.clientHeight || 1;
      renderer.setSize(wd, ht, false); camera.aspect = wd / ht; camera.updateProjectionMatrix();
      wide = wd > 960;
      if (wide) { root.position.set(-3.1, -0.3, 0); st.front = Math.PI / 2 - 0.55; camera.position.z = 11; }
      else { root.position.set(0, 2.2, 0); st.front = Math.PI / 2; camera.position.z = 15; }
    }
    resize();
    var ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(c);

    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), hits = nodes.map(function (n) { return n.hit; }), mx = 0, my = 0;
    function toNdc(e) { var rc = c.getBoundingClientRect(); ndc.x = ((e.clientX - rc.left) / rc.width) * 2 - 1; ndc.y = -((e.clientY - rc.top) / rc.height) * 2 + 1; }
    var onDown = function (e) { toNdc(e); ray.setFromCamera(ndc, camera); var h = ray.intersectObjects(hits, false); if (h.length) self._pickSkill(h[0].object.userData.idx); };
    var onHover = function (e) { toNdc(e); mx = ndc.x; my = -ndc.y; ray.setFromCamera(ndc, camera); c.style.cursor = ray.intersectObjects(hits, false).length ? 'pointer' : 'default'; };
    c.addEventListener('pointerdown', onDown); c.addEventListener('pointermove', onHover);

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var idle = reduce ? 0 : 1;
    var k = { renderer: renderer, ro: ro, raf: 0, visible: true, c: c, onDown: onDown, onHover: onHover };
    k.setActive = function (i) { st.active = i; };
    this._k = k;

    var tmp = new THREE.Vector3(), activeCol = new THREE.Color(data[st.active].col);
    var last = performance.now(), time = 0;
    function shortest(a) { return Math.atan2(Math.sin(a), Math.cos(a)); }
    function frame(now) {
      if (!k.visible) { k.raf = 0; return; }
      var dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt;
      var an = nodes[st.active];
      st.rot += shortest(an.th - st.front - st.rot) * 0.06;
      ring.rotation.y = st.rot + Math.sin(time * 0.3) * 0.04 * idle;
      activeCol.lerp(an.col, 0.08);
      for (var i2 = 0; i2 < nodes.length; i2++) {
        var n = nodes[i2], on = i2 === st.active;
        var sc = n.grp.scale.x + ((on ? 1.75 : 1) - n.grp.scale.x) * 0.1;
        n.grp.scale.set(sc, sc, sc);
        n.wire.rotation.y += dt * (on ? 2.4 : 0.5 * idle); n.wire.rotation.x += dt * (on ? 1.4 : 0.25 * idle);
        n.glow.material.opacity += ((on ? 1 : 0.4) - n.glow.material.opacity) * 0.1;
        n.beam.material.opacity += ((on ? 0.95 : 0.1) - n.beam.material.opacity) * 0.1;
        n.label.material.opacity += ((on ? 1 : 0.5) - n.label.material.opacity) * 0.1;
        n.grp.position.y = n.baseY + Math.sin(time * 1.2 + i2) * 0.12 * idle;
      }
      tmp.copy(an.grp.position);
      halo.position.lerp(tmp, 0.15); halo2.position.copy(halo.position);
      halo.lookAt(camera.position); halo2.lookAt(camera.position);
      halo.rotateZ(time * 1.5); halo2.rotateZ(-time);
      haloMat.color.copy(activeCol);
      for (var pi = 0; pi < pulses.length; pi++) {
        var pu = pulses[pi]; pu.t += dt * 0.8; if (pu.t > 1) pu.t -= 1;
        pu.p.position.copy(tmp).multiplyScalar(pu.t);
        pu.p.material.color.copy(activeCol);
        pu.p.material.opacity = Math.sin(Math.PI * pu.t);
      }
      coreWire.rotation.y += dt * 0.4; coreWire.rotation.x += dt * 0.15 * idle;
      coreIn.rotation.x -= dt * 0.8; coreIn.rotation.y += dt * 0.5;
      coreGlow.material.color.copy(activeCol);
      coreGlow.material.opacity = 0.75 + Math.sin(time * 2.2) * 0.2 * idle;
      polar.rotation.y += dt * 0.05 * idle;
      dust.rotation.y += dt * 0.012 * idle;
      camera.position.x += ((mx * 0.9) - camera.position.x) * 0.04;
      camera.position.y += ((2.6 - my * 0.6) - camera.position.y) * 0.04;
      camera.lookAt(root.position.x * 0.45, root.position.y * 0.6, 0);
      renderer.render(scene, camera);
      k.raf = requestAnimationFrame(frame);
    }
    var io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(function (es) {
      k.visible = es[0].isIntersecting;
      if (k.visible && !k.raf) { last = performance.now(); k.raf = requestAnimationFrame(frame); }
    }) : null;
    if (io) io.observe(c);
    k.io = io;
    k.raf = requestAnimationFrame(frame);
  }
  componentDidUpdate() {
    if (this._h) this._h.setActive((this.state && this.state.bot) || 0);
    if (this._k) this._k.setActive((this.state && this.state.active) || 0);
    var s = this._s;
    if (s && window.THREE) {
      var a = this.props.accent || '#22F2E1';
      if (s.accent !== a) { s.accent = a; s.ptsMat.color.set(a); s.lineMat.color.set(a); s.glowTint(a); }
    }
  }
  componentWillUnmount() {
    clearTimeout(this._retry);
    clearTimeout(this._kretry);
    clearInterval(this._cycle);
    clearInterval(this._botCycle);
    clearTimeout(this._gretry);
    var gS = this._g;
    if (gS) {
      cancelAnimationFrame(gS.raf);
      if (gS.ro) gS.ro.disconnect();
      if (gS.io) gS.io.disconnect();
      if (gS.host) gS.host.removeEventListener('pointermove', gS.onMove);
      gS.renderer.dispose();
      this._g = null;
    }
    clearTimeout(this._hretry);
    var h = this._h;
    if (h) {
      cancelAnimationFrame(h.raf);
      if (h.ro) h.ro.disconnect();
      if (h.io) h.io.disconnect();
      h.c.removeEventListener('pointermove', h.onMove);
      h.renderer.dispose();
      this._h = null;
    }
    var k = this._k;
    if (k) {
      cancelAnimationFrame(k.raf);
      if (k.ro) k.ro.disconnect();
      if (k.io) k.io.disconnect();
      k.c.removeEventListener('pointerdown', k.onDown);
      k.c.removeEventListener('pointermove', k.onHover);
      k.renderer.dispose();
      this._k = null;
    }
    var s = this._s;
    if (!s) return;
    cancelAnimationFrame(s.raf);
    if (s.ro) s.ro.disconnect();
    if (s.host) s.host.removeEventListener('pointermove', s.onMove);
    window.removeEventListener('scroll', s.onScroll);
    s.renderer.dispose();
    this._s = null;
  }
  _boot() {
    if (this._s) return;
    if (!window.THREE || !this.canvas) {
      if (this._tries++ < 100) this._retry = setTimeout(() => this._boot(), 100);
      return;
    }
    try { this._setup(); } catch (e) { this._s = null; }
  }
  _setup() {
    var THREE = window.THREE, c = this.canvas, self = this;
    var renderer = new THREE.WebGLRenderer({ canvas: c, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x05070D, 1);
    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x05070D, 10, 34);
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
    camera.position.set(0, 0.4, 9);
    var accent = this.props.accent || '#22F2E1';
    var VIOLET = new THREE.Color('#8B5CFF'), AMBER = new THREE.Color('#FFB547'), MAG = new THREE.Color('#FF3DCB');

    // Starfield
    var SN = 2200, spos = new Float32Array(SN * 3);
    for (var i = 0; i < SN; i++) {
      var r0 = 30 + Math.random() * 60, th0 = Math.random() * Math.PI * 2, ph0 = Math.acos(2 * Math.random() - 1);
      spos[i*3] = r0 * Math.sin(ph0) * Math.cos(th0); spos[i*3+1] = r0 * Math.cos(ph0); spos[i*3+2] = -Math.abs(r0 * Math.sin(ph0) * Math.sin(th0));
    }
    var sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(spos, 3));
    var stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xBFD4FF, size: 0.12, transparent: true, opacity: 0.8, fog: false, depthWrite: false }));
    scene.add(stars);

    // Neon grid floor
    var grid = new THREE.GridHelper(120, 120, VIOLET, VIOLET);
    grid.material.transparent = true; grid.material.opacity = 0.45; grid.material.depthWrite = false;
    grid.position.y = -3.4;
    scene.add(grid);

    var group = new THREE.Group(); scene.add(group);

    // Glow sprite
    var gc = document.createElement('canvas'); gc.width = gc.height = 256;
    var gctx = gc.getContext('2d');
    var glowTex = new THREE.CanvasTexture(gc);
    function glowTint(col) {
      var cc = new THREE.Color(col), rgb = Math.round(cc.r*255) + ',' + Math.round(cc.g*255) + ',' + Math.round(cc.b*255);
      gctx.clearRect(0, 0, 256, 256);
      var gr = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      gr.addColorStop(0, 'rgba(' + rgb + ',0.55)'); gr.addColorStop(0.35, 'rgba(139,92,255,0.22)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      gctx.fillStyle = gr; gctx.fillRect(0, 0, 256, 256); glowTex.needsUpdate = true;
    }
    glowTint(accent);
    var glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    glow.scale.set(10, 10, 1); group.add(glow);

    // Neural shell
    var N = 1400, R = 2.35, pos = new Float32Array(N * 3), v = [];
    for (var n = 0; n < N; n++) {
      var y = 1 - (n / (N - 1)) * 2, rr0 = Math.sqrt(1 - y * y), th = n * 2.399963, rr = R * (0.86 + Math.random() * 0.28);
      var p = new THREE.Vector3(Math.cos(th) * rr0 * rr, y * rr, Math.sin(th) * rr0 * rr);
      v.push(p); pos[n*3] = p.x; pos[n*3+1] = p.y; pos[n*3+2] = p.z;
    }
    var pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    var ptsMat = new THREE.PointsMaterial({ color: accent, size: 0.055, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending });
    group.add(new THREE.Points(pg, ptsMat));

    // Core
    var M = 320, cpos = new Float32Array(M * 3);
    for (var k = 0; k < M; k++) {
      var t2 = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), cr = 0.95 * Math.cbrt(Math.random());
      cpos[k*3] = cr * Math.sin(ph) * Math.cos(t2); cpos[k*3+1] = cr * Math.sin(ph) * Math.sin(t2); cpos[k*3+2] = cr * Math.cos(ph);
    }
    var cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.BufferAttribute(cpos, 3));
    var core = new THREE.Points(cg, new THREE.PointsMaterial({ color: MAG, size: 0.04, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending }));
    group.add(core);

    // Wireframe shell + rings
    var shell = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(3.15, 1)), new THREE.LineBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending }));
    group.add(shell);
    var rings = [];
    [[3.7, 1.2, 0.3, accent], [4.2, -0.5, 1.1, '#8B5CFF'], [4.7, 0.9, -0.8, '#FF3DCB']].forEach(function (cfg) {
      var pts = new THREE.EllipseCurve(0, 0, cfg[0], cfg[0], 0, Math.PI * 2).getPoints(160);
      var geo = new THREE.BufferGeometry().setFromPoints(pts.map(function (q) { return new THREE.Vector3(q.x, q.y, 0); }));
      var ring = new THREE.LineLoop(geo, new THREE.LineDashedMaterial({ color: cfg[3], dashSize: 0.25, gapSize: 0.18, transparent: true, opacity: 0.55, depthWrite: false }));
      ring.computeLineDistances(); ring.rotation.x = cfg[1]; ring.rotation.y = cfg[2];
      group.add(ring); rings.push(ring);
    });

    // Synapses (learning)
    var pairs = [];
    for (var a1 = 0; a1 < N; a1++) for (var b1 = a1 + 1; b1 < N; b1++) if (v[a1].distanceToSquared(v[b1]) < 0.3) pairs.push(a1, b1);
    for (var s1 = pairs.length / 2 - 1; s1 > 0; s1--) {
      var j = Math.floor(Math.random() * (s1 + 1)), x0 = pairs[s1*2], x1 = pairs[s1*2+1];
      pairs[s1*2] = pairs[j*2]; pairs[s1*2+1] = pairs[j*2+1]; pairs[j*2] = x0; pairs[j*2+1] = x1;
    }
    var L = Math.min(pairs.length / 2, 3600), lpos = new Float32Array(L * 6);
    for (var q = 0; q < L; q++) { var A = v[pairs[q*2]], B = v[pairs[q*2+1]]; lpos.set([A.x, A.y, A.z, B.x, B.y, B.z], q * 6); }
    var lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(lpos, 3)); lg.setDrawRange(0, 0);
    var lineMat = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.28, depthWrite: false, blending: THREE.AdditiveBlending });
    group.add(new THREE.LineSegments(lg, lineMat));

    // Daydreams
    var sats = [], satGeo = new THREE.OctahedronGeometry(0.13, 0);
    for (var m = 0; m < 7; m++) {
      var sm = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: AMBER, wireframe: m % 2 === 0, transparent: true, opacity: 0.95 }));
      sm.userData = { ang: (m / 7) * Math.PI * 2, rad: 4.0 + (m % 3) * 0.55, tilt: (m - 3) * 0.3, spd: 0.25 + m * 0.03 };
      group.add(sm); sats.push(sm);
    }
    var SEG = 48, thoughts = [];
    for (var tn = 0; tn < 6; tn++) {
      var tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.BufferAttribute(new Float32Array((SEG + 1) * 3), 3));
      var tl = new THREE.Line(tg, new THREE.LineBasicMaterial({ color: AMBER, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
      group.add(tl); thoughts.push({ line: tl, t: -tn * 0.7, started: false, from: 0, sat: 0 });
    }
    function launch(th) { th.from = Math.floor(Math.random() * N); th.sat = Math.floor(Math.random() * sats.length); th.t = 0; th.started = true; }
    function updateThought(th, dt) {
      th.t += dt; if (th.t < 0) return;
      if (!th.started || th.t > 2.6) launch(th);
      var A2 = v[th.from], B2 = sats[th.sat].position, mid = A2.clone().add(B2).multiplyScalar(0.5);
      mid.add(mid.clone().normalize().multiplyScalar(1.5));
      var pts2 = new THREE.QuadraticBezierCurve3(A2, mid, B2).getPoints(SEG), arr = th.line.geometry.attributes.position.array;
      for (var z = 0; z <= SEG; z++) { arr[z*3] = pts2[z].x; arr[z*3+1] = pts2[z].y; arr[z*3+2] = pts2[z].z; }
      th.line.geometry.attributes.position.needsUpdate = true;
      var f = th.t / 2.6, head = Math.min(1, f * 2), tail = Math.max(0, f * 2 - 1);
      th.line.geometry.setDrawRange(Math.floor(tail * SEG), Math.max(2, Math.floor((head - tail) * SEG) + 1));
      th.line.material.opacity = Math.sin(Math.PI * f);
    }

    // Layout
    var wide = true;
    function resize() {
      var wd = c.clientWidth || 1, ht = c.clientHeight || 1;
      renderer.setSize(wd, ht, false); camera.aspect = wd / ht; camera.updateProjectionMatrix();
      wide = wd > 900;
      group.position.set(wide ? 3.3 : 0, wide ? 0.3 : -0.4, 0);
      ptsMat.opacity = wide ? 1 : 0.5; lineMat.opacity = wide ? 0.28 : 0.12;
    }
    resize();
    var ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(c);
    var host = c.parentNode, mx = 0, my = 0, scrollT = 0;
    var onMove = function (e) { var rc = c.getBoundingClientRect(); mx = ((e.clientX - rc.left) / rc.width) * 2 - 1; my = ((e.clientY - rc.top) / rc.height) * 2 - 1; };
    var onScroll = function () { var rc = c.getBoundingClientRect(); scrollT = Math.max(0, Math.min(1, -rc.top / (rc.height || 1))); };
    if (host) host.addEventListener('pointermove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var s = { renderer: renderer, ro: ro, host: host, onMove: onMove, onScroll: onScroll, ptsMat: ptsMat, lineMat: lineMat, accent: accent, glowTint: glowTint, raf: 0 };
    this._s = s;

    var grown = 0, last = performance.now(), time = 0;
    function frame(now) {
      var dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt;
      var speed = self.props.learnSpeed ?? 1;
      if (grown < L) grown = Math.min(L, grown + dt * 200 * speed * (1 + grown / 350));
      lg.setDrawRange(0, Math.floor(grown) * 2);
      group.rotation.y += dt * 0.16 * speed;
      group.rotation.x += ((my * 0.3) - group.rotation.x) * 0.05;
      group.rotation.z += ((-mx * 0.15) - group.rotation.z) * 0.05;
      var br = 1 + Math.sin(time * 1.6) * 0.015; group.scale.set(br, br, br);
      core.rotation.y -= dt * 0.6; core.rotation.x += dt * 0.2;
      shell.rotation.y -= dt * 0.08; shell.rotation.x += dt * 0.05;
      for (var ri = 0; ri < rings.length; ri++) rings[ri].rotation.z += dt * (0.2 + ri * 0.12) * (ri % 2 ? -1 : 1);
      glow.material.opacity = 0.8 + Math.sin(time * 2) * 0.2;
      grid.position.z = (time * 1.4 * speed) % 1;
      stars.rotation.y += dt * 0.01;
      for (var i2 = 0; i2 < sats.length; i2++) {
        var d = sats[i2].userData; d.ang += dt * d.spd * speed * 0.4;
        sats[i2].position.set(Math.cos(d.ang) * d.rad, Math.sin(d.ang * 1.3) * 0.7 + d.tilt, Math.sin(d.ang) * d.rad);
        sats[i2].rotation.x += dt; sats[i2].rotation.y += dt * 1.3;
      }
      for (var i3 = 0; i3 < thoughts.length; i3++) updateThought(thoughts[i3], dt * speed);
      camera.position.x += ((mx * 0.6) - camera.position.x) * 0.04;
      camera.position.y = 0.4 + (-my * 0.3) + scrollT * 2.2;
      camera.position.z = 9 + scrollT * 5;
      camera.lookAt(wide ? 1.2 : 0, scrollT * 0.8, 0);
      renderer.render(scene, camera);
      if (!reduce) s.raf = requestAnimationFrame(frame);
    }
    if (reduce) { grown = L; frame(performance.now()); } else s.raf = requestAnimationFrame(frame);
  }
  _tl(list) {
    var tags = ['CORE', 'VOICE', 'VISION', 'MEMORY', 'FEED', 'SOURCES', 'WEATHER', 'CONTROL', 'VOICE'];
    return list.map(function (f, i) {
      var left = i % 2 === 0;
      return Object.assign({}, f, {
        tag: tags[i] || 'LIVE',
        dir: left ? 'row' : 'row-reverse',
        tilt: left ? 'rotateY(14deg)' : 'rotateY(-14deg)',
        origin: left ? 'right center' : 'left center'
      });
    });
  }
  _pickBot(i) {
    this._botPause = Date.now() + 15000;
    this.setState({ bot: ((i % 5) + 5) % 5 });
  }
  _botData() {
    if (this._bd) return this._bd;
    this._bd = [
      { name: 'Sentinel', cat: 'QUADRUPED', col: '#22F2E1', body: 'Four legs for ground wheels can’t handle. Jessi reads the terrain, plans the route and keeps it on task.' },
      { name: 'Vertex', cat: 'HUMANOID', col: '#9B7BFF', body: 'Human form for human spaces. Jessi turns instructions into movement, step by step.' },
      { name: 'Titan', cat: 'INDUSTRIAL BIPED', col: '#FFB547', body: 'Heavy-duty bipedal muscle for industrial work, with Jessi coordinating every move.' },
      { name: 'Rover', cat: 'WHEELED', col: '#7CFF6B', body: 'Fast, efficient wheeled platform. Jessi maps, navigates and reports back.' },
      { name: 'Falcon', cat: 'AERIAL', col: '#FF3DCB', body: 'Eyes in the sky. Jessi flies the mission and makes sense of what it sees.' }
    ];
    return this._bd;
  }
  _bootHangar() {
    if (this._h) return;
    if (!window.THREE || !this.hangarCanvas) {
      if (this._htries++ < 100) this._hretry = setTimeout(() => this._bootHangar(), 100);
      return;
    }
    try { this._setupHangar(); } catch (e) { this._h = null; }
  }
  _setupHangar() {
    var THREE = window.THREE, c = this.hangarCanvas, self = this, data = this._botData(), ADD = THREE.AdditiveBlending;
    var renderer = new THREE.WebGLRenderer({ canvas: c, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x04050B, 1);
    var scene = new THREE.Scene(); scene.fog = new THREE.Fog(0x04050B, 12, 34);
    var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200); camera.position.set(0, 3.4, 13);

    var gc = document.createElement('canvas'); gc.width = gc.height = 128;
    var g2 = gc.getContext('2d'), gr = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,.4)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g2.fillStyle = gr; g2.fillRect(0, 0, 128, 128);
    var glowTex = new THREE.CanvasTexture(gc);
    function glowSprite(col, sc) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color(col), transparent: true, depthWrite: false, blending: ADD })); sp.scale.set(sc, sc, 1); return sp; }
    function labelSprite(text, col) {
      var cv = document.createElement('canvas'); cv.width = 512; cv.height = 96;
      var x = cv.getContext('2d'); x.font = '700 42px "JetBrains Mono", monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.shadowColor = col; x.shadowBlur = 18; x.fillStyle = '#EAF2FF'; x.fillText(text, 256, 48);
      var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false })); sp.scale.set(2.4, 0.45, 1); return sp;
    }

    // floor + back wall grid
    var floor = new THREE.GridHelper(60, 60, 0x8B5CFF, 0x8B5CFF); floor.material.transparent = true; floor.material.opacity = 0.28; floor.material.depthWrite = false; scene.add(floor);
    var wall = new THREE.GridHelper(60, 30, 0x22F2E1, 0x22F2E1); wall.rotation.x = Math.PI / 2; wall.position.set(0, 0, -9); wall.material.transparent = true; wall.material.opacity = 0.08; wall.material.depthWrite = false; scene.add(wall);

    var darkMat = new THREE.MeshBasicMaterial({ color: 0x0B1220, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    function part(geo, x, y, z, lm, parent) {
      var m = new THREE.Mesh(geo, darkMat); m.position.set(x, y, z);
      m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), lm)); parent.add(m); return m;
    }
    function box(w, h, d) { return new THREE.BoxGeometry(w, h, d); }
    function cyl(rt, rb, h, seg) { return new THREE.CylinderGeometry(rt, rb, h, seg || 12); }

    var anim = [];
    function buildSentinel(lm, g) {
      part(box(1.7, 0.42, 0.72), 0, 1.05, 0, lm, g);
      part(box(0.48, 0.32, 0.5), 1.0, 1.2, 0, lm, g);
      part(box(0.1, 0.1, 0.42), 1.27, 1.22, 0, lm, g);
      var legs = [];
      [[0.62, 0.3], [0.62, -0.3], [-0.62, 0.3], [-0.62, -0.3]].forEach(function (q, i) {
        var hip = new THREE.Group(); hip.position.set(q[0], 0.92, q[1]); g.add(hip);
        part(box(0.15, 0.5, 0.15), 0, -0.25, 0, lm, hip);
        var knee = new THREE.Group(); knee.position.y = -0.5; hip.add(knee);
        part(box(0.12, 0.48, 0.12), 0, -0.22, 0, lm, knee);
        legs.push({ hip: hip, knee: knee, ph: (i === 0 || i === 3) ? 0 : Math.PI });
      });
      anim.push(function (t, on) { legs.forEach(function (l) { var a = on ? Math.sin(t * 5 + l.ph) * 0.35 : 0; l.hip.rotation.z += (a - l.hip.rotation.z) * 0.2; l.knee.rotation.z += ((on ? -Math.abs(a) * 0.9 : 0) - l.knee.rotation.z) * 0.2; }); });
    }
    function buildVertex(lm, g) {
      part(box(0.62, 0.85, 0.36), 0, 1.75, 0, lm, g);
      part(box(0.5, 0.3, 0.32), 0, 1.2, 0, lm, g);
      part(box(0.34, 0.4, 0.34), 0, 2.45, 0, lm, g);
      part(box(0.28, 0.08, 0.05), 0, 2.48, 0.18, lm, g);
      var arms = [];
      [-1, 1].forEach(function (sd) {
        var sh = new THREE.Group(); sh.position.set(sd * 0.43, 2.1, 0); g.add(sh);
        part(box(0.15, 0.5, 0.15), 0, -0.25, 0, lm, sh);
        part(box(0.13, 0.48, 0.13), 0, -0.75, 0, lm, sh);
        arms.push({ sh: sh, sd: sd });
        part(box(0.2, 0.55, 0.2), sd * 0.16, 0.78, 0, lm, g);
        part(box(0.17, 0.52, 0.17), sd * 0.16, 0.27, 0, lm, g);
      });
      anim.push(function (t, on) { arms.forEach(function (a) { var tg = on ? Math.sin(t * 2.5 + (a.sd > 0 ? 0 : Math.PI)) * 0.5 : 0; a.sh.rotation.x += (tg - a.sh.rotation.x) * 0.1; }); });
    }
    function buildTitan(lm, g) {
      part(box(1.25, 1.1, 0.85), 0, 2.15, 0, lm, g);
      part(box(0.9, 0.4, 0.7), 0, 1.4, 0, lm, g);
      part(box(0.42, 0.34, 0.42), 0, 2.9, 0.05, lm, g);
      var arms = [];
      [-1, 1].forEach(function (sd) {
        part(cyl(0.28, 0.28, 0.3, 10), sd * 0.82, 2.45, 0, lm, g).rotation.z = Math.PI / 2;
        var sh = new THREE.Group(); sh.position.set(sd * 0.95, 2.4, 0); g.add(sh);
        part(box(0.3, 0.75, 0.3), 0, -0.4, 0, lm, sh);
        part(box(0.36, 0.6, 0.36), 0, -1.05, 0, lm, sh);
        part(box(0.42, 0.18, 0.3), 0, -1.45, 0, lm, sh);
        arms.push({ sh: sh, sd: sd });
        part(box(0.36, 0.7, 0.4), sd * 0.28, 0.9, 0, lm, g);
        part(box(0.32, 0.6, 0.36), sd * 0.28, 0.32, 0.02, lm, g);
        part(box(0.42, 0.12, 0.6), sd * 0.28, 0.06, 0.08, lm, g);
      });
      anim.push(function (t, on) { arms.forEach(function (a) { var tg = on ? -0.4 + Math.sin(t * 1.6) * 0.25 : 0; a.sh.rotation.x += (tg - a.sh.rotation.x) * 0.08; }); });
    }
    function buildRover(lm, g) {
      part(box(1.6, 0.36, 1.0), 0, 0.6, 0, lm, g);
      part(box(0.9, 0.25, 0.7), -0.1, 0.9, 0, lm, g);
      part(cyl(0.05, 0.05, 0.6, 6), 0.45, 1.2, 0, lm, g);
      var lidar = part(cyl(0.16, 0.16, 0.14, 12), 0.45, 1.55, 0, lm, g);
      var wheels = [];
      [[0.55, 0.55], [0.55, -0.55], [-0.55, 0.55], [-0.55, -0.55]].forEach(function (q) {
        var w = part(cyl(0.3, 0.3, 0.2, 14), q[0], 0.3, q[1], lm, g); w.rotation.x = Math.PI / 2; wheels.push(w);
      });
      anim.push(function (t, on, dt) { lidar.rotation.y += dt * (on ? 6 : 1.5); wheels.forEach(function (w) { w.rotation.y += dt * (on ? 4 : 0); }); });
    }
    function buildFalcon(lm, g) {
      var body = new THREE.Group(); body.position.y = 1.9; g.add(body);
      part(box(0.55, 0.16, 0.55), 0, 0, 0, lm, body);
      part(box(0.2, 0.12, 0.2), 0, -0.13, 0.15, lm, body);
      var rotors = [];
      [[0.55, 0.55], [0.55, -0.55], [-0.55, 0.55], [-0.55, -0.55]].forEach(function (q) {
        var arm = part(box(0.75, 0.05, 0.08), q[0] / 2, 0, q[1] / 2, lm, body); arm.rotation.y = Math.atan2(-q[1], q[0]);
        var r = part(cyl(0.32, 0.32, 0.02, 16), q[0], 0.08, q[1], lm, body); rotors.push(r);
      });
      var cage = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.15, 1)), lm); body.add(cage);
      anim.push(function (t, on, dt) { rotors.forEach(function (r) { r.rotation.y += dt * 25; }); body.position.y = 1.9 + Math.sin(t * 2) * (on ? 0.25 : 0.1); cage.rotation.y += dt * 0.3; });
    }
    var builders = [buildSentinel, buildVertex, buildTitan, buildRover, buildFalcon];
    var spots = [[-6.4, -1.4], [-3.3, 0.3], [0, 1.0], [3.3, 0.3], [6.4, -1.4]];
    var tops = [1.7, 3.0, 3.4, 2.0, 3.2];

    var bots = data.map(function (d, i) {
      var col = new THREE.Color(d.col);
      var lm = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.9, depthWrite: false, blending: ADD });
      var base = new THREE.Group(); base.position.set(spots[i][0], 0, spots[i][1]); scene.add(base);
      var pad = part(cyl(1.25, 1.35, 0.14, 32), 0, 0.07, 0, lm, base);
      var ringMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false, blending: ADD });
      var ring = new THREE.Mesh(new THREE.RingGeometry(1.45, 1.6, 64), ringMat); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.02; base.add(ring);
      var floorGlow = glowSprite(d.col, 4.5); floorGlow.position.y = 0.2; floorGlow.material.opacity = 0.25; base.add(floorGlow);
      var body = new THREE.Group(); body.position.y = 0.14; base.add(body);
      builders[i](lm, body);
      var label = labelSprite(d.name.toUpperCase(), d.col); label.position.y = tops[i] + 0.7; base.add(label);
      return { base: base, body: body, lm: lm, ringMat: ringMat, floorGlow: floorGlow, label: label, top: new THREE.Vector3(spots[i][0], tops[i], spots[i][1]), col: col, ring: ring };
    });

    // Jessi core above the fleet
    var core = new THREE.Group(); core.position.set(0, 5.6, -2.2); scene.add(core);
    var coreWire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.8, 1)), new THREE.LineBasicMaterial({ color: 0x22F2E1, transparent: true, opacity: 0.9, depthWrite: false, blending: ADD }));
    var coreIn = new THREE.Mesh(new THREE.IcosahedronGeometry(0.36, 1), new THREE.MeshBasicMaterial({ color: 0xFF3DCB, wireframe: true }));
    var coreGlow = glowSprite('#22F2E1', 4.2);
    var coreLabel = labelSprite('JESSI', '#22F2E1'); coreLabel.position.y = 1.25; coreLabel.scale.set(2, 0.38, 1);
    core.add(coreWire, coreIn, coreGlow, coreLabel);
    var links = bots.map(function (b) {
      var line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([core.position.clone(), b.top.clone()]), new THREE.LineBasicMaterial({ color: b.col, transparent: true, opacity: 0.15, depthWrite: false, blending: ADD }));
      scene.add(line);
      var pulse = glowSprite('#FFFFFF', 0.5); pulse.material.color.copy(b.col); scene.add(pulse);
      return { line: line, pulse: pulse, t: Math.random() };
    });

    var st = { active: (self.state && self.state.bot) || 0 };
    var wide = true;
    function resize() {
      var wd = c.clientWidth || 1, ht = c.clientHeight || 1;
      renderer.setSize(wd, ht, false); camera.aspect = wd / ht; camera.updateProjectionMatrix();
      wide = wd > 900;
    }
    resize();
    var ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null; if (ro) ro.observe(c);
    var mx = 0;
    var onMove = function (e) { var rc = c.getBoundingClientRect(); mx = ((e.clientX - rc.left) / rc.width) * 2 - 1; };
    c.addEventListener('pointermove', onMove);

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, idle = reduce ? 0 : 1;
    var h = { renderer: renderer, ro: ro, raf: 0, visible: true, c: c, onMove: onMove };
    h.setActive = function (i) { st.active = i; };
    this._h = h;

    var look = new THREE.Vector3(0, 1.6, 0), camT = new THREE.Vector3(), lookT = new THREE.Vector3(), last = performance.now(), time = 0;
    function frame(now) {
      if (!h.visible) { h.raf = 0; return; }
      var dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt;
      var ab = bots[st.active], ax = ab.base.position.x, az = ab.base.position.z;
      if (wide) { camT.set(ax * 0.55 + mx * 0.8, 3.4, az + 11.5); lookT.set(ax * 0.85, 1.7, az); }
      else { camT.set(ax, 3.6, az + 13 / Math.max(camera.aspect, 0.45) * 0.55); lookT.set(ax, 1.9, az); }
      camera.position.lerp(camT, 0.04); look.lerp(lookT, 0.06); camera.lookAt(look);
      for (var i = 0; i < bots.length; i++) {
        var b = bots[i], on = i === st.active;
        b.lm.opacity += ((on ? 1 : 0.32) - b.lm.opacity) * 0.08;
        b.ringMat.opacity += ((on ? 0.95 : 0.25) - b.ringMat.opacity) * 0.08;
        b.floorGlow.material.opacity += ((on ? 0.7 : 0.15) - b.floorGlow.material.opacity) * 0.08;
        b.label.material.opacity += ((on ? 1 : 0.45) - b.label.material.opacity) * 0.08;
        b.body.rotation.y += dt * (on ? 0.6 : 0.15) * (idle || (on ? 1 : 0));
        var rs = b.ring.scale.x + ((on ? 1 + Math.sin(time * 3) * 0.04 : 1) - b.ring.scale.x) * 0.2; b.ring.scale.set(rs, rs, rs);
        anim[i](time, on, dt);
        var L = links[i];
        L.line.material.opacity += ((on ? 0.9 : 0.12) - L.line.material.opacity) * 0.08;
        L.t += dt * (on ? 0.9 : 0.35); if (L.t > 1) L.t -= 1;
        L.pulse.position.lerpVectors(core.position, b.top, L.t);
        L.pulse.material.opacity = Math.sin(Math.PI * L.t) * (on ? 1 : 0.4);
      }
      coreWire.rotation.y += dt * 0.5; coreIn.rotation.x -= dt * 0.9;
      coreGlow.material.color.lerp(ab.col, 0.06);
      core.position.y = 5.6 + Math.sin(time * 1.3) * 0.15 * idle;
      renderer.render(scene, camera);
      h.raf = requestAnimationFrame(frame);
    }
    var io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(function (es) {
      h.visible = es[0].isIntersecting;
      if (h.visible && !h.raf) { last = performance.now(); h.raf = requestAnimationFrame(frame); }
    }) : null;
    if (io) io.observe(c);
    h.io = io;
    h.raf = requestAnimationFrame(frame);
  }
  _bootGlass() {
    if (this._g) return;
    if (!window.THREE || !this.glassCanvas) {
      if (this._gtries++ < 100) this._gretry = setTimeout(() => this._bootGlass(), 100);
      return;
    }
    try { this._setupGlass(); } catch (e) { this._g = null; }
  }
  _setupGlass() {
    var THREE = window.THREE, c = this.glassCanvas, ADD = THREE.AdditiveBlending;
    var renderer = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x04050B, 0);
    var scene = new THREE.Scene(); scene.fog = new THREE.Fog(0x04050B, 12, 32);
    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200); camera.position.set(0.6, 1.4, 11);
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    var dl = new THREE.DirectionalLight(0xffffff, 1.1); dl.position.set(3, 5, 6); scene.add(dl);
    var pc = new THREE.PointLight(0x22F2E1, 40, 30); pc.position.set(-3, 2, 5); scene.add(pc);
    var pm = new THREE.PointLight(0xFF3DCB, 30, 30); pm.position.set(6, -1, 4); scene.add(pm);

    var gc = document.createElement('canvas'); gc.width = gc.height = 128;
    var g2 = gc.getContext('2d'), gr = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,.4)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g2.fillStyle = gr; g2.fillRect(0, 0, 128, 128);
    var glowTex = new THREE.CanvasTexture(gc);
    function glowSprite(col, sc) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color(col), transparent: true, depthWrite: false, blending: ADD })); sp.scale.set(sc, sc, 1); return sp; }
    function labelSprite(text, col, w) {
      var cv = document.createElement('canvas'); cv.width = 768; cv.height = 96;
      var x = cv.getContext('2d'); x.font = '700 40px "JetBrains Mono", monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.shadowColor = col; x.shadowBlur = 18; x.fillStyle = col; x.fillText(text, 384, 48);
      var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false })); sp.scale.set(w || 3.6, (w || 3.6) / 8, 1); return sp;
    }

    var root = new THREE.Group(); scene.add(root);

    // dust + floor
    var DN = 1200, dp = new Float32Array(DN * 3);
    for (var i = 0; i < DN; i++) { dp[i*3] = (Math.random() - 0.5) * 40; dp[i*3+1] = Math.random() * 16 - 6; dp[i*3+2] = Math.random() * -26 + 6; }
    var dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
    var dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0x9DB4FF, size: 0.05, transparent: true, opacity: 0.55, depthWrite: false }));
    scene.add(dust);
    var floor = new THREE.GridHelper(50, 50, 0x8B5CFF, 0x8B5CFF); floor.material.transparent = true; floor.material.opacity = 0.22; floor.material.depthWrite = false; floor.position.y = -3.2; root.add(floor);

    // ---- glasses ----
    function rr(w, h, r) {
      var sh = new THREE.Shape(), x = -w / 2, y = -h / 2;
      sh.moveTo(x + r, y); sh.lineTo(x + w - r, y); sh.quadraticCurveTo(x + w, y, x + w, y + r);
      sh.lineTo(x + w, y + h - r); sh.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      sh.lineTo(x + r, y + h); sh.quadraticCurveTo(x, y + h, x, y + h - r);
      sh.lineTo(x, y + r); sh.quadraticCurveTo(x, y, x + r, y); return sh;
    }
    var specs = new THREE.Group(); root.add(specs);
    var frameMat = new THREE.MeshStandardMaterial({ color: 0x0D1220, metalness: 0.85, roughness: 0.28 });
    var edgeMat = new THREE.LineBasicMaterial({ color: 0x22F2E1, transparent: true, opacity: 0.75, depthWrite: false, blending: ADD });
    var lensMat = new THREE.MeshStandardMaterial({ color: 0x0B1A2A, metalness: 0.3, roughness: 0.05, transparent: true, opacity: 0.6, emissive: 0x22F2E1, emissiveIntensity: 0.05, side: THREE.DoubleSide });
    [-1.12, 1.12].forEach(function (lx) {
      var outer = rr(2.0, 1.36, 0.56); outer.holes.push(rr(1.72, 1.08, 0.42));
      var fg = new THREE.ExtrudeGeometry(outer, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3, curveSegments: 28 });
      fg.center();
      var fm = new THREE.Mesh(fg, frameMat); fm.position.x = lx; specs.add(fm);
      var fe = new THREE.LineSegments(new THREE.EdgesGeometry(fg, 35), edgeMat); fe.position.x = lx; specs.add(fe);
      var lens = new THREE.Mesh(new THREE.ShapeGeometry(rr(1.74, 1.1, 0.43), 24), lensMat); lens.position.set(lx, 0, 0); specs.add(lens);
      var glint = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.7), new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.25, depthWrite: false, blending: ADD }));
      glint.position.set(lx - 0.35, 0.05, 0.02); glint.rotation.z = -0.6; specs.add(glint);
    });
    var brow = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.16, 0.2), frameMat); brow.position.y = 0.62; specs.add(brow);
    var browEdge = new THREE.LineSegments(new THREE.EdgesGeometry(brow.geometry), edgeMat); browEdge.position.copy(brow.position); specs.add(browEdge);
    var bridge = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.14, 0.24, 0), new THREE.Vector3(0, 0.46, 0), new THREE.Vector3(0.14, 0.24, 0)), 16, 0.055, 8), frameMat);
    specs.add(bridge);
    var ears = [];
    [-1, 1].forEach(function (sd) {
      var arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 3.4), frameMat); arm.position.set(sd * 2.2, 0.5, -1.72); specs.add(arm);
      var ae = new THREE.LineSegments(new THREE.EdgesGeometry(arm.geometry), edgeMat); ae.position.copy(arm.position); specs.add(ae);
      var hook = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.14), frameMat); hook.position.set(sd * 2.2, 0.25, -3.42); hook.rotation.x = 0.4; specs.add(hook);
      var spk = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.5), new THREE.MeshBasicMaterial({ color: 0xFFB547 })); spk.position.set(sd * 2.24, 0.48, -2.3); specs.add(spk);
      var sg = glowSprite('#FFB547', 0.9); sg.position.copy(spk.position); specs.add(sg);
      ears.push(spk);
    });
    var camLens = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 20), new THREE.MeshBasicMaterial({ color: 0x22F2E1 }));
    camLens.rotation.x = Math.PI / 2; camLens.position.set(-1.98, 0.62, 0.14); specs.add(camLens);
    var camGlow = glowSprite('#22F2E1', 1.1); camGlow.position.copy(camLens.position); specs.add(camGlow);
    var led = glowSprite('#FF3DCB', 0.6); led.position.set(1.98, 0.62, 0.14); specs.add(led);
    var specLabel = labelSprite('JESSI · LISTENING', '#22F2E1', 3.2); specLabel.position.set(0, 1.45, 0); specs.add(specLabel);

    // ---- target object being scanned ----
    var target = new THREE.Group(); target.position.set(1.5, -0.4, 2.8); root.add(target);
    var tA = new THREE.LineBasicMaterial({ color: 0xFFB547, transparent: true, opacity: 0.85, depthWrite: false, blending: ADD });
    var tB = new THREE.LineBasicMaterial({ color: 0x22F2E1, transparent: true, opacity: 0.7, depthWrite: false, blending: ADD });
    var part = new THREE.Group(); target.add(part);
    part.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.TorusGeometry(0.95, 0.2, 10, 40), 20), tA));
    part.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.TorusGeometry(0.5, 0.12, 8, 32), 20), tB));
    for (var bi = 0; bi < 10; bi++) { var ba = bi / 10 * Math.PI * 2; var ball = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.11, 0)), tB); ball.position.set(Math.cos(ba) * 0.73, Math.sin(ba) * 0.73, 0); part.add(ball); }
    var bracket = new THREE.Group(); target.add(bracket);
    var bm = new THREE.LineBasicMaterial({ color: 0x22F2E1, transparent: true, opacity: 0.95, depthWrite: false, blending: ADD });
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {
      var x0 = q[0] * 1.45, y0 = q[1] * 1.45;
      bracket.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x0 - q[0] * 0.45, y0, 0), new THREE.Vector3(x0, y0, 0), new THREE.Vector3(x0, y0 - q[1] * 0.45, 0)]), bm));
    });
    var scanBar = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 0.05), new THREE.MeshBasicMaterial({ color: 0x22F2E1, transparent: true, opacity: 0.9, depthWrite: false, blending: ADD })); bracket.add(scanBar);
    var lblScan = labelSprite('SCANNING…', '#22F2E1', 2.8); lblScan.position.set(0, 1.95, 0); bracket.add(lblScan);
    var lblHit = labelSprite('PART IDENTIFIED', '#FFB547', 3.0); lblHit.position.set(0, 1.95, 0); bracket.add(lblHit);

    // ---- vision cone ----
    var coneH = 1;
    var coneGeo = new THREE.ConeGeometry(1.5, coneH, 40, 1, true); coneGeo.translate(0, -coneH / 2, 0);
    var cone = new THREE.Mesh(coneGeo, new THREE.MeshBasicMaterial({ color: 0x22F2E1, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false, blending: ADD }));
    var coneWire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.ConeGeometry(1.5, coneH, 12, 1, true).translate(0, -coneH / 2, 0)), new THREE.LineBasicMaterial({ color: 0x22F2E1, transparent: true, opacity: 0.18, depthWrite: false, blending: ADD }));
    root.add(cone); root.add(coneWire);

    // ---- phone (on-device brain) ----
    var phone = new THREE.Group(); phone.position.set(1.4, -2.7, -0.6); phone.rotation.set(-0.25, -0.35, 0.06); root.add(phone);
    var pmat = new THREE.LineBasicMaterial({ color: 0x8B5CFF, transparent: true, opacity: 0.9, depthWrite: false, blending: ADD });
    phone.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.1, 2.1, 0.12)), pmat));
    var screen = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 1.9), new THREE.MeshBasicMaterial({ color: 0x8B5CFF, transparent: true, opacity: 0.18, depthWrite: false, blending: ADD })); screen.position.z = 0.07; phone.add(screen);
    var pcore = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.3, 1)), new THREE.LineBasicMaterial({ color: 0x22F2E1, transparent: true, opacity: 0.95, depthWrite: false, blending: ADD })); pcore.position.z = 0.1; phone.add(pcore);
    var pglow = glowSprite('#8B5CFF', 3); phone.add(pglow);
    var phoneLabel = labelSprite('JESSI · ON-DEVICE', '#B79CFF', 3.0); phoneLabel.position.set(0, 1.45, 0); phone.add(phoneLabel);

    // ---- data streams ----
    function stream(col, n) {
      var arr = new Float32Array(n * 3), g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
      var pts = new THREE.Points(g, new THREE.PointsMaterial({ color: new THREE.Color(col), size: 0.11, transparent: true, opacity: 0.95, depthWrite: false, blending: ADD }));
      root.add(pts); var offs = []; for (var k = 0; k < n; k++) offs.push(k / n);
      return { pts: pts, arr: arr, offs: offs, n: n };
    }
    var up = stream('#22F2E1', 36), down = stream('#FFB547', 36);

    // ---- sound rings ----
    var rings = [];
    ears.forEach(function (ear, ei) {
      for (var r = 0; r < 3; r++) {
        var rm = new THREE.Mesh(new THREE.RingGeometry(0.22, 0.26, 48), new THREE.MeshBasicMaterial({ color: 0xFFB547, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: ADD }));
        rm.rotation.y = Math.PI / 2; ear.add(rm); rings.push({ m: rm, t: r / 3 });
      }
    });

    var wide = true;
    function resize() {
      var wd = c.clientWidth || 1, ht = c.clientHeight || 1;
      renderer.setSize(wd, ht, false); camera.aspect = wd / ht; camera.updateProjectionMatrix();
      wide = wd > 900;
      if (wide) { root.position.set(4.3, 0.4, 0); root.scale.setScalar(0.82); camera.position.z = 11; }
      else { root.position.set(-0.4, -3.4, 0); root.scale.setScalar(0.72); camera.position.z = 15; }
    }
    resize();
    var ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null; if (ro) ro.observe(c);
    var host = c.parentNode, mx = 0, my = 0;
    var onMove = function (e) { var rc = c.getBoundingClientRect(); mx = ((e.clientX - rc.left) / rc.width) * 2 - 1; my = ((e.clientY - rc.top) / rc.height) * 2 - 1; };
    if (host) host.addEventListener('pointermove', onMove);

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, idle = reduce ? 0 : 1;
    var gS = { renderer: renderer, ro: ro, raf: 0, visible: true, host: host, onMove: onMove };
    this._g = gS;

    var vCam = new THREE.Vector3(), vT = new THREE.Vector3(), vP = new THREE.Vector3(), vE = new THREE.Vector3(), dir = new THREE.Vector3(), Y = new THREE.Vector3(0, -1, 0);
    var cU = new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());
    var cD = new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());
    var tmp = new THREE.Vector3(), last = performance.now(), time = 0;
    function toRoot(obj, out) { obj.getWorldPosition(out); return root.worldToLocal(out); }
    function frame(now) {
      if (!gS.visible) { gS.raf = 0; return; }
      var dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt;
      specs.position.set(-1.4, 0.7 + Math.sin(time * 1.2) * 0.15 * idle, 0);
      specs.rotation.set(0.12 + my * 0.08 + Math.sin(time * 0.7) * 0.04 * idle, 0.55 + mx * 0.25 + Math.sin(time * 0.4) * 0.12 * idle, Math.sin(time * 0.9) * 0.03 * idle);
      root.updateMatrixWorld(true);
      toRoot(camLens, vCam); vT.copy(target.position);
      dir.subVectors(vT, vCam); var dist = dir.length(); dir.normalize();
      cone.position.copy(vCam); coneWire.position.copy(vCam);
      cone.quaternion.setFromUnitVectors(Y, dir); coneWire.quaternion.copy(cone.quaternion);
      cone.scale.set(1, dist, 1); coneWire.scale.set(1, dist, 1);
      cone.material.opacity = 0.06 + Math.sin(time * 3) * 0.02;

      part.rotation.y += dt * 0.6; part.rotation.x = 0.5 + Math.sin(time * 0.5) * 0.2;
      bracket.lookAt(camera.position);
      var ph = (time % 4) / 4, scanning = ph < 0.6;
      scanBar.position.y = scanning ? Math.sin(ph / 0.6 * Math.PI * 2) * 1.3 : 0;
      scanBar.material.opacity = scanning ? 0.9 : 0;
      lblScan.material.opacity = scanning ? 1 : 0; lblHit.material.opacity = scanning ? 0 : 1;
      bm.color.set(scanning ? 0x22F2E1 : 0xFFB547);
      var bs = scanning ? 1 : 1 + Math.sin((ph - 0.6) / 0.4 * Math.PI) * 0.08; bracket.scale.set(bs, bs, bs);

      toRoot(phone, vP); toRoot(ears[0], vE);
      cU.v0.copy(vCam); cU.v2.copy(vP); cU.v1.copy(vCam).add(vP).multiplyScalar(0.5); cU.v1.y += 1.6;
      cD.v0.copy(vP); cD.v2.copy(vE); cD.v1.copy(vP).add(vE).multiplyScalar(0.5); cD.v1.y -= 1.2;
      [[up, cU, 0.45], [down, cD, 0.55]].forEach(function (sx) {
        var st = sx[0], cv = sx[1];
        for (var k = 0; k < st.n; k++) {
          var t = (st.offs[k] + time * sx[2]) % 1; cv.getPoint(t, tmp);
          st.arr[k*3] = tmp.x; st.arr[k*3+1] = tmp.y; st.arr[k*3+2] = tmp.z;
        }
        st.pts.geometry.attributes.position.needsUpdate = true;
      });
      pcore.rotation.y += dt * 1.2; pcore.rotation.x += dt * 0.5;
      pglow.material.opacity = 0.6 + Math.sin(time * 2.4) * 0.25;
      phone.position.y = -2.7 + Math.sin(time * 1.1 + 1) * 0.12 * idle;

      for (var ri = 0; ri < rings.length; ri++) {
        var rg = rings[ri]; rg.t += dt * 0.7; if (rg.t > 1) rg.t -= 1;
        var sc = 1 + rg.t * 4; rg.m.scale.set(sc, sc, sc); rg.m.material.opacity = (1 - rg.t) * 0.7;
      }
      camGlow.material.opacity = 0.7 + Math.sin(time * 6) * 0.3;
      led.material.opacity = Math.sin(time * 4) > 0 ? 1 : 0.2;
      dust.rotation.y += dt * 0.01 * idle;
      camera.position.x += ((0.6 + mx * 0.7) - camera.position.x) * 0.04;
      camera.position.y += ((1.4 - my * 0.5) - camera.position.y) * 0.04;
      camera.lookAt(root.position.x * 0.55, root.position.y * 0.6, 0);
      renderer.render(scene, camera);
      gS.raf = requestAnimationFrame(frame);
    }
    var io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(function (es) {
      gS.visible = es[0].isIntersecting;
      if (gS.visible && !gS.raf) { last = performance.now(); gS.raf = requestAnimationFrame(frame); }
    }) : null;
    if (io) io.observe(c);
    gS.io = io;
    gS.raf = requestAnimationFrame(frame);
  }
  renderVals() {
    if (!this._setCanvas) this._setCanvas = (el) => { this.canvas = el; if (el && !this._s && this._tries !== undefined) this._boot(); };
    if (!this._setSkillCanvas) this._setSkillCanvas = (el) => { this.skillCanvas = el; if (el && !this._k && this._ktries !== undefined) this._bootSkills(); };
    var acc = this.props.accent ?? '#22F2E1';
    var self = this, active = (this.state && this.state.active) || 0;
    var skills = this._skillData().map(function (d, i) {
      var on = i === active;
      return Object.assign({}, d, {
        num: '0' + (i + 1), upper: d.name.toUpperCase(), glow: d.col + '55',
        pick: function () { self._pickSkill(i); },
        pressed: on ? 'true' : 'false',
        bg: on ? d.col : 'rgba(5,7,13,.8)', fg: on ? '#05070D' : '#EAF2FF', bd: on ? d.col : '#262E40',
        sh: on ? '0 0 28px ' + d.col + '88' : 'none'
      });
    });
    if (!this._setHangarCanvas) this._setHangarCanvas = (el) => { this.hangarCanvas = el; if (el && !this._h && this._htries !== undefined) this._bootHangar(); };
    var botIdx = (this.state && this.state.bot) || 0;
    var bots = this._botData().map(function (d, i) {
      var on = i === botIdx;
      return Object.assign({}, d, {
        num: '0' + (i + 1), upper: d.name.toUpperCase(), glow: d.col + '55',
        pick: function () { self._pickBot(i); }, pressed: on ? 'true' : 'false',
        bg: on ? d.col : 'rgba(5,7,13,.82)', fg: on ? '#05070D' : '#EAF2FF', bd: on ? d.col : '#262E40',
        sh: on ? '0 0 28px ' + d.col + '88' : 'none'
      });
    });
    if (!this._setGlassCanvas) this._setGlassCanvas = (el) => { this.glassCanvas = el; if (el && !this._g && this._gtries !== undefined) this._bootGlass(); };
    return {
      setCanvas: this._setCanvas,
      setGlassCanvas: this._setGlassCanvas,
      setHangarCanvas: this._setHangarCanvas,
      bots: bots,
      bot: bots[botIdx],
      setSkillCanvas: this._setSkillCanvas,
      skills: skills,
      act: skills[active],
      prev: function () { self._pickSkill(active - 1); },
      next: function () { self._pickSkill(active + 1); },
      accent: acc,
      wave: [10,18,26,14,30,22,34,16,28,36,20,32,24,12,26,34,18,28,14,22,10].map(function (h, i) { return { h: h + 'px', d: (i * 0.07).toFixed(2) + 's' }; }),
      dataMap: [
        { k: 'chat + voice', v: 'ON_DEVICE', c: acc },
        { k: 'conversation history', v: 'LOCAL', c: acc },
        { k: 'what she learns', v: 'LOCAL', c: acc },
        { k: 'your data', v: 'ON_DEVICE', c: acc },
        { k: 'vault (form details)', v: 'LOCKED_LOCAL', c: '#B79CFF' },
        { k: 'personal data in training', v: 'NEVER', c: '#FF3DCB' },
        { k: 'cloud connection', v: 'ROUTING_ONLY', c: '#B79CFF' },
        { k: 'cloud storage of your data', v: 'NONE', c: '#FF3DCB' },
        { k: 'news / weather / sources', v: 'ONLINE', c: '#FFB547' }
      ],
      assist: [
        { title: 'Talk it out', tag: 'LIVE', tagColor: acc, icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM9 10h.01M12 10h.01M15 10h.01', body: 'Vent, wonder, celebrate or just think out loud. She listens first, then helps you sort it through.', ask: '"I had a rough talk with my son today. Can we talk?"' },
        { title: 'Think it through', tag: 'LIVE', tagColor: acc, icon: 'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z', body: 'Big decisions and small ones. Plan a trip, weigh a choice, draft the message you keep putting off.', ask: '"Help me plan Mom’s 70th without blowing the budget."' },
        { title: 'Call Jessi', tag: 'LIVE', tagColor: acc, icon: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z', body: 'Call her like you would a friend. Speak naturally on a drive or a walk and hear her answer in her own on-device voice.', ask: '"Walk me through resetting this breaker panel."' },
        { title: 'See what you see', tag: 'LIVE', tagColor: acc, icon: 'M3 7h4l2-3h6l2 3h4v13H3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', body: 'Snap a plant, a recipe, a label, a part or a whiteboard and ask about it. No describing required.', ask: '"Why are my tomato leaves turning yellow?"' },
        { title: 'Keep the thread', tag: 'LIVE', tagColor: acc, icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8 9h8M8 13h5', body: 'Pick up any conversation right where you left it. Sessions keep projects organized and context intact.', ask: '"Back to the garden plan from Tuesday."' },
        { title: 'Brief you on your day', tag: 'LIVE', tagColor: acc, icon: 'M17.5 19H8a5 5 0 1 1 1-9.9A6 6 0 0 1 20.5 12a3.5 3.5 0 0 1-3 7z', body: 'News that matters to you with sources attached, plus National Weather Service conditions for where you live and work.', ask: '"Will it rain on the kids’ game Saturday?"' },
        { title: 'Run your business tools', tag: 'COMING', tagColor: '#FFB547', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM17.5 14v7M14 17.5h7', body: 'Titan Email, Gmail, Apple, your CRM — anything with an MCP server. Controlled access you approve, starting read-only.', ask: '"Which clients haven’t heard from us this month?"' },
        { title: 'Never drop a follow-up', tag: 'COMING', tagColor: '#FFB547', icon: 'M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', body: 'Birthdays, appointments, calls to return. Timely nudges so the things you care about actually happen.', ask: '"Remind me to call Dad Sunday afternoon."' },
        { title: 'Fill forms from your vault', tag: 'COMING', tagColor: '#FFB547', icon: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4M12 15v2', body: 'Snap a form with your phone or glasses. Jessi fills it in from your locked, on-device vault and flags the dates that matter.', ask: '"Fill out this school form for Emma."' }
      ],
      features: this._tl([
        { num: '01', title: 'AI that runs on your phone', icon: 'M9 3h6M9 21h6M3 9v6M21 9v6M7 7h10v10H7z', body: "Jessi's core AI runs directly on your Android device, so everyday conversations don't depend on a cloud model." },
        { num: '02', title: 'Talk to Jessi', icon: 'M2 10v4M6 6v12M10 3v18M14 8v8M18 5v14M22 10v4', body: 'Start an audio conversation through a familiar phone-call interface and hear Jessi respond with an on-device voice.' },
        { num: '03', title: "Show, don't just explain", icon: 'M3 7h4l2-3h6l2 3h4v13H3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', body: "Share a photo and ask questions about what's in it." },
        { num: '04', title: 'Conversations with continuity', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8 9h8M8 13h5', body: 'Chats organized into sessions, with local history to return to earlier discussions.' },
        { num: '05', title: 'A personal information feed', icon: 'M4 4h16v6H4zM4 14h7v6H4zM15 14h5v6h-5z', body: 'Image-led news and information cards in a swipeable feed, with source links.' },
        { num: '06', title: 'Sources you can explore', icon: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7', body: 'Open the original source in the in-app browser, then return to Jessi.' },
        { num: '07', title: 'Weather at a glance', icon: 'M17.5 19H8a5 5 0 1 1 1-9.9A6 6 0 0 1 20.5 12a3.5 3.5 0 0 1-3 7z', body: 'Conditions and forecasts for a U.S. location from the National Weather Service.' },
        { num: '08', title: 'Feedback that puts you in control', icon: 'M7 10v12M15 5.9 14 10h5.8a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 18.4 22H7V10l4-8a3 3 0 0 1 4 3.9z', body: "Thumbs-up, thumbs-down and corrections, stored locally — never automatically shared." },
        { num: '09', title: 'Choose how Jessi sounds', icon: 'M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14', body: 'Preview local voice options and pick the one you prefer.' }
      ]),
      roadmap: [
        { n: '01', title: 'Day Dreaming', body: 'Jessi explores topics you choose in the background, looking for common ground with you, and saves discoveries to discuss later.' },
        { n: '02', title: 'Connected business tools', body: 'CRM and other MCP integrations, starting with controlled, read-only access.' },
        { n: '03', title: 'Read-aloud stories', body: "Listen to feed content in Jessi's voice." },
        { n: '04', title: 'A manageable memory library', body: 'Review, correct and remove what Jessi remembers.' },
        { n: '05', title: 'Tasks and follow-ups', body: 'Reminders, scheduled work and timely notifications.' },
        { n: '06', title: 'Documents that become useful', body: 'Help completing forms, finding important dates and preparing downloadable results.' },
        { n: '07', title: 'Secure connections', body: 'Device-local secret storage and clear controls over connected services.' },
        { n: '08', title: 'Cross-device continuity', body: 'Desktop and browser companions linked by secure sync routing — your own personal network, nothing stored in the cloud.' }
      ]
    };
  }
}

var TPL = {"jx-skill-ui":"\n\n<div style=\"pointer-events: auto; max-width: 760px\">\n<p class=\"jx-tag\" style=\"margin: 0 0 16px; font-family: 'JetBrains Mono', monospace; font-size: 13px; letter-spacing: .12em; color: #B79CFF\">[04.B] // SKILLVERSE · <span style=\"color: {{act.col}}\">NODE {{act.num}}</span> / 08 · ONLINE</p>\n<h2 class=\"jx-zoom\" style=\"margin: 0 0 16px; font-family: Unbounded, sans-serif; font-weight: 800; font-size: clamp(38px, 6vw, 84px); line-height: .95; letter-spacing: -0.02em; text-transform: uppercase\">Skills for every part <span class=\"jx-grad\">of your life.</span></h2>\n<p style=\"margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 13px; letter-spacing: .08em; color: #A8B3C7\">HOME · WORK · FAMILY · TRAVEL — TAP A NODE OR PICK A SKILL</p>\n</div>\n\n<div style=\"flex: 1; display: flex; flex-wrap: wrap; align-items: center; gap: 24px; margin-top: 24px\">\n<div aria-hidden=\"true\" style=\"flex: 999 1 480px; min-height: 380px\"></div>\n<div style=\"flex: 1 1 360px; max-width: 470px; pointer-events: auto\">\n<div role=\"region\" aria-live=\"polite\" aria-label=\"Selected skill\" style=\"position: relative; overflow: hidden; border: 1px solid {{act.col}}; background: rgba(5,7,13,.88); border-radius: 26px; padding: 32px; box-shadow: 0 0 0 1px {{act.glow}}, 0 0 90px {{act.glow}}; transition: border-color .4s, box-shadow .4s\">\n<div aria-hidden=\"true\" style=\"position: absolute; right: -8px; top: -38px; font-family: Unbounded, sans-serif; font-weight: 800; font-size: 180px; line-height: 1; color: transparent; -webkit-text-stroke: 2px {{act.glow}}\">{{act.num}}</div>\n<div style=\"position: relative; display: flex; align-items: center; gap: 14px; margin-bottom: 22px\">\n<div style=\"width: 60px; height: 60px; flex: none; border-radius: 16px; background: {{act.col}}; box-shadow: 0 0 34px {{act.glow}}; display: flex; align-items: center; justify-content: center\"><svg width=\"30\" height=\"30\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#05070D\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"{{act.icon}}\"></path></svg></div>\n<div><div style=\"font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; letter-spacing: .1em; color: {{act.col}}\">{{act.cat}}</div><div style=\"font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .08em; color: #A8B3C7\">{{act.where}}</div></div>\n</div>\n<h3 style=\"position: relative; margin: 0 0 12px; font-family: Unbounded, sans-serif; font-weight: 800; font-size: clamp(28px, 3.2vw, 42px); line-height: 1.05; text-transform: uppercase; overflow-wrap: anywhere\">{{act.name}}</h3>\n<p style=\"position: relative; margin: 0 0 22px; color: #C9D4E6; font-size: 17px\">{{act.body}}</p>\n<div style=\"position: relative; font-family: 'JetBrains Mono', monospace; font-size: 14px; background: #05070D; border: 1px solid #1B2335; border-radius: 12px; padding: 14px 16px\">\n<div style=\"font-size: 11px; letter-spacing: .1em; color: #8E9AB0; margin-bottom: 6px\">YOU SAY</div>\n<span style=\"color: {{act.col}}\">&gt;</span> {{act.ask}}<span class=\"jx-blink\" style=\"color: {{act.col}}\">▌</span>\n</div>\n<div style=\"position: relative; display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 22px\">\n<span style=\"font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: .08em; color: #A8B3C7\">SKILL {{act.num}} / 08</span>\n<div style=\"display: flex; gap: 8px\">\n<button type=\"button\" data-skill-step=\"-1\" aria-label=\"Previous skill\" style=\"width: 46px; height: 46px; border-radius: 12px; border: 1px solid #262E40; background: #0A0E18; color: #EAF2FF; cursor: pointer; display: flex; align-items: center; justify-content: center\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m15 18-6-6 6-6\"></path></svg></button>\n<button type=\"button\" data-skill-step=\"1\" aria-label=\"Next skill\" style=\"width: 46px; height: 46px; border-radius: 12px; border: 1px solid {{act.col}}; background: {{act.col}}; color: #05070D; cursor: pointer; display: flex; align-items: center; justify-content: center\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m9 18 6-6-6-6\"></path></svg></button>\n</div>\n</div>\n</div>\n</div>\n</div>\n\n<div role=\"group\" aria-label=\"Choose a skill\" style=\"pointer-events: auto; display: flex; flex-wrap: wrap; gap: 10px; margin-top: 36px\">\n<sc-for list=\"{{skills}}\" as=\"s\" hint-placeholder-count=\"8\">\n<button type=\"button\" data-skill=\"{{$index}}\" aria-pressed=\"{{s.pressed}}\" style=\"display: inline-flex; align-items: center; gap: 10px; min-height: 46px; padding: 8px 16px 8px 12px; border-radius: 999px; border: 1px solid {{s.bd}}; background: {{s.bg}}; color: {{s.fg}}; box-shadow: {{s.sh}}; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; letter-spacing: .05em; cursor: pointer; transition: background .25s, color .25s, border-color .25s, box-shadow .25s\">\n<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"{{s.icon}}\"></path></svg>{{s.upper}}\n</button>\n</sc-for>\n</div>\n","jx-hangar-ui":"\n<div style=\"display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 16px\">\n<div role=\"region\" aria-live=\"polite\" aria-label=\"Selected robot\" style=\"pointer-events: auto; max-width: 380px; border: 1px solid {{bot.col}}; background: rgba(5,7,13,.86); border-radius: 20px; padding: 22px 24px; box-shadow: 0 0 60px {{bot.glow}}; transition: border-color .4s, box-shadow .4s\">\n<div style=\"font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: .12em; color: {{bot.col}}\">QFR HANGAR · {{bot.num}} / 05 · {{bot.cat}}</div>\n<h3 style=\"margin: 6px 0 8px; font-family: Unbounded, sans-serif; font-weight: 800; font-size: 40px; line-height: 1; text-transform: uppercase\">{{bot.name}}</h3>\n<p style=\"margin: 0 0 14px; font-size: 15px; color: #C9D4E6\">{{bot.body}}</p>\n<div style=\"display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #A8B3C7; margin-bottom: 14px\"><span style=\"width: 8px; height: 8px; border-radius: 50%; background: {{bot.col}}; box-shadow: 0 0 10px {{bot.col}}\"></span>JESSI LINK · ACTIVE</div>\n<a href=\"https://quantumforgerobotics.com/robots\" style=\"display: inline-flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; letter-spacing: .06em; color: #05070D; background: {{bot.col}}; text-decoration: none; border-radius: 10px; padding: 10px 14px\">SEE {{bot.upper}} ON QFR ↗</a>\n</div>\n<div style=\"font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: .08em; color: #8E9AB0; text-align: right; line-height: 1.8\">\n<div>ONE MIND · <span style=\"color: {{accent}}\">FIVE BODIES</span></div>\n<div>HUMANOID · QUADRUPED · WHEELED · AERIAL</div>\n</div>\n</div>\n<div role=\"group\" aria-label=\"Choose a robot\" style=\"pointer-events: auto; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px\">\n<sc-for list=\"{{bots}}\" as=\"r\" hint-placeholder-count=\"5\">\n<button type=\"button\" data-bot=\"{{$index}}\" aria-pressed=\"{{r.pressed}}\" style=\"min-height: 46px; padding: 8px 18px; border-radius: 999px; border: 1px solid {{r.bd}}; background: {{r.bg}}; color: {{r.fg}}; box-shadow: {{r.sh}}; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; letter-spacing: .06em; cursor: pointer; transition: background .25s, color .25s, border-color .25s, box-shadow .25s\">{{r.upper}} <span style=\"opacity: .7; font-weight: 500\">· {{r.cat}}</span></button>\n</sc-for>\n</div>\n"};
var comp = new Component();
var vals = comp.renderVals();
vals.setCanvas(document.getElementById('jx-c-hero'));
vals.setSkillCanvas(document.getElementById('jx-c-skill'));
vals.setHangarCanvas(document.getElementById('jx-c-hangar'));
vals.setGlassCanvas(document.getElementById('jx-c-glass'));
var KEYS = ['data-skill', 'data-skill-step', 'data-bot'];
window.__jxRefresh = function () {
  var v = comp.renderVals();
  Object.keys(TPL).forEach(function (id) {
    var el = document.getElementById(id); if (!el) return;
    var a = document.activeElement, sel = null;
    if (a && el.contains(a)) KEYS.forEach(function (k) { if (!sel && a.hasAttribute(k)) sel = '[' + k + '="' + a.getAttribute(k) + '"]'; });
    el.innerHTML = jxRender(TPL[id], v);
    if (sel) { var n = el.querySelector(sel); if (n) n.focus(); }
  });
};
document.addEventListener('click', function (e) {
  var t = e.target.closest('[data-skill],[data-skill-step],[data-bot]'); if (!t) return;
  if (t.hasAttribute('data-skill')) comp._pickSkill(+t.getAttribute('data-skill'));
  else if (t.hasAttribute('data-skill-step')) comp._pickSkill(((comp.state && comp.state.active) || 0) + (+t.getAttribute('data-skill-step')));
  else comp._pickBot(+t.getAttribute('data-bot'));
});
comp.componentDidMount();
})();
