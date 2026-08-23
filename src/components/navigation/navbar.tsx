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
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="relative mx-auto flex h-16 max-w-350 items-center px-4 lg:px-8">
        <div className="flex items-center gap-10">
          <Logo />
          <DesktopNavLinks />
        </div>

        <div className="ml-auto hidden items-center gap-4 md:flex">
          <SearchBar />
          <Button asChild variant="default" size="lg">
            <Link href={tryItCta.href}>{tryItCta.label}</Link>
          </Button>
          <LetsTalkMenu />
          <ThemeToggle />
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
