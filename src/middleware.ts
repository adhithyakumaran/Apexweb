/**
 * CMS route protection middleware.
 *
 * Guards all `/admin/*` pages and `/api/cms/*` routes. Unauthenticated
 * browser requests redirect to `/admin/login`; API requests return 401.
 *
 * Session verification uses edge-compatible HMAC checks in auth-edge.ts.
 * Login and logout routes are explicitly excluded from the guard.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifyCmsTokenAsync } from "@/lib/cms/auth-edge";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (pathname === "/admin/login" || pathname === "/api/cms/login") {
    if (pathname === "/admin/login" && (await verifyCmsTokenAsync(token))) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  const isProtected =
    pathname.startsWith("/admin") || pathname.startsWith("/api/cms");

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!(await verifyCmsTokenAsync(token))) {
    if (pathname.startsWith("/api/cms")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/cms/:path*"],
};
