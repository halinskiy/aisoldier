"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@kit/components/ui/Button";
import { EyebrowLabel } from "@kit/components/section/EyebrowLabel";
import { cn } from "@kit/lib/cn";
import { EASE_OUT } from "@kit/lib/motion";

import { submitContact } from "@/app/actions/submitContact";
import { contactSchema, type ContactInput } from "@/lib/contactSchema";
import { DARK_SCOPE } from "@/lib/darkScope";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/template-design/src/components/sections/Contact.tsx";

/**
 * Section 11 — Contact form.
 *
 * **First dark section in the project.** Architecturally significant:
 * validates that kit components render purely from CSS variable tokens.
 * Any hardcoded color in the kit would be exposed here — fixed during
 * the session 13 audit (`Button` primary hardcoded `#212121` → token).
 *
 * Layout: `501fr 200fr 676fr` canonical grid (reused from every 2-col
 * section). Left: eyebrow + H2 + body + secondary info. Right: form.
 */
export function Contact() {
  const { contact } = copy;

  return (
    <section
      id="contact"
      data-component="Contact"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,color-border,color-accent,radius-button,font-serif"
      className="relative w-full"
      style={DARK_SCOPE}
    >
      <div
        className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-8"
        style={{ paddingTop: "clamp(96px,15vh,160px)", paddingBottom: "clamp(96px,15vh,160px)" }}
      >
        <div className="grid grid-cols-1 items-start gap-y-12 lg:grid-cols-[501fr_200fr_676fr] lg:gap-y-0">
          <ContactLead
            eyebrow={contact.eyebrow}
            headline={contact.headline}
            body={contact.body}
            secondary={contact.secondary}
          />
          <div aria-hidden className="hidden lg:block" />
          <ContactForm contact={contact} />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

type SecondaryLink = { label: string; value: string; href: string };

function ContactLead({
  eyebrow,
  headline,
  body,
  secondary,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  secondary: { email: SecondaryLink; schedule: SecondaryLink };
}) {
  return (
    <div
      data-component="ContactLead"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,color-accent,font-serif"
      className="flex max-w-[501px] flex-col gap-8"
    >
      <EyebrowLabel className="w-fit self-start" dataSource={DATA_SOURCE}>{eyebrow}</EyebrowLabel>

      <h2
        data-motion="blur-reveal"
        className="font-serif font-medium text-[var(--color-text)]"
        style={{
          fontSize: "clamp(36px, 5vw, 56px)",
          lineHeight: "1.05",
          letterSpacing: "-0.026em",
        }}
      >
        {headline}
      </h2>

      <p className="max-w-[480px] text-[16px] leading-[1.55] text-[var(--color-text-muted)]">
        {body}
      </p>

      <dl className="mt-4 flex flex-col gap-6">
        <SecondaryRow item={secondary.email} />
        <SecondaryRow item={secondary.schedule} />
      </dl>
    </div>
  );
}

function SecondaryRow({ item }: { item: SecondaryLink }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-sans text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
        {item.label}
      </dt>
      <dd>
        <a
          href={item.href}
          className="font-sans text-[16px] text-[var(--color-text)] underline decoration-[var(--color-border-strong)] decoration-1 underline-offset-[6px] transition-colors duration-200 hover:text-[var(--color-accent)] hover:decoration-[var(--color-accent)]"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {item.value}
        </a>
      </dd>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

type ContactCopy = typeof copy.contact;

function ContactForm({ contact }: { contact: ContactCopy }) {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactInput>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      consent: false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerMessage(null);
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof ContactInput;
        setError(field, { type: "validate", message: issue.message });
      }
      return;
    }

    setState("submitting");
    try {
      const res = await submitContact(parsed.data);
      if (res.ok) {
        setState("success");
        reset();
      } else {
        setState("error");
        setServerMessage(res.message);
      }
    } catch {
      setState("error");
      setServerMessage("Something went wrong. Please try again.");
    }
  });

  return (
    <div
      data-component="ContactForm"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-surface,color-border,color-text,color-accent,radius-button,radius-window,font-sans"
      className="relative w-full max-w-[676px] rounded-[var(--radius-window)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8 lg:p-10"
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            data-component="ContactSuccess"
            className="flex flex-col gap-4 py-6"
          >
            <h3
              className="font-serif font-medium text-[var(--color-text)]"
              style={{
                fontSize: "clamp(24px, 3vw, 32px)",
                lineHeight: "1.15",
                letterSpacing: "-0.018em",
              }}
            >
              {contact.successHeadline}
            </h3>
            <p className="text-[16px] leading-[1.55] text-[var(--color-text-muted)]">
              {contact.successBody}
            </p>
            <button
              type="button"
              onClick={() => setState("idle")}
              className="mt-4 self-start text-[14px] font-medium text-[var(--color-accent)] underline decoration-[var(--color-accent)] underline-offset-[6px]"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            onSubmit={onSubmit}
            noValidate
            className="flex flex-col gap-6"
          >
            <FieldText
              name="name"
              label={contact.fields.name}
              placeholder={contact.placeholders.name}
              register={register}
              error={errors.name?.message}
              required
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FieldText
                name="email"
                type="email"
                label={contact.fields.email}
                placeholder={contact.placeholders.email}
                register={register}
                error={errors.email?.message}
                required
              />
              <FieldText
                name="phone"
                type="tel"
                label={contact.fields.phone}
                placeholder={contact.placeholders.phone}
                register={register}
                error={errors.phone?.message}
              />
            </div>
            <FieldTextarea
              name="message"
              label={contact.fields.message}
              placeholder={contact.placeholders.message}
              register={register}
              error={errors.message?.message}
              required
            />

            <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-[1.5] text-[var(--color-text-muted)]">
              <input
                type="checkbox"
                {...register("consent")}
                className="mt-1 h-5 w-5 shrink-0 rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-bg)] accent-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
              />
              <span>{contact.fields.consent}</span>
            </label>
            {errors.consent && (
              <p className="-mt-3 text-[12px] text-[#f87171]">{errors.consent.message}</p>
            )}

            {serverMessage && state === "error" && (
              <p className="text-[14px] text-[#f87171]">{serverMessage}</p>
            )}

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="secondary"
                size="lg"
                type="submit"
                disabled={state === "submitting"}
                trailingDot={false}
                magnetic
                dataSource={DATA_SOURCE}
                className="w-full sm:w-auto !bg-white !text-[#1e1e1e] !border-white hover:!bg-[#f0f0f0]"
              >
                {state === "submitting" ? contact.submittingLabel : contact.submitLabel}
              </Button>
              <span className="text-[12px] uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
                One business-day response
              </span>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

type FieldName = keyof ContactInput;
type RegisterType = ReturnType<typeof useForm<ContactInput>>["register"];

const inputBase =
  "w-full rounded-[var(--radius-button)] border bg-[var(--color-bg)] px-4 py-3 text-[16px] " +
  "text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] " +
  "transition-colors duration-150 " +
  "focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]";

function FieldText({
  name,
  label,
  placeholder,
  type = "text",
  register,
  error,
  required,
}: {
  name: FieldName;
  label: string;
  placeholder?: string;
  type?: string;
  register: RegisterType;
  error?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
        {label}
        {required && <span className="ml-1 text-[var(--color-accent)]">*</span>}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={cn(
          inputBase,
          error
            ? "border-[#f87171] focus:border-[#f87171] focus:ring-[#f87171]"
            : "border-[var(--color-border)]",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      />
      {error && <span className="text-[12px] text-[#f87171]">{error}</span>}
    </label>
  );
}

function FieldTextarea({
  name,
  label,
  placeholder,
  register,
  error,
  required,
}: {
  name: FieldName;
  label: string;
  placeholder?: string;
  register: RegisterType;
  error?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
        {label}
        {required && <span className="ml-1 text-[var(--color-accent)]">*</span>}
      </span>
      <textarea
        rows={5}
        placeholder={placeholder}
        {...register(name)}
        className={cn(
          inputBase,
          "resize-y",
          error
            ? "border-[#f87171] focus:border-[#f87171] focus:ring-[#f87171]"
            : "border-[var(--color-border)]",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      />
      {error && <span className="text-[12px] text-[#f87171]">{error}</span>}
    </label>
  );
}
