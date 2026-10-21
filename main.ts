import { serveFile } from "jsr:@std/http/file-server";

const port = Number.parseInt(Deno.env.get("PORT") ?? "8000", 10);

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

Deno.serve({ port }, (req: Request) => {
  const { pathname } = new URL(req.url);

  if (pathname === "/health") {
    return Response.json({ status: "ok" });
  }

  if (pathname !== "/") {
    return new Response("Not found", { status: 404 });
  }

  return serveFile(req, "./index.html");
});
