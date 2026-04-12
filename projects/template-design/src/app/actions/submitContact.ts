"use server";

import { contactSchema, type ContactInput, type ContactResult } from "@/lib/contactSchema";

/**
 * Contact form server action — PLACEHOLDER.
 *
 * Validates the submission via Zod and logs to the server console.
 * Returns `{ ok: true }` after a simulated network delay.
 *
 * 🟡 Flagged in HANDOFF.md: wire to a real email / CRM backend before
 * publishing. The Webflow rebuild should replace this entirely.
 */
export async function submitContact(raw: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Validation failed.",
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 450));

  console.log("[submitContact] received", {
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || "(none)",
    messagePreview: parsed.data.message.slice(0, 80),
    consent: parsed.data.consent,
    timestamp: new Date().toISOString(),
  });

  return {
    ok: true,
    message: "Thanks — we'll respond within one business day.",
  };
}
