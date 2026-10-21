import { serveFile } from "jsr:@std/http/file-server";

const port = Number.parseInt(Deno.env.get("PORT") ?? "8000", 10);

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

Deno.serve({ hostname: "0.0.0.0", port }, (req: Request) => {
  return serveFile(req, "./index.html");
});
