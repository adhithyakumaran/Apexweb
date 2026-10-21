"use client";
import Link from "next/link";
import { Layers3, Package, MessageSquareText, FileClock } from "lucide-react";
export function HubNavigation() {
  return (
    <header className="hub-header">
      <div className="hub-header-inner">
        <Link href="/development" className="hub-brand">
          <span className="hub-brand-icon">
            <Layers3 size={21} aria-hidden="true" />
          </span>
          <span>
            TestBuddy <span className="hub-brand-light">Hub</span>
          </span>
        </Link>
        <nav aria-label="Development" className="hub-navigation">
          <Link href="/development#releases">
            <Package size={15} aria-hidden="true" />
            Releases
          </Link>
          <Link href="/development#reports">
            <MessageSquareText size={15} aria-hidden="true" />
            Reports
          </Link>
          <Link href="/development#progress">
            <FileClock size={15} aria-hidden="true" />
            Progress
          </Link>
        </nav>
      </div>
    </header>
  );
}
