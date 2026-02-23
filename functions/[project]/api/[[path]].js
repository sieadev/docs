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

  if (path === `/${project}/api` || path === `/${project}/api/`) {
    return Response.redirect(`${url.origin}/${project}/api/latest/`, 302);
  }

  if (
    !path.endsWith("/") &&
    path.startsWith(`/${project}/api/`) &&
    !path.split("/").pop().includes(".")
  ) {
    return Response.redirect(`${url.origin}${path}/`, 302);
  }

  const rest = Array.isArray(params.path) ? params.path.join("/") : (params.path || "");
  const upstreamUrl = `${upstream}/${rest}${url.search}`;

  const response = await fetch(new Request(upstreamUrl, request));

  // Rewrite redirect Location so browser stays on /project/api/... instead of going to /latest/ etc.
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("Location");
    if (location) {
      const base = `${url.origin}/${project}/api`;
      const newLocation = location.startsWith("/")
        ? `${base}${location}`  // upstream path like /latest/ or /1.2.3/
        : location.startsWith("http")
          ? location.replace(new URL(upstream).origin, `${url.origin}/${project}/api`)  // absolute to upstream
          : `${base}/${location}`;  // relative without leading slash
      const headers = new Headers(response.headers);
      headers.set("Location", newLocation);
      return new Response(response.body, { status: response.status, headers });
    }
  }

  return response;
}