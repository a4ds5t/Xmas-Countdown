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

## TODO: canonical and Open Graph URLs

`index.html` still points `canonical`, `hreflang`, `og:url`, and `og:image` at the GitHub Pages host `https://drallas.github.io/Xmas-Countdown/`. Rewrite those at deploy time (or with a thin Worker and the ASSETS binding). Do not hardcode a production Workers URL before one exists. The same TODO is in the comment above those tags in `index.html` and in `wrangler.jsonc`.
