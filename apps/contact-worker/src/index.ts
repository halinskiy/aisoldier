/**
 * Corder contact form worker.
 *
 * Cloudflare Worker that accepts {email, subject, message, source}
 * from the landing's contact form and forwards the message to the
 * maker via Resend's transactional email API. Replaces the previous
 * mailto: flow -- the user fills the form on getcorder.com and the
 * message lands directly in the maker's inbox without opening any
 * mail client.
 *
 * Contract matches src/components/contact/ContactForm.tsx:
 *   POST /
 *   body: {
 *     "email":   "user@host.tld",
 *     "subject": "Corder for teams: Acme Inc",
 *     "message": "Long-form text from the textarea",
 *     "source":  "Corder for teams" | "contact"
 *   }
 *   200 { "ok": true }
 *   400 { "ok": false, "error": "invalid_email" | "invalid_message" | "invalid_json" }
 *   500 { "ok": false, "error": "server_error" }
 *
 * Deploy:
 *   cd apps/contact-worker
 *   npm install
 *   npx wrangler login
 *   npx wrangler secret put RESEND_API_KEY    -- re_xxx
 *   npx wrangler secret put TO_ADDRESS        -- hello@getcorder.com
 *   npx wrangler secret put FROM_ADDRESS      -- noreply@getcorder.com (or a verified Resend sender)
 *   npx wrangler secret put ALLOWED_ORIGIN    -- https://getcorder.com
 *   npx wrangler deploy
 *
 * Custom domain binding (Cloudflare dashboard -> Workers & Pages ->
 * corder-contact -> Settings -> Triggers -> Custom Domains):
 *   api.getcorder.com/contact
 *
 * Then set in Vercel for the landing:
 *   NEXT_PUBLIC_CONTACT_ENDPOINT = https://api.getcorder.com/contact
 */

export interface Env {
  RESEND_API_KEY: string;
  TO_ADDRESS: string;
  FROM_ADDRESS: string;
  ALLOWED_ORIGIN: string;
}

interface ContactPayload {
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  source?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }
    if (request.method !== "POST") {
      return jsonResponse(env, 405, { ok: false, error: "method_not_allowed" });
    }

    let payload: ContactPayload;
    try {
      payload = (await request.json()) as ContactPayload;
    } catch {
      return jsonResponse(env, 400, { ok: false, error: "invalid_json" });
    }

    const email =
      typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
    const subject = typeof payload.subject === "string" ? payload.subject.trim() : "";
    const message = typeof payload.message === "string" ? payload.message.trim() : "";
    const source = typeof payload.source === "string" ? payload.source : "contact";

    if (!EMAIL_RE.test(email)) {
      return jsonResponse(env, 400, { ok: false, error: "invalid_email" });
    }
    if (message.length < 4) {
      return jsonResponse(env, 400, { ok: false, error: "invalid_message" });
    }

    const finalSubject = subject || "[Corder] Contact form";
    const plain = [
      `Source: ${source}`,
      `Reply-To: ${email}`,
      "",
      message,
    ].join("\n");
    const html = [
      `<p><strong>Source:</strong> ${escapeHtml(source)}<br>`,
      `<strong>Reply-To:</strong> ${escapeHtml(email)}</p>`,
      `<pre style="font-family:ui-sans-serif,system-ui,sans-serif;white-space:pre-wrap;font-size:14px;line-height:1.55">${escapeHtml(message)}</pre>`,
    ].join("");

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: env.FROM_ADDRESS,
        to: env.TO_ADDRESS,
        reply_to: email,
        subject: finalSubject,
        text: plain,
        html,
      }),
    });

    if (resendRes.ok) {
      return jsonResponse(env, 200, { ok: true });
    }
    return jsonResponse(env, 500, { ok: false, error: "server_error" });
  },
};
