import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { SearchBar } from "@/components/navigation/search-bar";
import { Logo } from "@/components/navigation/logo";
import { LetsTalkMenu } from "@/components/navigation/lets-talk-menu";
import { DesktopNavLinks } from "@/components/navigation/desktop-nav-links";
import { tryItCta } from "@/config/navigation";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="safe-top sticky top-0 z-50 w-full min-w-0 border-b border-border/40 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/90">
      <div className="relative mx-auto flex h-14 min-w-0 max-w-350 items-center gap-3 px-4 sm:h-16 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-6">
          <Logo size="sm" className="shrink-0 sm:hidden" />
          <Logo className="hidden shrink-0 sm:inline-flex" />
          <DesktopNavLinks />
        </div>

        <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex lg:gap-3">
          <SearchBar />
          <Button asChild variant="default" size="lg" className="hidden xl:inline-flex">
            <Link href={tryItCta.href}>{tryItCta.label}</Link>
          </Button>
          <Button asChild variant="default" size="default" className="xl:hidden">
            <Link href={tryItCta.href}>Try free</Link>
          </Button>
          <LetsTalkMenu />
          <ThemeToggle />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 lg:hidden">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
