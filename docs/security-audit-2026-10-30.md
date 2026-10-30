# Security-hygiene audit — 30 oktober 2026

Project: **a4ds5t/Xmas-Countdown**  
Canonieke productie: **Cloudflare Worker** + **https://xmas.soholocal.nl**  
Referentie-checklist: a4ds5t/Startpage PR #81 (commit `4c778fbf`)

Deze audit is read-only gecombineerd met PR-wijzigingen op branch `cursor/security-hygiene-audit-d928`. Er is **niet** gedeployed of gemerged.

---

## A. Secrets in git

### Werkmap en `.gitignore`

- Geen `.env`, `.dev.vars`, PEM- of key-bestanden in de working tree.
- `.gitignore` dekte al `.wrangler/`, `.dev.vars` en `build-info.js` ( gegenereerd ).
- **Aanvulling in PR:** `.env`, `.env.*`, `*.pem`, `*.key`.

### Git-geschiedenis

- `git log -p` en ripgrep op typische patronen (`ghp_`, `AKIA`, `BEGIN RSA PRIVATE`, hardcoded wachtwoorden/tokens): **geen treffers** in de volledige history van deze repo.

### Browser / statische assets

- `script.js`, `version-tag.js`, `index.html` en `kerst/index.html` bevatten **geen** API-keys, tokens of geheimen. `CHANGELOG_URL` wijst naar de publieke GitHub CHANGELOG (bewust ongewijzigd).

**Conclusie secrets:** geen kritieke bevindingen.

---

## B. GitHub Actions

Er is **geen** map `.github/workflows/` in deze repository. Er worden dus geen workflows uitgevoerd, geen `secrets.*` gebruikt, en geen PAT’s in CI.

**Optioneel (P4):** bij toekomstige workflows alleen de standaard `GITHUB_TOKEN` met minimale `permissions`; geen PAT in repo-secrets tenzij strikt nodig.

---

## C. `npm audit`

Uitgevoerd in de repo-root (enige `package.json`; geen apart test-/sharp-pakket).

| Moment | Resultaat |
|--------|-----------|
| Vóór fix | 3 kwetsbaarheden (2 moderate, 1 high) via `undici` → `miniflare` → `wrangler` 4.152.x — **alleen devDependencies** (Wrangler lokaal / dry-run), niet in de browser-bundle |
| Na `npm audit fix` | **0 vulnerabilities**; lockfile resolved `wrangler` **4.156.0** |

Runtime (Worker + statische site) heeft **geen** npm-runtime dependencies in productie; alleen dev tooling.

---

## D. Orphaned assets (niet via HTML/CSS/JS/Worker gelinkt)

Bestanden die wel in git staan maar **niet** door de site-HTML, CSS, JS of `worker.js` worden gerefereerd:

| Bestand | Opmerking | Voorstel |
|---------|-----------|----------|
| `LICENSE` | Alleen in `readme.md` | Niet nodig als publiek static asset → toegevoegd aan `.assetsignore` in PR |
| `NOTICE` | Idem | Idem |
| `CHANGELOG.md` | Changelog-link gaat naar GitHub, niet naar `/CHANGELOG.md` | Idem |
| `kerst/CREDIT.md` | Repo-documentatie | Idem |
| `kerst/SPECS.md` | Repo-documentatie; vermeldt niet-bestaande `kerst-B.html` / `preview-kerst-baubles.png` | Idem; SPECS bijwerken is apart onderhoud |
| `docs/version-tag.md` | Al in `docs/**` ignore | Geen actie |

Alle overige binaire assets (`og-image.png`, favicons, `kerst/_assets/…jpg`, CSS/JS) zijn wel gerefereerd. **Geen** bestanden verwijderd (alleen assetsignore + documentatie).

---

## E. Doc drift (GitHub Pages / verkeerde productie-host)

| Locatie | Status vóór PR | Na PR |
|---------|----------------|-------|
| `readme.md` | GitHub Pages als mede-host | Worker + `xmas.soholocal.nl`; zie `docs/Development.md` |
| `wrangler.jsonc` comment | “GitHub Pages serves…” | Statische root + Worker |
| `.assetsignore` comment | GitHub Pages | Worker-only upload |
| `docs/Development.md` | Ontbrak | **Nieuw** — canonieke hosting beschreven |

HTML/sitemap/robots gebruikten al `https://xmas.soholocal.nl/`. Verwijzingen naar `almost-xmas` in code/tests/CHANGELOG blijven **correct** (legacy 301).

---

## F. `.assetsignore` / publieke blootstelling

Gecontroleerd via `wrangler dev` (poort 8787): de volgende paden geven **404** (niet in asset-upload):

- `/test/redirect.test.mjs` → 404  
- `/worker.js` → 404  
- `/scripts/generate-build-info.js` → 404  
- `/docs/Development.md` → 404  
- `/package.json` → 404  

---

## G. Verificatie (lokaal, vóór PR)

### Tests

```text
npm test — 3/3 geslaagd (301 pad+query, security headers op assets, 301 zonder extra headers)
npm run check — wrangler deploy --dry-run geslaagd
```

Geen aparte SEO-test suite in deze repo (n.v.t.).

### `curl -I` tegen `wrangler dev` (127.0.0.1:8787)

**`/` — 200**

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Security-Policy: frame-ancestors 'self'
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
```

**`/kerst/` — 200** (zelfde security headers)

**`/build-info.js` — 200** (zelfde security headers)

**`/version-tag.js` — 200** (zelfde security headers)

**Legacy host (301, ongewijzigd gedrag)**

```http
curl -sI -H 'Host: almost-xmas.soholocal.nl' http://127.0.0.1:8787/kerst/?a=1

HTTP/1.1 301 Moved Permanently
Location: https://xmas.soholocal.nl/kerst/?a=1
```

(Geen `Referrer-Policy` / CSP op de 301-response — zoals bedoeld.)

---

## H. Worker security headers (PR)

Op **alle** ASSETS-responses (inclusief JS/CSS):

- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Content-Security-Policy: frame-ancestors 'self'` (geen volledige CSP)

De 301 van `almost-xmas.soholocal.nl` is **niet** aangepast.

---

## I. Eindoordeel

| Onderdeel | Beoordeling |
|-----------|-------------|
| Secrets in git | **Veilig** — niets kritieks |
| CI / Actions | **N.v.t.** — geen workflows |
| npm audit (dev) | **Opgelost** in PR (wrangler bump) |
| Publieke blootstelling repo-bestanden | **Verbeterd** via `.assetsignore` |
| Doc drift | **Gecorrigeerd** in PR |
| Security headers | **Toegevoegd** in PR |

**Geen kritieke openstaande punten** voor merge/deploy-voorbereiding. Deploy en merge bewust **niet** uitgevoerd in deze run.

### Optioneel P4 — branch protection

Er is geen release-workflow in deze repo. Advies voor `main`: verplichte PR-review, geen direct push, en (indien later een versie-workflow komt) beperken wie workflows mag triggeren — analoog aan Startpage PR #81 handoff.

---

## J. PR 0.1.5 (samenvatting wijzigingen)

- Versie **0.1.5** in `script.js`, `kerst/index.html`, `package.json` / lock, `CHANGELOG.md`
- `worker.js` security headers
- `.gitignore` / `.assetsignore` uitbreiding
- `readme.md` + `docs/Development.md`
- `npm audit fix` → wrangler 4.156.0
