// Static site + contact form endpoint for Jessi AI. No dependencies: Node 20+.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 8080;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const CONTACT_TO = process.env.CONTACT_TO || 'privacy@quantumforgerobotics.com';
const CONTACT_FROM = process.env.CONTACT_FROM || 'noreply@quantumforgerobotics.com';

const CSP = "default-src 'self'; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline' blob: https:; " +
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https:; font-src 'self' data: blob: https:; " +
  "connect-src 'self' blob: data: https:; media-src 'self' data: blob: https:; object-src 'none'; " +
  "frame-src 'self' blob: about: https:; worker-src 'self' blob:; form-action 'self'; base-uri 'self'";

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.xml': 'text/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.mp4': 'video/mp4',
};
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.webmanifest', '.xml', '.txt', '.svg']);
const HIDDEN = new Set(['server.js', 'Dockerfile', 'package.json', 'routes.json']);
// Pretty section URLs (/glasses, /join, ...) all serve the home page; the page scrolls itself.
// Each can have its own pre-rendered variant (s/<slug>.html) carrying that URL's share tags.
let HOME_ROUTES = new Set(), ROUTE_PAGES = {};
try {
  const r = JSON.parse(fs.readFileSync(path.join(ROOT, 'routes.json'), 'utf8'));
  HOME_ROUTES = new Set(r.home);
  ROUTE_PAGES = r.pages || {};
} catch {}
const LONG_CACHE = /^\/(assets|vendor|share)\/|^\/(og-image\.jpg|favicon\.(ico|svg)|icon-\d+\.png|apple-touch-icon\.png)$/;

const cache = new Map(); // path -> { body, gz, type }

function baseHeaders(extra) {
  return Object.assign({
    'Content-Security-Policy': CSP,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }, extra);
}

function load(file) {
  let hit = cache.get(file);
  if (hit) return hit;
  const body = fs.readFileSync(file);
  const ext = path.extname(file).toLowerCase();
  hit = { body, type: TYPES[ext] || 'application/octet-stream', gz: COMPRESSIBLE.has(ext) && body.length > 1024 ? zlib.gzipSync(body) : null };
  cache.set(file, hit);
  return hit;
}

function resolve(urlPath) {
  let p;
  try { p = decodeURIComponent(urlPath); } catch { return null; }
  if (p.includes('\0')) return null;
  const parts = p.split('/').filter(Boolean);
  if (parts.some(s => s.startsWith('.')) || (parts.length === 1 && HIDDEN.has(parts[0]))) return null;
  const base = path.join(ROOT, ...parts);
  if (!base.startsWith(ROOT)) return null;
  for (const cand of [base, base + '.html', path.join(base, 'index.html')]) {
    try { if (fs.statSync(cand).isFile()) return cand; } catch {}
  }
  return null;
}

function serveStatic(req, res, urlPath) {
  const file = resolve(urlPath);
  if (!file) {
    const nf = resolve('/404');
    const hit = nf ? load(nf) : { body: Buffer.from('Not found'), type: 'text/plain; charset=utf-8' };
    res.writeHead(404, baseHeaders({ 'Content-Type': hit.type, 'Cache-Control': 'no-cache' }));
    return res.end(req.method === 'HEAD' ? undefined : hit.body);
  }
  const hit = load(file);
  const gzip = hit.gz && /\bgzip\b/.test(req.headers['accept-encoding'] || '');
  const headers = baseHeaders({
    'Content-Type': hit.type,
    'Cache-Control': LONG_CACHE.test(urlPath) ? 'public, max-age=604800' : 'no-cache',
    'Vary': 'Accept-Encoding',
  });
  if (gzip) headers['Content-Encoding'] = 'gzip';
  const body = gzip ? hit.gz : hit.body;
  headers['Content-Length'] = body.length;
  res.writeHead(200, headers);
  res.end(req.method === 'HEAD' ? undefined : body);
}

// ---- contact form ----
const hits = new Map(); // ip -> [timestamps]
const WINDOW_MS = 60 * 60 * 1000, MAX_PER_WINDOW = 5;
const TOPICS = ['General question', 'Beta access', 'Bug or support', 'Privacy request', 'Business or partnerships', 'Press'];
const EMAIL_RE = /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]{2,}$/;

function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
}

function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some(t => now - t < WINDOW_MS)) hits.delete(k);
  return list.length > MAX_PER_WINDOW;
}

