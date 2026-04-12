import { z } from "zod";

/**
 * Shared Zod schema for the contact form. Lives outside the server-action
 * file because Next.js 15 requires every export from a `"use server"` file
 * to be an async function — non-function exports (schemas, types) must
 * live in a plain module.
 */
export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Valid email required."),
  phone: z.string().optional(),
  message: z.string().min(10, "Tell us a bit more (10+ characters)."),
  consent: z
    .boolean()
    .refine((v) => v === true, "Please confirm you've read the disclosure."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  | { ok: true; message: string }
  | { ok: false; message: string };
