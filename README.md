# Jessi AI — Landing Page

Marketing home page for **Jessi AI**, the on-device personal assistant from
[Quantum Forge Robotics](https://quantumforgerobotics.com).

## Run it

```bash
npm start            # serves ./public on http://localhost:3000 (PORT env respected)
npm run build        # regenerate ./public from ./design (no dependencies)
```

## Deploy on Railway

1. New Project → Deploy from GitHub repo → pick this repo / branch.
2. Railway detects Node, runs `npm start` (see `railway.json`). No env vars needed.
3. Health check: `/healthz`. Add your custom domain under Settings → Networking.

`public/` is committed, so Railway serves it as-is. After editing anything in `design/`,
run `npm run build` and commit the updated `public/`.

## Contents

| Path | What it is |
|---|---|
| `public/` | **Standalone site** — `index.html`, `logo.html`, `assets/` (deploy this) |
| `server.js` | Zero-dependency Node static server (security headers, `/healthz`) |
| `tools/build.mjs` | Builds `public/` from `design/` |
| `design/Main.dc.html` | Full landing page (Design canvas component source) |
| `design/Logo.dc.html` | Jessi AI logo explorations (A · Neural J, B · Two Sparks, C · Core Hex) |
| `design/canvas.json` | Canvas layout index |
| `assets/three.min.js` | Three.js r158 (MIT) used by the 3D scenes |
| `assets/qfr-logo.png` | Quantum Forge Robotics logo |

## Sections

Hero (Three.js neural sphere) · No data center needed · Assistant · Vault & MCP connections ·
Call Jessi · Meta glasses (Three.js) · Skill Store / Inspector · Skillverse (Three.js) ·
Adapts to you · Privacy CTA · Origin + QFR robot hangar (Three.js) · Beta timeline ·
Launch-sequence roadmap · Beta CTA

## Notes

- Source files are in the Design canvas `.dc.html` format; asset URLs point at `/_blob/…`
  uploads. Map those to `assets/` when building a standalone static site:
  - `/_blob/201b8ee1ca3bce6ea7f7618d80a676d4` → `assets/three.min.js`
  - `/_blob/aa69d0d35debc75aa8502384d714bedf` → `assets/qfr-logo.png`
- Placeholders still to fill: `[ANDROID BETA LINK]`, `[IOS WAITLIST LINK]`, `[PRIVACY POLICY]`,
  `[TERMS]`, `[CONTACT]`, `[MEASURED FIGURE]`, `[LOCAL CODE SOURCE]`, `[ROADMAP DATES]`, `[MODEL LIST]`.
