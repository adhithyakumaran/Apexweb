import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "CMS Login",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f6f9] px-4 dark:bg-[#0b0f14]">
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-8 shadow-xl">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-orange">
          Private CMS
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Sign in to Content Studio</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Authorized editors only. Set <code className="rounded bg-muted px-1">CMS_ADMIN_PASSWORD</code>{" "}
          in your environment.
        </p>
        <div className="mt-8">
          <LoginForm nextPath={next || "/admin"} />
        </div>
      </div>
    </main>
  );
}
