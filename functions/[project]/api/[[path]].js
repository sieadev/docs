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

  // Redirect /<project>/api -> /<project>/api/latest/
  if (url.pathname === `/${project}/api` || url.pathname === `/${project}/api/`) {
    return Response.redirect(`${url.origin}/${project}/api/latest/`, 302);
  }

  const rest = Array.isArray(params.path) ? params.path.join("/") : (params.path || "");
  const upstreamUrl = `${upstream}/${rest}${url.search}`;

  const proxyRequest = new Request(upstreamUrl, request);
  return fetch(proxyRequest);
}
