import { sha256Hex, verifyWebhookSignature } from "./security";

export interface Env {
  DB: D1Database;
  SOURCE_ASSETS: R2Bucket;
  API_TOKEN: string;
  WEBHOOK_SECRET: string;
}

type WebhookEvent = {
  id: string;
  type: "job.processing" | "job.completed" | "job.failed";
  job_id: string;
  result?: unknown;
};

const json = (value: unknown, status = 200) => Response.json(value, { status });

function authorized(request: Request, env: Env): boolean {
  return Boolean(env.API_TOKEN) && request.headers.get("authorization") === `Bearer ${env.API_TOKEN}`;
}

async function audit(env: Env, action: string, subject: string | null, metadata: unknown): Promise<void> {
  await env.DB.prepare(
    "INSERT INTO audit_logs (action, subject_id, metadata_json, created_at) VALUES (?, ?, ?, ?)",
  ).bind(action, subject, JSON.stringify(metadata), new Date().toISOString()).run();
}

async function createJob(request: Request, env: Env): Promise<Response> {
  if (!authorized(request, env)) return json({ error: "unauthorized" }, 401);
  const idempotencyKey = request.headers.get("idempotency-key")?.trim();
  if (!idempotencyKey || idempotencyKey.length > 255) return json({ error: "valid Idempotency-Key required" }, 400);

  const form = await request.formData();
  const source = form.get("source");
  if (!(source instanceof File)) return json({ error: "source file required" }, 400);
  if (source.size > 20 * 1024 * 1024) return json({ error: "source file exceeds 20 MB" }, 413);

  const bytes = await source.arrayBuffer();
  const requestHash = await sha256Hex(bytes);
  const existing = await env.DB.prepare(
    "SELECT request_hash, job_id FROM request_keys WHERE key = ?",
  ).bind(idempotencyKey).first<{ request_hash: string; job_id: string }>();
  if (existing) {
    if (existing.request_hash !== requestHash) return json({ error: "idempotency key reused with different content" }, 409);
    return json({ id: existing.job_id, duplicate: true });
  }

  const jobId = crypto.randomUUID();
  const assetKey = `jobs/${jobId}/source`;
  const now = new Date().toISOString();
  await env.SOURCE_ASSETS.put(assetKey, bytes, {
    httpMetadata: { contentType: source.type || "application/octet-stream" },
    customMetadata: { jobId, originalName: source.name },
  });

  try {
    await env.DB.batch([
      env.DB.prepare("INSERT INTO jobs (id, status, asset_key, asset_name, asset_type, asset_size, created_at, updated_at) VALUES (?, 'queued', ?, ?, ?, ?, ?, ?)")
        .bind(jobId, assetKey, source.name, source.type || "application/octet-stream", source.size, now, now),
      env.DB.prepare("INSERT INTO request_keys (key, request_hash, job_id, created_at) VALUES (?, ?, ?, ?)")
        .bind(idempotencyKey, requestHash, jobId, now),
      env.DB.prepare("INSERT INTO audit_logs (action, subject_id, metadata_json, created_at) VALUES ('job.created', ?, ?, ?)")
        .bind(jobId, JSON.stringify({ assetKey, size: source.size }), now),
    ]);
  } catch (error) {
    await env.SOURCE_ASSETS.delete(assetKey);
    const raced = await env.DB.prepare("SELECT request_hash, job_id FROM request_keys WHERE key = ?")
      .bind(idempotencyKey).first<{ request_hash: string; job_id: string }>();
    if (raced?.request_hash === requestHash) return json({ id: raced.job_id, duplicate: true });
    throw error;
  }
  return json({ id: jobId, status: "queued" }, 201);
}

async function getSource(request: Request, env: Env, jobId: string): Promise<Response> {
  if (!authorized(request, env)) return json({ error: "unauthorized" }, 401);
  const job = await env.DB.prepare("SELECT asset_key, asset_name, asset_type FROM jobs WHERE id = ?")
    .bind(jobId).first<{ asset_key: string; asset_name: string; asset_type: string }>();
  if (!job) return json({ error: "not found" }, 404);
  const object = await env.SOURCE_ASSETS.get(job.asset_key);
  if (!object) return json({ error: "asset not found" }, 404);
  await audit(env, "asset.downloaded", jobId, {});
  return new Response(object.body, {
    headers: {
      "content-type": job.asset_type,
      "content-disposition": `attachment; filename*=UTF-8''${encodeURIComponent(job.asset_name)}`,
      "cache-control": "private, no-store",
    },
  });
}

async function receiveWebhook(request: Request, env: Env): Promise<Response> {
  const body = await request.text();
  if (!(await verifyWebhookSignature(body, request.headers.get("x-webhook-signature"), env.WEBHOOK_SECRET))) {
    return json({ error: "invalid signature" }, 401);
  }
  let event: WebhookEvent;
  try { event = JSON.parse(body) as WebhookEvent; } catch { return json({ error: "invalid JSON" }, 400); }
  if (!event.id || !event.job_id || !["job.processing", "job.completed", "job.failed"].includes(event.type)) {
    return json({ error: "invalid event" }, 400);
  }
  const status = event.type.slice(4);
  const now = new Date().toISOString();
  try {
    await env.DB.batch([
      env.DB.prepare("INSERT INTO webhook_events (event_id, job_id, event_type, received_at) VALUES (?, ?, ?, ?)")
        .bind(event.id, event.job_id, event.type, now),
      env.DB.prepare("UPDATE jobs SET status = ?, result_json = ?, updated_at = ? WHERE id = ?")
        .bind(status, event.result === undefined ? null : JSON.stringify(event.result), now, event.job_id),
      env.DB.prepare("INSERT INTO audit_logs (action, subject_id, metadata_json, created_at) VALUES ('webhook.applied', ?, ?, ?)")
        .bind(event.job_id, JSON.stringify({ eventId: event.id, type: event.type }), now),
    ]);
  } catch (error) {
    const replay = await env.DB.prepare("SELECT event_id FROM webhook_events WHERE event_id = ?").bind(event.id).first();
    if (replay) return json({ accepted: true, duplicate: true });
    throw error;
  }
  return json({ accepted: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/v1/jobs") return createJob(request, env);
    const sourceMatch = url.pathname.match(/^\/v1\/jobs\/([^/]+)\/source$/);
    if (request.method === "GET" && sourceMatch) return getSource(request, env, decodeURIComponent(sourceMatch[1]));
    if (request.method === "POST" && url.pathname === "/v1/webhooks/workflow") return receiveWebhook(request, env);
    return json({ error: "not found" }, 404);
  },
} satisfies ExportedHandler<Env>;
