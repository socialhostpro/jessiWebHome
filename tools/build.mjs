// Builds the standalone static site in ./public from the design sources in ./design.
// Zero dependencies: `node tools/build.mjs`
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public');
const BLOBS = {
  '/_blob/201b8ee1ca3bce6ea7f7618d80a676d4': 'assets/three.min.js',
  '/_blob/aa69d0d35debc75aa8502384d714bedf': 'assets/qfr-logo.png',
};
const SITE = {
  title: 'Jessi AI — Your AI. Your phone. Your data.',
  description: 'Jessi AI by Quantum Forge Robotics: an on-device personal assistant and business companion. No data center needed. Your data stays on your device.',
  url: process.env.SITE_URL || 'https://quantumforgerobotics.com',
};

// ---------------- shared template engine (also shipped to the browser) ----------------
const ENGINE = String.raw`
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
`;
const engine = new Function(ENGINE + '; return { jxRender, jxGet };')();

// ---------------- helpers ----------------
function between(s, a, b) {
  const i = s.indexOf(a); const j = s.indexOf(b, i + a.length);
  if (i < 0 || j < 0) throw new Error('missing ' + a + ' / ' + b);
  return s.slice(i + a.length, j);
}
function mapBlobs(s) { for (const [k, v] of Object.entries(BLOBS)) s = s.split(k).join(v); return s; }
// Cut the inner HTML of the <div> whose opening tag starts with `startStr`; returns [newTemplate, inner].
function cutInner(tpl, startStr, id) {
  const i = tpl.indexOf(startStr);
  if (i < 0) throw new Error('region not found: ' + startStr);
  const openEnd = tpl.indexOf('>', i) + 1;
  const re = /<div[\s>]|<\/div>/g; re.lastIndex = openEnd;
  let depth = 1, m;
  while ((m = re.exec(tpl))) { depth += m[0] === '</div>' ? -1 : 1; if (depth === 0) break; }
  const inner = tpl.slice(openEnd, m.index);
  const open = tpl.slice(i, openEnd).replace('<div ', `<div id="${id}" `);
  return [tpl.slice(0, i) + open + `<!--${id}-->` + tpl.slice(m.index), inner];
}

function load(file) {
  const src = readFileSync(join(ROOT, 'design', file), 'utf8');
  const xdc = between(src, '<x-dc>', '</x-dc>');
  const helmet = between(xdc, '<helmet>', '</helmet>');
  let body = xdc.slice(xdc.indexOf('</helmet>') + '</helmet>'.length);
  const script = between(src, 'data-dc-script', '</script>');
  const component = script.slice(script.indexOf('>') + 1);
  const title = between(src, '<title>', '</title>');
  return { helmet, body, component, title };
}

function makeComponent(componentSrc) {
  const ctx = { console, performance: { now: () => 0 }, setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {} };
  vm.createContext(ctx);
  vm.runInContext(`class DCLogic { constructor(){ this.props = {}; this.state = {}; } setState(p){ Object.assign(this.state, p); } }\n${componentSrc}\nthis.Component = Component;`, ctx);
  return new ctx.Component();
}

function page({ title, description, helmet, bodyHtml, scripts }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="theme-color" content="#05070D">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="assets/qfr-logo.png">
<meta name="twitter:card" content="summary">
<link rel="icon" type="image/png" href="assets/qfr-logo.png">
<link rel="apple-touch-icon" href="assets/qfr-logo.png">
${helmet.trim()}
</head>
<body>
${bodyHtml.trim()}
${scripts}
</body>
</html>
`;
}

mkdirSync(join(OUT, 'assets'), { recursive: true });
for (const f of ['three.min.js', 'qfr-logo.png']) copyFileSync(join(ROOT, 'assets', f), join(OUT, 'assets', f));

// ---------------- index.html ----------------
{
  const { helmet, body, component } = load('Main.dc.html');
  let tpl = mapBlobs(body)
    .replace('onClick="{{s.pick}}"', 'data-skill="{{$index}}"')
    .replace('onClick="{{r.pick}}"', 'data-bot="{{$index}}"')
    .replace('onClick="{{prev}}"', 'data-skill-step="-1"')
    .replace('onClick="{{next}}"', 'data-skill-step="1"')
    .replace(' ref="{{setCanvas}}"', ' id="jx-c-hero"')
    .replace(' ref="{{setSkillCanvas}}"', ' id="jx-c-skill"')
    .replace(' ref="{{setHangarCanvas}}"', ' id="jx-c-hangar"')
    .replace(' ref="{{setGlassCanvas}}"', ' id="jx-c-glass"');
  if (/onClick=|ref="\{\{/.test(tpl)) throw new Error('unconverted handler/ref left in template');

  let skillTpl, hangarTpl;
  [tpl, skillTpl] = cutInner(tpl, '<div style="position: relative; z-index: 2; max-width: 1240px; min-height: 980px;', 'jx-skill-ui');
  [tpl, hangarTpl] = cutInner(tpl, '<div style="position: relative; z-index: 2; min-height: 700px;', 'jx-hangar-ui');

  const comp = makeComponent(component);
  const vals = comp.renderVals();
  let html = engine.jxRender(tpl, vals)
    .replace('<!--jx-skill-ui-->', engine.jxRender(skillTpl, vals))
    .replace('<!--jx-hangar-ui-->', engine.jxRender(hangarTpl, vals));
  if (html.includes('{{') || html.includes('<sc-for')) throw new Error('unrendered template syntax left');

  const app = `(function () {
'use strict';
${ENGINE}
class DCLogic {
  constructor() { this.props = {}; this.state = {}; }
  setState(p) { Object.assign(this.state, p); if (this.componentDidUpdate) this.componentDidUpdate(); if (window.__jxRefresh) window.__jxRefresh(); }
  forceUpdate() { if (window.__jxRefresh) window.__jxRefresh(); }
}
${component}
var TPL = ${JSON.stringify({ 'jx-skill-ui': skillTpl, 'jx-hangar-ui': hangarTpl })};
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
`;
  writeFileSync(join(OUT, 'assets', 'app.js'), app);
  writeFileSync(join(OUT, 'index.html'), page({
    title: SITE.title, description: SITE.description,
    helmet: mapBlobs(helmet), bodyHtml: html,
    scripts: '<script src="assets/three.min.js" defer></script>\n<script src="assets/app.js" defer></script>',
  }));
}

// ---------------- logo.html (static board) ----------------
if (existsSync(join(ROOT, 'design', 'Logo.dc.html'))) {
  const { helmet, body, title } = load('Logo.dc.html');
  writeFileSync(join(OUT, 'logo.html'), page({
    title: 'Jessi AI — ' + title, description: 'Jessi AI logo explorations.',
    helmet: mapBlobs(helmet) + '\n<style>body{background:#05070D;overflow:auto}</style>',
    bodyHtml: engine.jxRender(mapBlobs(body), {}), scripts: '',
  }));
}
console.log('Built ->', OUT);
