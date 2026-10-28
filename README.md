# Jessi AI — Landing Page

Marketing home page for **Jessi AI**, the on-device personal assistant from
[Quantum Forge Robotics](https://quantumforgerobotics.com).

## Contents

| Path | What it is |
|---|---|
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
