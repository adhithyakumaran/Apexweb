"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bot,
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

const mainNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/logs", label: "Logs", icon: ScrollText },
  { href: "/admin/chatbot", label: "Chat Bot", icon: Bot },
];

type AdminShellProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
};

function SidebarNav({
  items,
  pathname,
  onNavigate,
}: {
  items: typeof mainNav;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-0.5 px-2">
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
              "flex items-center gap-2.5 rounded px-2 py-1.5 text-[13px] font-normal transition-colors",
              active ? adminClasses.navActive : adminClasses.navIdle
            )}
          >
            <Icon className="size-4 shrink-0 opacity-70" strokeWidth={1.5} />
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
  const [search, setSearch] = useState("");

  const filteredNav = useMemo(
    () => mainNav.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  async function handleLogout() {
    await fetch("/api/cms/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const sidebar = (
    <>
      <div className="border-b border-[#333] px-4 py-4">
        <Logo href="/admin" variant="light" size="sm" className="group" />
      </div>

      <div className="px-3 py-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-[#666]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find…"
            className="h-8 w-full rounded border border-[#333] bg-black pr-8 pl-8 text-[13px] text-[#ededed] outline-none placeholder:text-[#666] focus:border-[#666]"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-[#333] px-1 text-[10px] text-[#666]">
            F
          </kbd>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        <SidebarNav
          items={filteredNav}
          pathname={pathname}
          onNavigate={() => setMobileOpen(false)}
        />
      </div>

      <div className="space-y-0.5 border-t border-[#333] p-2">
        <Link
          href="/admin/articles/new"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-2.5 rounded px-2 py-1.5 text-[13px] transition-colors",
            adminClasses.navIdle
          )}
        >
          <Plus className="size-4 shrink-0 opacity-70" strokeWidth={1.5} />
          New article
        </Link>
        <Link
          href="/"
          target="_blank"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-2.5 rounded px-2 py-1.5 text-[13px] transition-colors",
            adminClasses.navIdle
          )}
        >
          <ExternalLink className="size-4 shrink-0 opacity-70" strokeWidth={1.5} />
          View live site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-left text-[13px] transition-colors",
            adminClasses.navIdle
          )}
        >
          <LogOut className="size-4 shrink-0 opacity-70" strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className={cn(adminClasses.page, "admin-cms font-[family-name:var(--font-admin)]")} style={{ colorScheme: "dark" }}>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#333] bg-black px-4 py-2.5 lg:hidden">
        <Logo href="/admin" variant="light" size="sm" />
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded p-1.5 text-[#a1a1a1] hover:bg-[#111] hover:text-white"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-[#333] bg-black transition-transform lg:static lg:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebar}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-[#333] bg-black">
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
              <div className="min-w-0">
                {title && (
                  <h1 className="text-xl font-medium tracking-tight text-[#ededed]">{title}</h1>
                )}
                {description && (
                  <p className="mt-1 max-w-2xl text-[13px] text-[#666]">{description}</p>
                )}
              </div>
              {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
            </div>
          </header>

          <main className="flex-1 px-6 py-6 [&_input:not([type=checkbox])]:h-8 [&_input:not([type=checkbox])]:rounded [&_input:not([type=checkbox])]:border-[#333] [&_input:not([type=checkbox])]:bg-black [&_input:not([type=checkbox])]:text-[13px] [&_input:not([type=checkbox])]:text-[#ededed] [&_input:not([type=checkbox])]:placeholder:text-[#666] [&_label]:text-[13px] [&_label]:text-[#a1a1a1] [&_select]:rounded [&_select]:border-[#333] [&_select]:bg-black [&_select]:text-[13px] [&_select]:text-[#ededed] [&_textarea]:rounded [&_textarea]:border-[#333] [&_textarea]:bg-black [&_textarea]:text-[13px] [&_textarea]:text-[#ededed]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
