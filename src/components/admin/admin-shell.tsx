"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  ChevronRight,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  ScrollText,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Logo } from "@/components/navigation/logo";
import { adminClasses } from "@/components/admin/admin-theme";
import { cn } from "@/lib/utils";

const moduleNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "Articles", icon: FileText },
];

const reportingNav = [
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/logs", label: "Activity logs", icon: ScrollText },
];

type AdminShellProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
};

function NavGroup({
  label,
  items,
  pathname,
  onNavigate,
}: {
  label: string;
  items: typeof moduleNav;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 px-3 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
        {label}
      </p>
      <nav className="space-y-0.5">
        {items.map((item) => {
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
                active ? adminClasses.navActive : adminClasses.navIdle
              )}
            >
              <ChevronRight
                className={cn("size-3.5 opacity-40", active && "opacity-80")}
              />
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function AdminShell({ children, title, description, actions }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const today = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    []
  );

  const filteredModule = moduleNav.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );
  const filteredReporting = reportingNav.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  async function handleLogout() {
    await fetch("/api/cms/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const sidebar = (
    <>
      <div className="relative overflow-hidden border-b border-white/[0.06] px-5 pb-5 pt-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]" />
        <div className="relative">
          <Logo href="/admin" variant="light" size="sm" className="group" />
          <p className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#6b7280]">
            Content Studio
          </p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#6b7280]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="h-10 w-full rounded-lg border border-white/[0.06] bg-[#1a1b1f] pr-3 pl-9 text-sm text-white outline-none placeholder:text-[#6b7280] focus:border-[#3B82F6]/40 focus:ring-2 focus:ring-[#3B82F6]/15"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {filteredModule.length > 0 && (
          <NavGroup
            label="Modules"
            items={filteredModule}
            pathname={pathname}
            onNavigate={() => setMobileOpen(false)}
          />
        )}
        {filteredReporting.length > 0 && (
          <NavGroup
            label="Reporting"
            items={filteredReporting}
            pathname={pathname}
            onNavigate={() => setMobileOpen(false)}
          />
        )}

        <Link
          href="/admin/articles/new"
          onClick={() => setMobileOpen(false)}
          className={cn(adminClasses.primaryBtn, "w-full")}
        >
          <Plus className="size-4" />
          New article
        </Link>
      </div>

      <div className="space-y-0.5 border-t border-white/[0.06] p-4">
        <Link
          href="/"
          target="_blank"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
            adminClasses.navIdle
          )}
        >
          <ExternalLink className="size-4" />
          View live site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
            adminClasses.navIdle
          )}
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className={cn(adminClasses.page, "admin-cms-dark")} style={{ colorScheme: "dark" }}>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-[#121316] px-4 py-3 lg:hidden">
        <Logo href="/admin" variant="light" size="sm" />
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg p-2 text-[#9CA3AF] hover:bg-white/[0.05]"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-[17.5rem] flex-col border-r border-white/[0.06] bg-[#121316] transition-transform lg:static lg:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebar}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#1A1B1E]/95 backdrop-blur-md">
            <div className="flex flex-wrap items-start justify-between gap-4 px-4 py-5 sm:px-8">
              <div>
                <p className="text-xs text-[#9CA3AF]">{today}</p>
                {title && (
                  <h1 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#9CA3AF]">
                    {description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 [&_a]:rounded-lg [&_a]:bg-[#3B82F6] [&_a]:text-white [&_a]:hover:bg-[#2563EB] [&_button]:rounded-lg">
                {actions}
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8 [&_input:not([type=checkbox])]:border-white/[0.08] [&_input:not([type=checkbox])]:bg-[#1e1f24] [&_input:not([type=checkbox])]:text-white [&_input:not([type=checkbox])]:placeholder:text-[#6b7280] [&_label]:text-[#9CA3AF] [&_select]:border-white/[0.08] [&_select]:bg-[#1e1f24] [&_select]:text-white [&_textarea]:border-white/[0.08] [&_textarea]:bg-[#1e1f24] [&_textarea]:text-white">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
