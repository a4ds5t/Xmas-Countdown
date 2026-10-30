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
  });
});
