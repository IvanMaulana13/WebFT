/**
 * proxy.ts — Next.js 16 Edge-compatible proxy (menggantikan middleware.ts)
 *
 * PENTING: File ini berjalan di Edge Runtime.
 * NextAuth dibuat ulang dari authConfig yang edge-safe (tanpa provider DB/bcrypt).
 * Next-intl middleware mengelola locale-based routing (/id/... dan /en/...) untuk halaman publik.
 */

import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Instance NextAuth yang ringan — hanya untuk validasi JWT di edge runtime
const { auth } = NextAuth(authConfig);

// Instance next-intl middleware untuk locale routing
const intlMiddleware = createMiddleware(routing);

// Di Next.js 16, proxy.ts mengekspor named function "proxy" bukan default export
export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // 1. Proteksi semua route dashboard (tidak ada prefix locale)
  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Redirect user yang sudah login dari halaman login ke dashboard
  if (pathname === "/login") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 3. Delegate public routes to next-intl middleware
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    /*
     * Match semua path KECUALI:
     * - api (API routes, termasuk api/auth, api/users, dll)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - static files with extension (e.g. .png, .jpg, .svg, .pdf)
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\..*).*)",
  ],
};