function readBody(req, limit) {
  return new Promise((ok, fail) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > limit) { fail(new Error('too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => ok(Buffer.concat(chunks).toString('utf8')));
    req.on('error', fail);
  });
}

const oneLine = s => String(s || '').replace(/[\r\n\t]+/g, ' ').trim();

async function sendgrid(pathname, method, payload) {
  const r = await fetch('https://api.sendgrid.com' + pathname, {
    method,
    headers: { Authorization: 'Bearer ' + SENDGRID_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10000),
  });
  if (!r.ok) throw new Error('SendGrid ' + r.status + ' ' + (await r.text()).slice(0, 300));
}

function sendMail({ to, replyTo, subject, text, html }) {
  const content = [{ type: 'text/plain', value: text }];
  if (html) content.push({ type: 'text/html', value: html });
  return sendgrid('/v3/mail/send', 'POST', {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: CONTACT_FROM, name: 'Jessi AI' },
    ...(replyTo ? { reply_to: replyTo } : {}),
    subject: subject.slice(0, 200),
    content,
    tracking_settings: { click_tracking: { enable: false }, open_tracking: { enable: false } },
  });
}

function replier(req, res, page) {
  const wantsJson = /json/.test(req.headers['content-type'] || '') || /json/.test(req.headers.accept || '');
  const reply = (status, ok, error) => {
    if (wantsJson) {
      res.writeHead(status, baseHeaders({ 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }));
      return res.end(JSON.stringify(ok ? { ok: true } : { ok: false, error }));
    }
    res.writeHead(303, baseHeaders({ Location: ok ? page + '?sent=1' : page + '?error=' + encodeURIComponent(error) }));
    res.end();
  };
  return { wantsJson, reply };
}

async function readForm(req, wantsJson) {
  const raw = await readBody(req, 20000);
  return wantsJson ? JSON.parse(raw) : Object.fromEntries(new URLSearchParams(raw));
}

// ---- waitlist ----
const USES = ['Everyday assistant', 'Meta glasses', 'Home and DIY', 'Work and business', 'Learning', 'Privacy'];
const WAITLIST_LIST_ID = process.env.SENDGRID_WAITLIST_LIST_ID || '';

async function handleWaitlist(req, res) {
  const { wantsJson, reply } = replier(req, res, '/');
  let data;
  try { data = await readForm(req, wantsJson); } catch { return reply(400, false, 'That signup could not be read. Please try again.'); }

  const email = oneLine(data.email).slice(0, 200);
  const name = oneLine(data.name).slice(0, 100);
  const device = oneLine(data.device).slice(0, 100);
  const platform = data.platform === 'iOS' ? 'iOS' : 'Android';
  const uses = (Array.isArray(data.uses) ? data.uses : [data.uses]).filter(u => USES.includes(u));
  const updates = data.updates === true || data.updates === 'yes';

  if (data.website || (data.t && Date.now() - Number(data.t) < 2500)) return reply(200, true);
  if (rateLimited(clientIp(req) + '|wl')) return reply(429, false, 'Too many signups from this connection. Please try again later.');
  if (!EMAIL_RE.test(email)) return reply(400, false, 'Please enter a valid email address.');
  if (!SENDGRID_API_KEY) {
    console.error('waitlist: SENDGRID_API_KEY is not set');
    return reply(503, false, 'Signups are temporarily unavailable. Please try again soon.');
  }

  const summary = `Email: ${email}\nName: ${name || '-'}\nPlatform: ${platform}\nPhone: ${device || '-'}\nInterested in: ${uses.join(', ') || '-'}\nProduct updates: ${updates ? 'yes' : 'no'}\nSigned up: ${new Date().toISOString()}`;
  try {
    await sendMail({ to: CONTACT_TO, replyTo: { email, name: name || email }, subject: `[Jessi waitlist] ${platform}: ${email}`, text: 'New Jessi beta signup\n\n' + summary });
  } catch (e) {
    console.error('waitlist: notify failed', e.message);
    return reply(502, false, 'We could not add you right now. Please try again in a minute.');
  }

  const hi = name ? `Hi ${name},` : 'Hi,';
  const line = platform === 'iOS'
    ? "You're on the iOS waitlist. We'll email you as soon as Jessi is ready for iPhone."
    : "You're on the list for the Jessi Android beta. We'll email you when your spot opens.";
  sendMail({
    to: email,
    subject: "You're on the Jessi waitlist",
    text: `${hi}\n\n${line}\n\nJessi thinks on the phone in your hand, not in a data center. Your data stays on your device.\n\nIf you didn't sign up, you can ignore this email.\n\n- The Jessi team at Quantum Forge Robotics`,
    html: `<div style="font-family:Inter,Arial,sans-serif;background:#05070D;color:#C9D4E6;padding:32px"><div style="max-width:520px;margin:0 auto;border:1px solid #1B2335;border-radius:18px;background:#0A0E18;padding:28px"><p style="margin:0 0 6px;font-family:monospace;color:#22F2E1;letter-spacing:.1em;font-size:12px">&gt; JESSI.WAITLIST: CONFIRMED</p><h1 style="margin:0 0 16px;color:#EAF2FF;font-size:26px">You're on the list.</h1><p>${hi.replace(/[<>&"]/g, '')}</p><p>${line}</p><p>Jessi thinks on the phone in your hand, not in a data center. Your data stays on your device.</p><p style="color:#8E9AB0;font-size:13px;margin-top:24px">If you didn't sign up, you can ignore this email.<br>The Jessi team at Quantum Forge Robotics</p></div></div>`,
  }).catch(e => console.error('waitlist: confirmation failed', e.message));

  const contact = { email, ...(name ? { first_name: name.split(' ')[0] } : {}) };
  sendgrid('/v3/marketing/contacts', 'PUT', { ...(WAITLIST_LIST_ID ? { list_ids: [WAITLIST_LIST_ID] } : {}), contacts: [contact] })
    .catch(e => console.error('waitlist: contact list add failed (key may lack Marketing scope)', e.message));

  console.log('waitlist: added', platform);
  reply(200, true);
}

