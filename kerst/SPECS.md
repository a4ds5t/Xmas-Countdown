# SPECS — Kerst Immersive B · Baubles hero

**Scope:** Kerst-only. No StartPage. No Almost chrome/nav. Local only — no cloud publish.

## Hero asset
- Path (web): `kerst/_assets/baubles-SUTfFCAHV_A.jpg` (from repo root)
- Page: `kerst/index.html` + `kerst/kerst-baubles.css`
- Source (do not overwrite): original Unsplash download (~7 MB); web asset is compressed JPEG q82 (~323 KB)
- Crop/placement: `background-position: right 42% / cover` — sharp golden bauble stays **right**; soft bokeh zone **left** for copy.
- Veil: left-weighted horizontal darkening + bottom fade so cream/gold type stays readable without killing the bauble.

## Layout
- Full-bleed Immersive B: title + countdown **inside** the photo (bottom-left).
- Countdown target: **25 Dec 2026** (live JS).
- Optional floating info panel (`?panel=1` or “Meer over deze dag”).
- Palette: evergreen `#0a1210` / `#0f2418`, gold `#d4b56a`, cream `#f3e6c8`. No mall-Santa kitsch.

## Credit
- Discreet footer credit required (see `CREDIT.md`): Chad Madden · Unsplash.
- Also HTML comment in `kerst-B.html`.

## Files
- `kerst-B.html` — desktop hero (NL)
- `kerst-baubles.css` — standalone tokens (xmas-B Immersive pattern, no Almost nav)
- `preview-kerst-baubles.png` — ~1280×800 chrome headless crop
- `CREDIT.md`, `SPECS.md`
