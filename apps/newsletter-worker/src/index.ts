/**
 * Corder newsletter worker.
 *
 * Single-route Cloudflare Worker that accepts {email, source} from the
 * landing page subscribe forms and adds the address to a Resend
 * Audience (https://resend.com/docs/api-reference/audiences).
 *
 * Contract matches src/lib/newsletter.ts on the landing:
 *   POST /
 *   body: { "email": "user@host.tld", "source": "landing-floating" | "landing-static" }
 *   200 { "ok": true }
 *   400 { "ok": false, "error": "invalid_email" }
 *   409 { "ok": false, "error": "already_subscribed" }
 *   500 { "ok": false, "error": "server_error" }
 *
 * Deploy:
 *   wrangler deploy
 *   wrangler secret put RESEND_API_KEY   -- paste re_xxx
 *   wrangler secret put RESEND_AUDIENCE_ID  -- paste UUID from Resend dashboard
 *   wrangler secret put ALLOWED_ORIGIN   -- https://getcorder.com
 *
 * The Worker assumes a `routes` entry in wrangler.toml that maps
 * api.getcorder.com/newsletter to this script.
 */

export interface Env {
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID: string;
  ALLOWED_ORIGIN: string;
}

interface SubscribePayload {
  email?: unknown;
  source?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const VALID_SOURCES = new Set(["landing-floating", "landing-static"]);

function corsHeaders(env: Env): Record<string, string> {
  return {
    "access-control-allow-origin": env.ALLOWED_ORIGIN,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    vary: "origin",
  };
}

function jsonResponse(
  env: Env,
  status: number,
  body: Record<string, unknown>
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      ...corsHeaders(env),
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }
    if (request.method !== "POST") {
      return jsonResponse(env, 405, { ok: false, error: "method_not_allowed" });
    }

    let payload: SubscribePayload;
    try {
      payload = (await request.json()) as SubscribePayload;
    } catch {
      return jsonResponse(env, 400, { ok: false, error: "invalid_json" });
    }

    const email =
      typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
    const source = typeof payload.source === "string" ? payload.source : "";

    if (!EMAIL_RE.test(email)) {
      return jsonResponse(env, 400, { ok: false, error: "invalid_email" });
    }
    if (!VALID_SOURCES.has(source)) {
      return jsonResponse(env, 400, { ok: false, error: "invalid_source" });
    }

    // Forward to Resend Audiences.
    // https://resend.com/docs/api-reference/audiences/create-contact
    const resendRes = await fetch(
      `https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.RESEND_API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
        }),
      }
    );

    if (resendRes.ok) {
      return jsonResponse(env, 200, { ok: true });
    }

    // Resend returns 422 when the email already exists in the audience.
    // The landing UI treats 409 as success, so map 422 -> 409.
    if (resendRes.status === 422) {
      return jsonResponse(env, 409, { ok: false, error: "already_subscribed" });
    }

    // Anything else (rate limit, auth failure, network) is a server error
    // from the client's perspective.
    return jsonResponse(env, 500, { ok: false, error: "server_error" });
  },
};
