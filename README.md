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
