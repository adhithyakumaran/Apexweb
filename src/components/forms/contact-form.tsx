"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Building2, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation/contact";
import { cn } from "@/lib/utils";

const fields = [
  { id: "name", label: "Full name", icon: User, type: "text", placeholder: "Jane Doe" },
  { id: "email", label: "Work email", icon: Mail, type: "email", placeholder: "you@company.com" },
] as const;

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
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Contact form submission (not yet sent anywhere):", values);
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  const inputClass = cn(
    "w-full rounded-xl border border-border/80 bg-surface/50 px-4 py-3 pl-11 text-sm text-foreground outline-none",
    "transition-all duration-200 placeholder:text-muted-foreground/70",
    "focus:border-brand-orange/50 focus:bg-background focus:ring-2 focus:ring-brand-orange/15"
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const Icon = field.icon;
          const error = errors[field.id as keyof ContactFormValues];
          return (
            <div key={field.id}>
              <label htmlFor={field.id} className="text-sm font-medium text-foreground">
                {field.label}
              </label>
              <div className="relative mt-2">
                <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id={field.id}
                  type={field.type}
                  {...register(field.id)}
                  className={inputClass}
                  placeholder={field.placeholder}
                />
              </div>
              {error && <p className="mt-1.5 text-xs text-destructive">{error.message}</p>}
            </div>
          );
        })}
      </div>

      <div>
        <label htmlFor="company" className="text-sm font-medium text-foreground">
          Company <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <div className="relative mt-2">
          <Building2 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="company"
            {...register("company")}
            className={inputClass}
            placeholder="Your company name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          How can we help?
        </label>
        <div className="relative mt-2">
          <MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
          <textarea
            id="message"
            rows={5}
            {...register("message")}
            className={cn(inputClass, "resize-none pt-3 pl-11")}
            placeholder="Tell us about your QA goals, stack, and timeline..."
          />
        </div>
        {errors.message && (
          <p className="mt-1.5 text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting"}
          className="gap-2 bg-foreground text-background hover:bg-foreground/90"
        >
          {status === "submitting" ? (
            "Sending..."
          ) : (
            <>
              Send message
              <Send className="size-4" />
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          We typically respond within one business day.
        </p>
      </div>

      {status === "success" && (
        <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          Thanks — we&apos;ll get back to you shortly.
        </div>
      )}
      {status === "error" && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Something went wrong. Please try again.
        </div>
      )}
    </form>
  );
}
