"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type LoginFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath = "/admin" }: LoginFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/cms/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!response.ok) {
      setError("Invalid password. Please try again.");
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-neutral-900">
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your CMS password"
            required
            className={cn(
              "flex h-12 w-full rounded-xl border border-neutral-200 bg-white pr-4 pl-10 text-sm text-neutral-900",
              "outline-none transition-colors placeholder:text-neutral-400",
              "focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/5"
            )}
          />
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 text-sm font-medium text-white",
          "transition-colors hover:bg-neutral-800 disabled:opacity-60"
        )}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            Sign in to Content Studio
            <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