async function handleContact(req, res) {
  const { wantsJson, reply } = replier(req, res, '/contact');
  let data;
  try { data = await readForm(req, wantsJson); } catch { return reply(400, false, 'That message could not be read. Please try again.'); }

  const name = oneLine(data.name).slice(0, 100);
  const email = oneLine(data.email).slice(0, 200);
  const topic = TOPICS.includes(data.topic) ? data.topic : 'General question';
  const message = String(data.message || '').replace(/\r\n/g, '\n').trim().slice(0, 5000);
  const elapsed = Date.now() - Number(data.t || 0);

  // Bots: a filled honeypot or an instant submit gets a fake success so they don't retry.
  if (data.website || (data.t && elapsed < 2500)) return reply(200, true);
  if (rateLimited(clientIp(req))) return reply(429, false, 'Too many messages from this connection. Please try again later.');
  if (!name || !EMAIL_RE.test(email) || message.length < 10) {
    return reply(400, false, 'Please add your name, a valid email and a message of at least 10 characters.');
  }
  if (!SENDGRID_API_KEY) {
    console.error('contact: SENDGRID_API_KEY is not set');
    return reply(503, false, 'The contact form is temporarily unavailable. Please email ' + CONTACT_TO + '.');
  }

  const text = `New message from the Jessi AI website\n\nName: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}\n\n--\nSent ${new Date().toISOString()}`;
  try {
    await sendMail({ to: CONTACT_TO, replyTo: { email, name }, subject: `[Jessi contact] ${topic}: ${name}`, text });
  } catch (e) {
    console.error('contact: SendGrid request failed', e.message);
    return reply(502, false, 'We could not send your message right now. Please try again or email ' + CONTACT_TO + '.');
  }
  console.log('contact: delivered', topic);
  reply(200, true);
}

http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0];
  const api = { '/api/contact': handleContact, '/api/waitlist': handleWaitlist }[urlPath];
  if (api) {
    if (req.method !== 'POST') { res.writeHead(405, baseHeaders({ Allow: 'POST' })); return res.end(); }
    return api(req, res).catch(e => { console.error(urlPath, e); if (!res.headersSent) { res.writeHead(500); res.end(); } });
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, baseHeaders({ Allow: 'GET, HEAD' })); return res.end(); }
  if (urlPath === '/index.html') { res.writeHead(301, { Location: '/' }); return res.end(); }
  const slug = urlPath.replace(/^\/+|\/+$/g, '');
  if (urlPath.length > 1 && urlPath.endsWith('/') && (HOME_ROUTES.has(slug) || resolve('/' + slug))) {
    res.writeHead(301, { Location: '/' + slug }); return res.end(); // one canonical form, no trailing slash
  }
  if (urlPath === '/') return serveStatic(req, res, '/index.html');
  if (HOME_ROUTES.has(slug)) return serveStatic(req, res, ROUTE_PAGES[slug] ? '/' + ROUTE_PAGES[slug] : '/index.html');
  if (/^\/s\//.test(urlPath)) return serveStatic(req, res, '/404-hidden'); // variants only via their pretty URL
  serveStatic(req, res, urlPath);
}).listen(PORT, () => console.log('jessi site listening on', PORT, '· contact ->', CONTACT_TO, SENDGRID_API_KEY ? '' : '(SENDGRID_API_KEY missing)'));
