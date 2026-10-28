// Generates one 1200x630 share image per URL in build/shares.json.
// Needs the site running locally:  cd site && PORT=8765 node server.js
// Then:  node build/og/make.js   (requires the `playwright` package and a Chromium)
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const BASE = process.env.SITE || 'http://localhost:8765';
const HOST = (process.env.PUBLIC_HOST || 'jessi-ai-home-production.up.railway.app');
const OUT = path.join(__dirname, '..', 'public', 'share');
const SHOTS = path.join(__dirname, 'shots');
const shares = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'shares.json'), 'utf8'));
const only = process.argv.slice(2);

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});

  // 1. Screenshot each section (or open modal) as it really looks.
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.addStyleTag({ content: '.jx-share{display:none!important}html::after{display:none!important}' });
  for (const [slug, d] of Object.entries(shares)) {
    if (only.length && !only.includes(slug)) continue;
    if (d.modal) {
      await page.evaluate(() => { window.scrollTo(0, 0); document.documentElement.classList.remove('jx-wl-open', 'jx-pm-open'); });
      await page.waitForTimeout(300);
      await page.evaluate(m => document.documentElement.classList.add(m === 'wl' ? 'jx-wl-open' : 'jx-pm-open'), d.modal);
      await page.waitForTimeout(1200);
    } else {
      await page.evaluate(() => document.documentElement.classList.remove('jx-wl-open', 'jx-pm-open'));
      await page.evaluate(id => document.getElementById(id).scrollIntoView({ block: 'start', behavior: 'instant' }), d.section);
      await page.waitForTimeout(1800);
    }
    await page.screenshot({ path: path.join(SHOTS, slug + '.png') });
  }
  await page.close();

  // 2. Compose the card.
  const card = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await card.goto(pathToFileURL(path.join(__dirname, 'card.html')).href, { waitUntil: 'networkidle' });
  await card.evaluate(() => document.fonts.ready);
  for (const [slug, d] of Object.entries(shares)) {
    if (only.length && !only.includes(slug)) continue;
    const shot = 'data:image/png;base64,' + fs.readFileSync(path.join(SHOTS, slug + '.png')).toString('base64');
    await card.evaluate(x => window.fill(x), { ...d, slug, host: HOST, shot });
    await card.waitForTimeout(150);
    await card.screenshot({ path: path.join(OUT, slug + '.jpg'), type: 'jpeg', quality: 86 });
    console.log('share/' + slug + '.jpg');
  }
  await browser.close();
})();
