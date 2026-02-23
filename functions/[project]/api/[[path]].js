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
        const followContentType = followResponse.headers.get("content-type") || "";
        if (followResponse.status === 200 && followContentType.includes("text/html")) {
          const pathAfterApi = path.slice(apiPrefixSlash.length);
          const version = pathAfterApi.split("/")[0];
          const versionRoot = `${apiPrefixSlash}${version}/`;
          let html = await followResponse.text();
          html = html.replace(/(href|src)=["']((?:\.\.\/)+)([^"']+)["']/gi, (_, attr, _dots, rest) => `${attr}="${versionRoot}${rest.replace(/^\//, "")}"`);
          html = html.replace(/(href|src)=["']dev\/(stylesheet\.css|script\.js|jquery-ui\.overrides\.css|script-dir\/[^"']+)["']/gi, (_, attr, asset) => `${attr}="${versionRoot}${asset}"`);
          const pathDir = path.endsWith("/") ? path : path.replace(/\/[^/]*$/, "/");
          const documentBase = `${url.origin}${pathDir}`;
          html = html.replace(/(href|src)=["'](?!https?:|\/\/|#|mailto:)([^"']*)["']/gi, (match, attr, rel) => {
            const trimmed = rel.trim();
            if (!trimmed) return match;
            try {
              const resolved = new URL(trimmed, documentBase);
              if (resolved.origin !== url.origin || !resolved.pathname.startsWith(apiPrefix)) return match;
              return `${attr}="${resolved.pathname}${resolved.search}${resolved.hash}"`;
            } catch { return match; }
          });
          const newHeaders = new Headers(followResponse.headers);
          newHeaders.delete("content-encoding");
          newHeaders.set("content-length", String(new TextEncoder().encode(html).length));
          return new Response(html, { status: 200, headers: newHeaders });
        }
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

  const contentType = response.headers.get("content-type") || "";
  if (response.status === 200 && contentType.includes("text/html")) {
    const pathAfterApi = path.slice(apiPrefixSlash.length);
    const version = pathAfterApi.split("/")[0];
    const versionRoot = `${apiPrefixSlash}${version}/`;

    let html = await response.text();

    html = html.replace(
      /(href|src)=["']((?:\.\.\/)+)([^"']+)["']/gi,
      (_, attr, _dots, rest) => `${attr}="${versionRoot}${rest.replace(/^\//, "")}"`
    );

    html = html.replace(
      /(href|src)=["']dev\/(stylesheet\.css|script\.js|jquery-ui\.overrides\.css|script-dir\/[^"']+)["']/gi,
      (_, attr, asset) => `${attr}="${versionRoot}${asset}"`
    );

    const pathDir = path.endsWith("/") ? path : path.replace(/\/[^/]*$/, "/");
    const documentBase = `${url.origin}${pathDir}`;
    html = html.replace(
      /(href|src)=["'](?!https?:|\/\/|#|mailto:)([^"']*)["']/gi,
      (match, attr, rel) => {
        const trimmed = rel.trim();
        if (!trimmed) return match;
        try {
          const resolved = new URL(trimmed, documentBase);
          if (resolved.origin !== url.origin || !resolved.pathname.startsWith(apiPrefix)) return match;
          return `${attr}="${resolved.pathname}${resolved.search}${resolved.hash}"`;
        } catch {
          return match;
        }
      }
    );

    const newHeaders = new Headers(response.headers);
    newHeaders.set("content-length", String(new TextEncoder().encode(html).length));
    return new Response(html, { status: 200, headers: newHeaders });
  }

  return response;
}