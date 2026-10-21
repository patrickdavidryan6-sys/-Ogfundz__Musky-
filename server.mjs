import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const port = Number.parseInt(process.env.PORT ?? "8000", 10);
const indexUrl = new URL("./index.html", import.meta.url);

export function createApp() {
  return createServer(async (request, response) => {
    if (request.url === "/health") {
      response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ status: "ok" }));
      return;
    }

    if (request.url !== "/" && request.url !== "/index.html") {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found\n");
      return;
    }

    try {
      const page = await readFile(indexUrl);
      response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      response.end(page);
    } catch (error) {
      console.error("Unable to read index.html", error);
      response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      response.end("Internal server error\n");
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  createApp().listen(port, "0.0.0.0", () => {
    console.log(`Server listening on port ${port}`);
  });
}
