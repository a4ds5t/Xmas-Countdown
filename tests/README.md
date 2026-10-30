# Tests

`smoke.js` loads the homepage and `/kerst/` in Chromium: key countdown selectors appear and the pages run without JavaScript errors. Google Fonts requests are stubbed, so no network is needed.

## Run

```bash
cd tests
npm ci
npx playwright install chromium
npm test
```

Generate `build-info.js` automatically happens at the start of the smoke run (same as `npm run check`).

To use a Chromium that is already installed, set `CHROMIUM_PATH` to its binary before `npm test`.

## In GitHub

The workflow `.github/workflows/tests.yml` runs worker unit tests (`npm test` at the repo root) and this smoke script on every push and pull request. The HTML check in `html-check.yml` runs next to it.
