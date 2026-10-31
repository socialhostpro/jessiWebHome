# Jessi AI — Home

Source for the Jessi AI home page (Quantum Forge Robotics), mirrored from the local
`D:\jessi ai Home` working folder.

## Layout

| Path | What it is |
|---|---|
| `Jessi AI — Home-html.zip` | Design-canvas export — the build input |
| `build/` | Build pipeline: `build.py`, header/SEO/share/waitlist/privacy-promise partials, legal pages, OG card generator |
| `site/` | Built, deployable site (`index.html`, `/s/*` share variants, privacy/terms/contact, `server.js`, `Dockerfile`) |

## Build & deploy

```bash
python build/build.py "Jessi AI — Home-html.zip"   # regenerates site/
cd site && railway up                                # deploy to Railway
```

`site/server.js` reads `SENDGRID_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` and
`SENDGRID_WAITLIST_LIST_ID` from the environment. Secrets live in `.env` locally and
in Railway variables — `.env` is git-ignored and never committed.
If you connect this repo to Railway instead of `railway up`, set the service's
root directory to `site/` (it has its own Dockerfile).

## SEO deployment source — 2026-10-31

This checkout contains approved SEO fixes and visibility-bound WebGL initialization
in `build/build.py`, `build/optimize.py` and `build/performance.css`. Regenerate
`site/` using the documented build command before deploying. The design export
alone does not contain these corrections. Preserve the build sources.

Deployment uses direct `railway up site --path-as-root` to the existing
jessi-ai-home production service. Local commits are not pushed upstream. A fresh
checkout from the remote branch or the older D:\jessi ai Home mirror will omit
these fixes until these commits/patches are integrated. Check this before the
next deployment; do not silently publish the old checkout.
