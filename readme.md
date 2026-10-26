# Countdown to Xmas

Simple Javascript program that **counts down** to the next Christmass!

This repository is the home for the GitHub Pages site and the Cloudflare Worker variant of Almost Christmas. **Nothing in this change is deployed.** There is no Workers publish, no DNS change, and no custom domain.

## Layout

The site stays at the repository root (`index.html`, `script.js`, `style.css`, `og-image.png`). GitHub Pages keeps serving that tree. Wrangler points `assets.directory` at the same root instead of a second `public/` copy. The scaffold’s `public/` files were identical to these root files, so they were not added. `.assetsignore` keeps Worker config, npm metadata, and VCS files out of the asset upload. Wrangler still walks the root before applying that ignore file; the upload itself is only the four site files.

## Run locally

Requires Node.js >= 22.

```bash
npm install
npm run check   # wrangler deploy --dry-run — packages the Worker, does not publish
npm run dev     # http://127.0.0.1:8787
```

`npm run dev` and `npm run check` do not deploy. Do not run `wrangler deploy` without `--dry-run` until a real hostname is chosen.

### Kerst · Immersive B (NL-only hero)

Standalone baubles hero at `kerst/` — no Almost language switch or sleigh chrome. Open:

- **Wrangler dev:** [http://127.0.0.1:8787/kerst/](http://127.0.0.1:8787/kerst/) (or `/kerst/?panel=1` for the info panel)
- **Static file:** open `kerst/index.html` in a browser, or `npx --yes serve .` and visit `/kerst/`

Photo credit and specs: `kerst/CREDIT.md`, `kerst/SPECS.md`.

## License

Noncommercial use only, under the PolyForm Noncommercial License 1.0.0 (SPDX: `PolyForm-Noncommercial-1.0.0`). See [LICENSE](LICENSE) and [NOTICE](NOTICE). Commercial use needs a separate paid license. Trademarks and domain names stay with [a4ds5t](https://github.com/a4ds5t).

## TODO: canonical and Open Graph URLs

`index.html` still points `canonical`, `hreflang`, `og:url`, and `og:image` at the GitHub Pages host `https://drallas.github.io/Xmas-Countdown/`. Rewrite those at deploy time (or with a thin Worker and the ASSETS binding). Do not hardcode a production Workers URL before one exists. The same TODO is in the comment above those tags in `index.html` and in `wrangler.jsonc`.
