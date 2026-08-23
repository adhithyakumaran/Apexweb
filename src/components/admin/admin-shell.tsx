"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "Articles", icon: FileText },
];

type AdminShellProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
};

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-0.5">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className={cn("size-4", active && "text-brand-orange")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children, title, description, actions }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/cms/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const sidebar = (
    <>
      <div className="border-b border-white/8 px-5 py-6">
        <Link href="/admin" className="block" onClick={() => setMobileOpen(false)}>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-orange text-[11px] font-bold tracking-tight text-white">
              AN
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight text-white">Apex Node</p>
              <p className="text-[0.62rem] uppercase tracking-[0.18em] text-neutral-500">
                Content Studio
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div className="flex-1 p-4">
        <p className="mb-2 px-3 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
          Workspace
        </p>
        <SidebarNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />

        <div className="mt-6 px-1">
          <Button
            asChild
            className="h-10 w-full justify-start gap-2 rounded-lg bg-brand-orange text-white shadow-sm hover:bg-brand-orange/90"
          >
            <Link href="/admin/articles/new" onClick={() => setMobileOpen(false)}>
              <Plus className="size-4" />
              New article
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-1 border-t border-white/8 p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="size-4" />
          View live site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#ececee] text-foreground">
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-brand-orange text-[10px] font-bold text-white">
            AN
          </span>
          <span className="text-sm font-semibold">Content Studio</span>
        </div>
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="mx-auto flex min-h-screen max-w-[1520px]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-[17.5rem] flex-col bg-[#09090b] transition-transform lg:static lg:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebar}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
            <div className="flex flex-wrap items-start justify-between gap-4 px-4 py-5 sm:px-8">
              <div>
                {title && (
                  <h1 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-neutral-500">
                    {description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">{actions}</div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
