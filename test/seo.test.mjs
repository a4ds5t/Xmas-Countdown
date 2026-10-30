import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const kerstHtml = readFileSync(new URL("../kerst/index.html", import.meta.url), "utf8");

test("index.html canonical and hreflang point at xmas.soholocal.nl", () => {
  assert.match(indexHtml, /<link rel="canonical" href="https:\/\/xmas\.soholocal\.nl\/"/);
  assert.match(indexHtml, /hreflang="en"/);
  assert.match(indexHtml, /hreflang="nl"/);
  assert.match(indexHtml, /hreflang="x-default"/);
  assert.match(indexHtml, /<meta name="twitter:creator" content="@a4ds5t"/);
});

test("kerst/index.html canonical and NL hreflang", () => {
  assert.match(kerstHtml, /<link rel="canonical" href="https:\/\/xmas\.soholocal\.nl\/kerst\/"/);
  assert.match(kerstHtml, /hreflang="nl" href="https:\/\/xmas\.soholocal\.nl\/kerst\/"/);
  assert.match(kerstHtml, /<meta name="twitter:creator" content="@a4ds5t"/);
});
