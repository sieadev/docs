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

  return fetch(new Request(upstreamUrl, request));
}