/**
 * Thin Worker for Almost Christmas: structured request logs + ASSETS passthrough.
 * Intended hostname later: almost-xmas.soholocal.nl (no routes in this PR).
 */
function assetRequestFor(request) {
  const url = new URL(request.url);
  const { pathname } = url;
  if (pathname === "/" || pathname === "") {
    return new Request(new URL("/index.html", url), request);
  }
  if (pathname.endsWith("/")) {
    return new Request(new URL(`${pathname}index.html`, url), request);
  }
  return request;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const started = Date.now();

    const response = await env.ASSETS.fetch(assetRequestFor(request));

    console.log(
      JSON.stringify({
        method: request.method,
        path: url.pathname,
        search: url.search.length > 1 ? url.search : undefined,
        status: response.status,
        duration_ms: Date.now() - started,
      }),
    );

    return response;
  },
};
