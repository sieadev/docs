export async function onRequest({ request, params }) {
  const UPSTREAMS = {
    jonion: "https://jonion-javadoc.pages.dev",
  };

  const project = params.project;
  const upstream = UPSTREAMS[project];

  if (!upstream) {
    return new Response("Unknown project for Javadocs proxy.", { status: 404 });
  }

  const url = new URL(request.url);
  const path = url.pathname;
  const apiPrefix = `/${project}/api`;
  const apiPrefixSlash = `${apiPrefix}/`;

  if (path === apiPrefix || path === `${apiPrefix}/`) {
    return Response.redirect(`${url.origin}${apiPrefix}/latest/`, 302);
  }

  // Serve an iframe wrapper for page-like paths under /project/api/... (no extension in last segment).
  // The upstream site loads in the iframe so CSS, JS, and links all work. Asset URLs are proxied below.
  if (path.startsWith(apiPrefixSlash)) {
    const lastSegment = path.split("/").filter(Boolean).pop() || "";
    if (!lastSegment.includes(".")) {
      const rest = path.slice(apiPrefixSlash.length) || "latest/";
      const iframeSrc = `${upstream}/${rest.replace(/^\/+/, "")}`;
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>API Docs</title>
  <style>html,body{margin:0;height:100%;}iframe{border:0;width:100%;height:100%;display:block}</style>
</head>
<body>
  <iframe src="${iframeSrc.replace(/"/g, "&quot;")}" title="API Documentation"></iframe>
</body>
</html>`;
      return new Response(html, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "content-length": String(new TextEncoder().encode(html).length),
        },
      });
    }
  }

  // Trailing-slash redirect for page-like paths
  if (
    !path.endsWith("/") &&
    path.startsWith(apiPrefixSlash) &&
    !path.split("/").pop().includes(".")
  ) {
    return Response.redirect(`${url.origin}${path}/`, 302);
  }

  const rest = Array.isArray(params.path) ? params.path.join("/") : (params.path || "");
  const lastSegment = rest.split("/").filter(Boolean).pop() || "";
  const needsTrailingSlash = !lastSegment.includes(".");
  const upstreamPath = rest ? `/${rest}${needsTrailingSlash ? "/" : ""}` : "/";
  const upstreamUrl = `${upstream}${upstreamPath}${url.search}`;

  const response = await fetch(new Request(upstreamUrl, request));

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("Location");
    if (location) {
      const base = `${url.origin}${apiPrefix}`;
      const newLocation = location.startsWith("/")
        ? `${base}${location}`
        : location.startsWith("http")
          ? location.replace(new URL(upstream).origin, `${url.origin}${apiPrefix}`)
          : `${base}/${location}`;

      const currentPathNorm = path.replace(/\/?$/, "/");
      const targetPathNorm = new URL(newLocation, url.origin).pathname.replace(/\/?$/, "/");
      if (targetPathNorm === currentPathNorm) {
        const upstreamTarget = location.startsWith("http")
          ? location
          : location.startsWith("/")
            ? `${upstream}${location}`
            : `${upstream}/${location}`;
        const followResponse = await fetch(upstreamTarget, { redirect: "follow" });
        const newHeaders = new Headers(followResponse.headers);
        newHeaders.delete("content-encoding");
        return new Response(followResponse.body, {
          status: followResponse.status,
          headers: newHeaders,
        });
      }

      const headers = new Headers(response.headers);
      headers.set("Location", newLocation);
      return new Response(response.body, { status: response.status, headers });
    }
  }

  return response;
}