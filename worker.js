/**
 * Thin Worker for Almost Christmas: legacy-host 301 + structured logs + ASSETS passthrough.
 */
const LEGACY_HOST = "almost-xmas.soholocal.nl";
const CANONICAL_ORIGIN = "https://xmas.soholocal.nl";

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

    if (url.hostname === LEGACY_HOST) {
      const destination = new URL(`${url.pathname}${url.search}`, CANONICAL_ORIGIN);
      return Response.redirect(destination.toString(), 301);
    }

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
