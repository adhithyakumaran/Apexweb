"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Files, MessageSquareText, FileClock } from "lucide-react";
const links = [
  { label: "Releases", path: "/development", icon: Files },
  {
    label: "Reports",
    path: "/development/reports",
    icon: MessageSquareText,
  },
  { label: "Progress", path: "/development/progress", icon: FileClock },
];
export function HubNavigation() {
  const pathname = usePathname();
  return (
    <header className="hub-header">
      <div className="hub-header-inner">
        <Link href="/development" className="hub-brand">
          <span className="hub-brand-icon">
            <Package size={19} aria-hidden="true" />
          </span>
          <span>
            TestBuddy <span className="hub-brand-light">Hub</span>
          </span>
        </Link>
        <span className="hub-shared">Development space</span>
      </div>
      <nav aria-label="Development" className="hub-navigation">
        <div>
          {links.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              href={path}
              aria-current={
                (
                  path === "/development"
                    ? pathname === path ||
                      pathname.startsWith("/development/releases")
                    : pathname === path
                )
                  ? "page"
                  : undefined
              }
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
