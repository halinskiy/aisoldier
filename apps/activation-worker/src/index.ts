/**
 * Corder activation Worker -- Paddle webhook receiver + tier grant.
 *
 * Flow:
 *   1. Verify the Paddle-Signature HMAC over the RAW body (any
 *      re-serialisation invalidates it).
 *   2. Map the event to an action:
 *        activate  -> subscription.activated / .created / .resumed,
 *                     transaction.completed / .paid
 *        downgrade -> subscription.canceled / .paused
 *      everything else is logged and ignored.
 *   3. Resolve the tier (from checkout custom_data.tier, else the
 *      price-id catalogue) and the buyer email (from the Paddle
 *      customer via the Paddle API).
 *   4. Find the Supabase user by email and set
 *      `app_metadata.tier` via the service role. The Corder Mac app
 *      reads that tier on its next /auth/v1/user refresh.
 *
 * Setting the tier is idempotent (a PUT), so duplicate webhook
 * deliveries are harmless and no event-id dedup table is needed.
 *
 * SAFE DEGRADATION: if SUPABASE_SERVICE_ROLE / SUPABASE_URL are not
 * configured, the Worker verifies + logs the event and returns 200
 * WITHOUT writing anything. This lets the webhook destination be live
 * (observable via `wrangler tail`) before billing go-live, and means
 * a misconfiguration can never grant the wrong tier -- it just no-ops.
 * Provision the secrets below to switch on real grants:
 *   wrangler secret put SUPABASE_SERVICE_ROLE   (sb service_role key)
 *   wrangler secret put PADDLE_API_KEY          (Paddle server API key)
 * SUPABASE_URL ships as a [vars] entry (it is not secret).
 *
 * Endpoints:
 *   POST /paddle-webhook   -- the only path Paddle is allowed to hit
 *   GET  /healthz          -- liveness check, no auth
 *   *    /                 -- 404
 */

export interface Env {
  PADDLE_WEBHOOK_SECRET: string;
  /** Supabase project URL, e.g. https://xxx.supabase.co. Public. */
  SUPABASE_URL?: string;
  /** Supabase service_role key -- bypasses RLS, writes app_metadata. */
  SUPABASE_SERVICE_ROLE?: string;
  /** Paddle server API key (Dashboard -> Authentication). Used only to
   *  resolve the buyer email from a customer_id. */
  PADDLE_API_KEY?: string;
  /** Paddle API base. Defaults to production; set to
   *  https://sandbox-api.paddle.com for the sandbox account. */
  PADDLE_API_BASE?: string;
}

const PADDLE_SIGNATURE_HEADER = "Paddle-Signature";

/** Acceptable clock skew between Paddle's signing ts and our wall
 *  clock. 5 minutes matches Stripe / Paddle reference docs and
 *  guards against simple replay attacks. */
const MAX_SIGNATURE_AGE_SECONDS = 300;

const PADDLE_API_DEFAULT = "https://api.paddle.com";

/**
 * Price-id -> tier catalogue. Mirrors the landing's
 * src/lib/paddle.ts. custom_data.tier (set at checkout) is the primary
 * source of truth; this map is the fallback when custom_data is absent
 * (e.g. a subscription created directly in the Paddle dashboard).
 * Override via the same NEXT_PUBLIC_* ids if they ever rotate.
 */
const PRICE_TIER: Record<string, "pro" | "max"> = {
  // Pro
  pri_01kszshrfje0safhq8e2yfe8rh: "pro", // monthly
  pri_01kszsmvs5qvch2mkgcmdaqqk1: "pro", // launch monthly
  pri_01kszsr83e2y84jyxg1bj8qnyq: "pro", // annual
  // Max
  pri_01kt01msttrfnj80r9gx6beb4b: "max", // monthly
  pri_01kt01r6bx872y0s6zamg719k3: "max", // launch monthly
  pri_01kt025kjhgrbj1nxhz9bsz9mn: "max", // annual
};

