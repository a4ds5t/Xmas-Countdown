// Smoke tests for index.html and /kerst/ in Chromium.
// External fonts are stubbed so the run needs no network.
// Run with: npm test (from the tests folder). See README.md.

const { chromium } = require('playwright');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

spawnSync(process.execPath, [path.join(ROOT, 'scripts/generate-build-info.js')], {
  cwd: ROOT,
  stdio: 'inherit',
});

const startStaticServer = () => new Promise((resolve) => {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    const filePath = path.join(ROOT, reqPath.replace(/^\//, ''));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      res.end();
      return;
    }
    fs.readFile(filePath, (err, body) => {
      if (err) {
        res.writeHead(404);
        res.end();
        return;
      }
      const type = MIME[path.extname(filePath)] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type });
      res.end(body);
    });
  });
  server.listen(0, '127.0.0.1', () => resolve(server));
});

let passed = 0;
let failed = 0;
const check = (cond, label) => {
  if (cond) { passed++; console.log('  ok    ' + label); }
  else { failed++; console.log('  FAIL  ' + label); }
};

(async () => {
  const server = await startStaticServer();
  const port = server.address().port;
  const HOME = `http://127.0.0.1:${port}/`;
  const KERST = `http://127.0.0.1:${port}/kerst/`;
  const executablePath = process.env.CHROMIUM_PATH || undefined;
  const browser = await chromium.launch({ executablePath });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: 'en-US' });

  await context.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ contentType: 'text/css', body: '/* stub */' }));
  await context.route('https://fonts.gstatic.com/**', (r) => r.fulfill({ contentType: 'font/woff2', body: '' }));

  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  console.log('Homepage');
  await page.goto(HOME);
  await page.waitForSelector('#headline');
  check(await page.isVisible('#headline'), 'headline is shown');
  check(await page.isVisible('#counter'), 'countdown tiles mount');
  check((await page.textContent('#headline'))?.includes('Christmas'), 'headline mentions Christmas');
  check(errors.length === 0, 'no page errors on homepage load');

  console.log('Kerst');
  await page.goto(KERST);
  await page.waitForSelector('h1');
  check(await page.isVisible('h1'), 'kerst hero title renders');
  check(await page.isVisible('#cd-d'), 'kerst countdown day tile is present');
  check(errors.length === 0, 'no page errors on kerst load');

  await browser.close();
  server.close();
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
