# Development

How this site is built, run locally, and released.

## Production hosting

The live site runs on a **Cloudflare Worker** with static assets via the `ASSETS` binding, on the custom domain **https://xmas.soholocal.nl**. Deploy with Wrangler when Infra routes are in place. Requests to the legacy hostname `almost-xmas.soholocal.nl` get a **301** to the same path and query on `xmas.soholocal.nl` (see `worker.js`).

Repo-only files (Worker, tests, scripts, docs, npm metadata) stay out of the asset upload via `.assetsignore`.

## Local development

Requires Node.js >= 22.

```bash
npm install
npm run check   # wrangler deploy --dry-run — packages Worker + assets, does not publish
npm run dev     # http://127.0.0.1:8787
```

`npm run check` runs `scripts/generate-build-info.js` and refreshes `build-info.js` with a UTC build timestamp.

## Layout

Static files live at the repository root (`index.html`, `script.js`, `style.css`, …) and under `kerst/`. Wrangler `assets.directory` points at the repo root; `run_worker_first` sends every request through the Worker first.

## Tests

```bash
npm test
```

`test/redirect.test.mjs` covers the legacy-host 301 and basic Worker passthrough.

## Versioning

Bump `APP_VERSION` in `script.js` and `kerst/index.html`, `version` in `package.json`, and add a section to `CHANGELOG.md`. See `docs/version-tag.md` for the footer version panel.

## Kerst hero

Standalone NL baubles page at `/kerst/` — specs and photo credit in `kerst/SPECS.md` and `kerst/CREDIT.md` (repo docs only, not uploaded as public assets).
