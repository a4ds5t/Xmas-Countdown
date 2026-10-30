import assert from "node:assert/strict";
import { describe, it } from "node:test";
import worker from "../worker.js";

describe("legacy host redirect", () => {
  it("301 from almost-xmas to xmas with path and query preserved", async () => {
    const request = new Request("http://almost-xmas.soholocal.nl/kerst/?a=1");
    const response = await worker.fetch(request, {
      ASSETS: { fetch: () => new Response("unexpected", { status: 500 }) },
    });
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("Location"), "https://xmas.soholocal.nl/kerst/?a=1");
  });

  it("serves assets for other hosts", async () => {
    const request = new Request("http://127.0.0.1/");
    const response = await worker.fetch(request, {
      ASSETS: { fetch: () => new Response("ok", { status: 200 }) },
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Referrer-Policy"), "strict-origin-when-cross-origin");
    assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
    assert.equal(response.headers.get("X-Frame-Options"), "SAMEORIGIN");
    assert.equal(response.headers.get("Content-Security-Policy"), "frame-ancestors 'self'");
  });

  it("legacy 301 is unchanged (no security header injection)", async () => {
    const request = new Request("http://almost-xmas.soholocal.nl/?x=1");
    const response = await worker.fetch(request, {
      ASSETS: { fetch: () => new Response("unexpected", { status: 500 }) },
    });
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("Referrer-Policy"), null);
    assert.equal(response.headers.get("Content-Security-Policy"), null);
  });
});
