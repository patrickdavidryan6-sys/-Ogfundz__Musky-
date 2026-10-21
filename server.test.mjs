import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createApp } from "./server.mjs";

const server = createApp();
let baseUrl;

before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

test("serves the home page", async () => {
  const response = await fetch(`${baseUrl}/`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^text\/html/);
  assert.match(await response.text(), /Hello, Deno!/);
});

test("provides a health check", async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("rejects unknown paths", async () => {
  const response = await fetch(`${baseUrl}/missing`);

  assert.equal(response.status, 404);
});
