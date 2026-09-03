# Derma-Defend™ — interactive prototype

Concept prototype built for the **Galderma GRAD 3.0 Sunscreen Challenge**
by *The Red Flag of Dreams*, FMS Delhi — Vihaan, Nityam Gupta, Lipi Gupta, Shivom Somani.

Five static pages, no build step, no framework, no backend.

| Page | What it does |
|---|---|
| `index.html` | The Sun-Rx diagnostic — six inputs, delivered-SPF result, light budget, regimen, shareable result card |
| `science.html` | The spectrum explainer and the filter-degradation simulator |
| `portfolio.html` | The six-SKU range, matched to a skin condition, with basket and replenishment economics |
| `clinicians.html` | Batch certificate + authenticity lookup, the clinic-only SKU, sample request |
| `commercial.html` | The acquisition funnel this site feeds and how it connects to the financial model |

## Hosting

Everything is relative-path static, so any of these work with no configuration:

**GitHub Pages**

```bash
git init && git add . && git commit -m "Derma-Defend prototype"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then *Settings → Pages → Source: deploy from branch → `main` / root*.
The site appears at `https://<you>.github.io/<repo>/` within a minute or two.

**Netlify / Vercel / Cloudflare Pages** — drag the folder onto the dashboard, or point
the project at the repo. Build command: none. Publish directory: root.

**Locally** — `python3 -m http.server 8000`, then open `http://localhost:8000`.
Opening `index.html` straight off the filesystem also works.

## How it is put together

Every file sits in one flat folder — no subdirectories, so nothing can break
by being moved or unzipped differently.

```
style.css   design tokens and every component
data.js     the six SKUs, eight skin conditions, cities, batches, funnel
app.js      shared state and the one model every page calls
*.png       pack renders and photography, referenced by bare filename
```

There is a **single model** in `app.js`. All six inputs feed it, and each one changes
something you can see:

- **dose** → delivered SPF, protection window, pack life, the meter
- **skin tone** → minutes to erythema at UV index 1
- **city** → UV index, which divides that time *and* stresses the filters on the science page
- **hours outdoors** → the UV half of the light budget
- **screen hours** → the visible-light half, which is what decides whether the regimen needs a tint
- **condition** → which SKUs fill each slot, and whether iron oxides are required

State persists across pages for the session via `sessionStorage`, wrapped in `try/catch`
so private-browsing modes degrade to defaults rather than breaking. Nothing is transmitted
anywhere; the forms are deliberately inert.

## Honesty notes

These matter more than the code. Every claim on the site is labelled in its page footer, but
in short:

- Product names, formulations, pack formats, prices and pack renders are **proposals for a
  case submission**, not Galderma products or commercial claims.
- Delivered-SPF figures use the standard **linear approximation** of SPF against applied dose
  relative to the 2.0 mg/cm² ISO 24444 test dose. Real dose–response is not strictly linear;
  the figure is illustrative.
- Photostability curves are **modelled** from the published behaviour of these filter classes.
  No panel has been run.
- Batch certificates, batch codes and test values are **illustrative**.
- Funnel volumes and conversion rates are **planning assumptions**, not measured results.
- Photography and pack renders are **AI-generated concept imagery** and carry provenance
  watermarks. They are not photographs of real people, patients or products.
- The site is **not medical advice** and does not diagnose or treat anything.

## Licence / reuse

Built for a competition submission. Galderma, Cetaphil and Biluma are trademarks of their
owner and are referenced here as the subject of the case, not as endorsed usage.
