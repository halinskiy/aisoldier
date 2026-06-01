/**
 * Corder activation Worker -- Paddle webhook receiver.
 *
 * Phase 1 (this file): accept Paddle webhook POSTs, verify the HMAC
 * signature using PADDLE_WEBHOOK_SECRET, log the event, return 200.
 * Nothing is persisted yet; the Worker exists so a Notifications
 * destination can be registered in Paddle dashboard today and
 * production webhook traffic can be observed in real time via
 * `wrangler tail`.
 *
 * Phase 3 (next session): wire D1 for subscriber records, fire the
 * activation flow (generate licence key OR call the Mac app over
 * a magic-link URL) on `subscription.activated` /
 * `transaction.completed`, downgrade on `subscription.cancelled` /
 * `subscription.paused`, and expose a GET endpoint that the landing
 * page's /thanks/ ActivationStatus component can poll to confirm
 * the subscription is live.
 *
 * Endpoints:
 *   POST /paddle-webhook   -- the only path Paddle is allowed to hit
 *   GET  /healthz          -- liveness check, no auth
 *   *    /                 -- 404
 */

export interface Env {
  PADDLE_WEBHOOK_SECRET: string;
  ALLOWED_ORIGIN?: string;
}

/**
 * Paddle Notification signature header format:
 *   "ts=<unix_ts>;h1=<hex_hmac_sha256>"
 *
 * The HMAC is computed over `${ts}:${rawBody}` with the destination's
 * secret as the key. We must verify against the RAW request body --
 * any JSON re-serialisation invalidates the signature.
 */
const PADDLE_SIGNATURE_HEADER = "Paddle-Signature";

/** Acceptable clock skew between Paddle's signing ts and our wall
 *  clock. 5 minutes matches Stripe / Paddle reference docs and
 *  guards against simple replay attacks. */
const MAX_SIGNATURE_AGE_SECONDS = 300;

interface PaddleEventEnvelope {
  event_id?: string;
  event_type?: string;
  occurred_at?: string;
  data?: {
    id?: string;
    customer_id?: string;
    subscription_id?: string;
    items?: Array<{ price?: { id?: string } }>;
    custom_data?: {
      tier?: string;
      billing?: string;
      launch?: boolean | string;
    };
  };
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === "GET" && url.pathname === "/healthz") {
      return new Response("ok", {
        status: 200,
        headers: { "content-type": "text/plain" },
      });
    }

    if (req.method !== "POST" || url.pathname !== "/paddle-webhook") {
      return new Response("Not found", { status: 404 });
    }

    if (!env.PADDLE_WEBHOOK_SECRET) {
      console.error("PADDLE_WEBHOOK_SECRET is not configured");
      return new Response("Server misconfigured", { status: 500 });
    }

    const signature = req.headers.get(PADDLE_SIGNATURE_HEADER);
    if (!signature) {
      return new Response("Missing signature", { status: 401 });
    }

    // Read raw body BEFORE JSON.parse -- the HMAC is computed over
    // the exact byte sequence Paddle signed, including any
    // whitespace they chose.
    const rawBody = await req.text();

    const verification = await verifyPaddleSignature(
      rawBody,
      signature,
      env.PADDLE_WEBHOOK_SECRET
    );

    if (verification.ok === false) {
      console.warn("Paddle signature verification failed:", verification.reason);
      return new Response("Invalid signature", { status: 401 });
    }

    let event: PaddleEventEnvelope;
    try {
      event = JSON.parse(rawBody) as PaddleEventEnvelope;
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    // Structured log. `wrangler tail` shows these in real time and
    // they are searchable in Cloudflare dashboard -> Workers ->
    // Logs. Phase 3 will write the same payload to D1.
    console.log("paddle.webhook", {
      event_id: event.event_id,
      event_type: event.event_type,
      occurred_at: event.occurred_at,
      transaction_id: event.data?.id,
      customer_id: event.data?.customer_id,
      subscription_id: event.data?.subscription_id,
      price_ids: event.data?.items?.map((i) => i.price?.id).filter(Boolean),
      tier: event.data?.custom_data?.tier,
      billing: event.data?.custom_data?.billing,
      launch: event.data?.custom_data?.launch,
    });

    return new Response("OK", { status: 200 });
  },
};

type VerifyResult = { ok: true } | { ok: false; reason: string };

/**
 * Verify the Paddle-Signature header using HMAC-SHA256.
 *
 * Returns granular failure reasons so the caller can log enough
 * detail to debug a misconfigured destination without leaking the
 * secret in error messages.
 */
async function verifyPaddleSignature(
  body: string,
  header: string,
  secret: string
): Promise<VerifyResult> {
  const parts = header.split(";").map((p) => p.trim());
  const tsPart = parts.find((p) => p.startsWith("ts="));
  const h1Part = parts.find((p) => p.startsWith("h1="));
  if (!tsPart || !h1Part) {
    return { ok: false, reason: "malformed_header" };
  }

  const ts = tsPart.slice(3);
  const provided = h1Part.slice(3);

  const tsNumber = Number(ts);
  if (!Number.isFinite(tsNumber)) {
    return { ok: false, reason: "invalid_timestamp" };
  }
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSeconds - tsNumber) > MAX_SIGNATURE_AGE_SECONDS) {
    return { ok: false, reason: "stale_or_future_timestamp" };
  }

  const signedPayload = `${ts}:${body}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(signedPayload)
  );
  const expected = bytesToHex(new Uint8Array(signed));

  if (!constantTimeEqual(expected, provided)) {
    return { ok: false, reason: "hmac_mismatch" };
  }

  return { ok: true };
}

function bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    if (b === undefined) continue;
    out += b.toString(16).padStart(2, "0");
  }
  return out;
}

/**
 * Constant-time string comparison. A naive `a === b` short-circuits
 * on the first differing char and leaks timing info. Cloudflare's
 * crypto.subtle has no constant-time compare primitive, so we
 * implement it by hand on equal-length strings.
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
