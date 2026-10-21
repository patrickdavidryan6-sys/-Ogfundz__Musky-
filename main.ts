import { serveFile } from "jsr:@std/http/file-server";

Deno.serve((req: Request) => {
  const url = new URL(req.url);

  if (url.pathname !== "/" && url.pathname !== "/index.html") {
    return new Response("Not found", { status: 404 });
  }

  return serveFile(req, "./index.html");
});
