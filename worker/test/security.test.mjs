import { createHmac, webcrypto } from "node:crypto";
import test from "node:test";
import assert from "node:assert/strict";
import { timingSafeEqual, verifyWebhookSignature } from "../src/security.ts";

globalThis.crypto ??= webcrypto;

test("accepts a correctly signed payload", async () => {
  const body = JSON.stringify({ id: "evt_1", type: "job.completed", job_id: "job_1" });
  const signature = createHmac("sha256", "secret").update(body).digest("hex");
  assert.equal(await verifyWebhookSignature(body, `sha256=${signature}`, "secret"), true);
});

test("rejects invalid and malformed signatures", async () => {
  assert.equal(await verifyWebhookSignature("payload", "sha256=" + "0".repeat(64), "secret"), false);
  assert.equal(await verifyWebhookSignature("payload", "bad", "secret"), false);
  assert.equal(await verifyWebhookSignature("payload", null, "secret"), false);
});

test("compares signatures", () => {
  assert.equal(timingSafeEqual("same", "same"), true);
  assert.equal(timingSafeEqual("same", "different"), false);
});
