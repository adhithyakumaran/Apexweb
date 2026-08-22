"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation/contact";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  async function onSubmit(values: ContactFormValues) {
    setStatus("submitting");
    try {
      // PLACEHOLDER SUBMIT — no backend endpoint exists yet. Wire this to a
      // real API route (e.g. src/app/api/contact/route.ts) or a Payload
      // form-submission collection once Payload CMS is installed (handover
      // Section 18, Phase 3 — not started as of this handover). Currently
      // this just simulates a delay so the form is testable end-to-end.
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Contact form submission (not yet sent anywhere):", values);
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="name"
            {...register("name")}
            className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            placeholder="Your name"
          />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            placeholder="you@company.com"
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="company" className="text-sm font-medium text-foreground">
          Company <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          id="company"
          {...register("company")}
          className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          placeholder="Your company"
        />
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          placeholder="Tell us what you're looking for..."
        />
        {errors.message && (
          <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={status === "submitting"} className="w-fit">
        {status === "submitting" ? "Sending..." : "Send message"}
      </Button>

      {status === "success" && (
        <p className="text-sm text-success">Thanks — we&apos;ll get back to you shortly.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}