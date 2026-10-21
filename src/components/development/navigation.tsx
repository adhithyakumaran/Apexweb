"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, FolderOpen } from "lucide-react";
const links = [
  ["Home", ""],
  ["Documents", "/documents"],
  ["Builds", "/builds"],
  ["Progress", "/progress"],
  ["Testing", "/testing"],
  ["Tasks", "/tasks"],
];
export function HubNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="hub-header">
      <div className="hub-header-inner">
        <Link
          href="/development"
          className="hub-brand"
          onClick={() => setOpen(false)}
        >
          <span className="hub-brand-icon">
            <FolderOpen size={19} aria-hidden="true" />
          </span>
          <span>
            TestBuddy <span className="hub-brand-light">Hub</span>
          </span>
        </Link>
        <span className="hub-private">Shared workspace</span>
        <button
          className="hub-menu-button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="hub-navigation"
        >
          {open ? (
            <X size={18} aria-hidden="true" />
          ) : (
            <Menu size={18} aria-hidden="true" />
          )}
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <nav
        aria-label="Development"
        id="hub-navigation"
        className={`hub-navigation ${open ? "is-open" : ""}`}
      >
        <div>
          {links.map(([label, path]) => (
            <Link
              key={label}
              href={`/development${path}`}
              onClick={() => setOpen(false)}
              aria-current={
                pathname === `/development${path}` ? "page" : undefined
              }
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