const ACTIVATE_EVENTS = new Set([
  "subscription.activated",
  "subscription.created",
  "subscription.resumed",
  "transaction.completed",
  "transaction.paid",
]);

const DOWNGRADE_EVENTS = new Set([
  "subscription.canceled",
  "subscription.cancelled",
  "subscription.paused",
]);

interface PaddleEventEnvelope {
  event_id?: string;
  event_type?: string;
  occurred_at?: string;
  data?: {
    id?: string;
    customer_id?: string;
    subscription_id?: string;
    status?: string;
    items?: Array<{ price?: { id?: string } }>;
    custom_data?: {
      tier?: string;
      billing?: string;
      launch?: boolean | string;
    };
  };
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
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

    // Read raw body BEFORE JSON.parse -- the HMAC is computed over the
    // exact byte sequence Paddle signed, including any whitespace.
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

    const eventType = event.event_type ?? "";
    const priceIds =
      event.data?.items?.map((i) => i.price?.id).filter(Boolean) as string[];

    console.log("paddle.webhook", {
      event_id: event.event_id,
      event_type: eventType,
      occurred_at: event.occurred_at,
      transaction_id: event.data?.id,
      customer_id: event.data?.customer_id,
      subscription_id: event.data?.subscription_id,
      status: event.data?.status,
      price_ids: priceIds,
      tier: event.data?.custom_data?.tier,
      billing: event.data?.custom_data?.billing,
    });

    // Do the activation work off the response path so Paddle always
    // gets a fast 200. waitUntil keeps the isolate alive until the
    // grant completes. Any failure is logged; Paddle retries on
    // non-200, but since the work is async we ack 200 and rely on the
    // idempotent PUT for the retry-driven re-runs.
    ctx.waitUntil(processEvent(event, eventType, priceIds, env));

    return new Response("OK", { status: 200 });
  },
};

/**
 * Resolve {action, tier, email} and write the tier to Supabase.
 * Never throws to the caller -- all failures are logged. This runs in
 * waitUntil, so an unhandled rejection would be swallowed silently;
 * the try/catch makes the failure visible in `wrangler tail`.
 */
