"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Building2, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { helpOptions } from "@/config/contact";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation/contact";
import { cn } from "@/lib/utils";

const fields = [
  { id: "name", label: "Your name", icon: User, type: "text", placeholder: "Your name" },
  { id: "email", label: "Email", icon: Mail, type: "email", placeholder: "you@company.com" },
] as const;

type ContactFormProps = {
  variant?: "card" | "panel";
  showHelpOptions?: boolean;
  submitLabel?: string;
};

export function ContactForm({
  variant = "card",
  showHelpOptions = false,
  submitLabel = "Send message",
}: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [selectedHelp, setSelectedHelp] = useState<string[]>([]);
  const isPanel = variant === "panel";

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
      console.log("Contact form submission (not yet sent anywhere):", {
        ...values,
        interests: selectedHelp,
      });
      setStatus("success");
      reset();
      setSelectedHelp([]);
    } catch {
      setStatus("error");
    }
  }

  function toggleHelp(option: string) {
    setSelectedHelp((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option]
    );
  }

  const inputClass = cn(
    "w-full text-sm outline-none transition-colors duration-200",
    isPanel
      ? "border-0 border-b border-foreground/30 bg-transparent px-0 py-3.5 text-foreground placeholder:text-foreground/50 focus:border-foreground"
      : cn(
          "rounded-xl border border-border/80 bg-surface/50 px-4 py-3 pl-11 text-foreground",
          "placeholder:text-muted-foreground/70 focus:border-brand-orange/50 focus:bg-background focus:ring-2 focus:ring-brand-orange/15"
        )
  );

  const labelClass = cn(
    "text-sm font-medium",
    isPanel ? "text-foreground" : "text-foreground"
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {isPanel && (
        <div className="mb-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70">
            Project inquiry
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem] lg:text-3xl">
            Got ideas? We&apos;ve got the skills.
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80 sm:text-base">
            Tell us about your stack, release cadence, and where quality is slowing you down.
          </p>
        </div>
      )}

      <div className={cn("grid gap-5", !isPanel && "sm:grid-cols-2")}>
        {fields.map((field) => {
          const Icon = field.icon;
          const error = errors[field.id as keyof ContactFormValues];
          return (
            <div key={field.id}>
              {!isPanel && (
                <label htmlFor={field.id} className={labelClass}>
                  {field.label}
                </label>
              )}
              <div className={cn("relative", !isPanel && "mt-2")}>
                {!isPanel && (
                  <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                )}
                <input
                  id={field.id}
                  type={field.type}
                  {...register(field.id)}
                  className={inputClass}
                  placeholder={field.placeholder}
                />
              </div>
              {error && (
                <p className={cn("mt-1.5 text-xs", isPanel ? "text-foreground/90" : "text-destructive")}>
                  {error.message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!isPanel && (
        <div>
          <label htmlFor="company" className={labelClass}>
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
      )}

      {showHelpOptions && (
        <div>
          <p className="text-sm font-semibold text-foreground">How can we help?</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {helpOptions.map((option) => {
              const active = selectedHelp.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleHelp(option)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-200",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/25 bg-foreground/5 text-foreground/90 hover:border-foreground/45 hover:bg-foreground/10"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        {!isPanel && (
          <label htmlFor="message" className={labelClass}>
            How can we help?
          </label>
        )}
        <div className={cn("relative", !isPanel && "mt-2")}>
          {!isPanel && (
            <MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
          )}
          <textarea
            id="message"
            rows={isPanel ? 4 : 5}
            {...register("message")}
            className={cn(inputClass, "resize-none", !isPanel && "pt-3 pl-11")}
            placeholder="Tell us a little about the project..."
          />
        </div>
        {errors.message && (
          <p className={cn("mt-1.5 text-xs", isPanel ? "text-foreground/90" : "text-destructive")}>
            {errors.message.message}
          </p>
        )}
      </div>

      <div className={cn("flex flex-col gap-3", !isPanel && "sm:flex-row sm:items-center sm:justify-between")}>
        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting"}
          className={cn(
            "gap-2",
            isPanel
              ? "w-full rounded-xl bg-foreground py-6 text-background shadow-[0_12px_30px_rgba(0,0,0,0.22)] hover:bg-foreground/92"
              : "bg-foreground text-background hover:bg-foreground/90"
          )}
        >
          {status === "submitting" ? (
            "Sending..."
          ) : (
            <>
              {isPanel ? "Let's get started!" : submitLabel}
              <Send className="size-4" />
            </>
          )}
        </Button>
        {!isPanel && (
          <p className="text-xs text-muted-foreground">
            We typically respond within one business day.
          </p>
        )}
      </div>

      {status === "success" && (
        <div
          className={cn(
            "rounded-xl px-4 py-3 text-sm",
            isPanel
              ? "border border-foreground/20 bg-foreground/10 text-foreground"
              : "border border-success/30 bg-success/10 text-success"
          )}
        >
          Thanks — we&apos;ll get back to you shortly.
        </div>
      )}
      {status === "error" && (
        <div
          className={cn(
            "rounded-xl px-4 py-3 text-sm",
            isPanel
              ? "border border-foreground/20 bg-foreground/10 text-foreground"
              : "border border-destructive/30 bg-destructive/10 text-destructive"
          )}
        >
          Something went wrong. Please try again.
        </div>
      )}
    </form>
  );
}