async function processEvent(
  event: PaddleEventEnvelope,
  eventType: string,
  priceIds: string[],
  env: Env
): Promise<void> {
  try {
    const isActivate = ACTIVATE_EVENTS.has(eventType);
    const isDowngrade = DOWNGRADE_EVENTS.has(eventType);
    if (!isActivate && !isDowngrade) {
      return; // not an entitlement-changing event
    }

    // Safe degradation: without Supabase creds we never write.
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE) {
      console.warn("activation: SUPABASE not configured -- skipping grant", {
        event_type: eventType,
      });
      return;
    }

    const tier = isDowngrade
      ? "free"
      : resolveTier(event.data?.custom_data?.tier, priceIds);
    if (!tier) {
      console.warn("activation: could not resolve tier -- skipping", {
        event_type: eventType,
        custom_tier: event.data?.custom_data?.tier,
        price_ids: priceIds,
      });
      return;
    }

    const email = await resolveCustomerEmail(event.data?.customer_id, env);
    if (!email) {
      console.warn("activation: could not resolve buyer email -- skipping", {
        event_type: eventType,
        customer_id: event.data?.customer_id,
        note: "PADDLE_API_KEY missing or customer lookup failed",
      });
      return;
    }

    const userId = await findSupabaseUserIdByEmail(email, env);
    if (!userId) {
      console.warn("activation: no Supabase user for buyer email -- skipping", {
        event_type: eventType,
        email,
        note: "buyer has not signed up in the app yet (or used a different email)",
      });
      return;
    }

    await setUserTier(userId, tier, env);
    console.log("activation: tier set", { email, userId, tier, event_type: eventType });
  } catch (err) {
    console.error("activation: unhandled error", {
      event_type: eventType,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

function resolveTier(
  customTier: string | undefined,
  priceIds: string[]
): "pro" | "max" | null {
  const ct = (customTier ?? "").toLowerCase();
  if (ct === "pro" || ct === "max") return ct;
  for (const id of priceIds ?? []) {
    const mapped = PRICE_TIER[id];
    if (mapped) return mapped;
  }
  return null;
}

/**
 * Resolve the buyer email from a Paddle customer_id via the Paddle
 * API. Returns null if PADDLE_API_KEY is absent or the lookup fails.
 */
async function resolveCustomerEmail(
  customerId: string | undefined,
  env: Env
): Promise<string | null> {
  if (!customerId || !env.PADDLE_API_KEY) return null;
  const base = env.PADDLE_API_BASE || PADDLE_API_DEFAULT;
  try {
    const resp = await fetch(
      `${base}/customers/${encodeURIComponent(customerId)}`,
      { headers: { Authorization: `Bearer ${env.PADDLE_API_KEY}` } }
    );
    if (!resp.ok) {
      console.warn("activation: paddle customer lookup failed", {
        customer_id: customerId,
        status: resp.status,
      });
      return null;
    }
    const body = (await resp.json()) as { data?: { email?: string } };
    const email = body.data?.email?.trim().toLowerCase();
    return email || null;
  } catch (err) {
    console.warn("activation: paddle customer fetch threw", {
      customer_id: customerId,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

/**
 * Find a Supabase user id by email via the GoTrue admin API.
 * GoTrue's server-side email filter is unreliable across versions, so
 * we page through the admin list (bounded) and match locally. Fine at
 * current scale; revisit with an indexed profile lookup as the user
 * count grows.
 */
async function findSupabaseUserIdByEmail(
  email: string,
  env: Env
): Promise<string | null> {
  const target = email.trim().toLowerCase();
  const perPage = 1000;
  for (let page = 1; page <= 20; page++) {
    const resp = await fetch(
      `${env.SUPABASE_URL}/auth/v1/admin/users?page=${page}&per_page=${perPage}`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE ?? "",
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE ?? ""}`,
        },
      }
    );
    if (!resp.ok) {
      console.warn("activation: supabase admin list failed", {
        status: resp.status,
        page,
      });
      return null;
    }
    const body = (await resp.json()) as {
      users?: Array<{ id: string; email?: string }>;
    };
    const users = body.users ?? [];
    const hit = users.find((u) => (u.email ?? "").toLowerCase() === target);
    if (hit) return hit.id;
    if (users.length < perPage) break; // last page
  }
  return null;
}

/**
 * Set app_metadata.tier for a user. "free" is stored as null so the
 * corder-api tier gate reads "absent -> free" uniformly (matches the
 * /billing test-tier convention). Other keys in app_metadata (role,
 * etc.) are preserved because GoTrue merges app_metadata on PUT.
 */
async function setUserTier(
  userId: string,
  tier: "free" | "pro" | "max",
  env: Env
): Promise<void> {
  const appMeta = tier === "free" ? { tier: null } : { tier };
  const resp = await fetch(
    `${env.SUPABASE_URL}/auth/v1/admin/users/${encodeURIComponent(userId)}`,
    {
      method: "PUT",
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE ?? "",
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE ?? ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ app_metadata: appMeta }),
    }
  );
  if (!resp.ok) {
    const t = await resp.text().catch(() => "");
    throw new Error(`supabase tier PUT ${resp.status}: ${t.slice(0, 200)}`);
  }
}

type VerifyResult = { ok: true } | { ok: false; reason: string };

/**
 * Verify the Paddle-Signature header using HMAC-SHA256.
 *
 * Header format: "ts=<unix_ts>;h1=<hex_hmac_sha256>". The HMAC is
 * computed over `${ts}:${rawBody}` with the destination secret as the
 * key. Granular failure reasons let the caller log enough to debug a
 * misconfigured destination without leaking the secret.
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
 * Constant-time string comparison. A naive `a === b` short-circuits on
 * the first differing char and leaks timing info. Cloudflare's
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
