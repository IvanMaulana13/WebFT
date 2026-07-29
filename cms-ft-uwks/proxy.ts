/**
 * proxy.ts — Next.js 16 Edge-compatible proxy (menggantikan middleware.ts)
 *
 * PENTING: File ini berjalan di Edge Runtime.
 * Jangan import modul yang memerlukan Node.js (bcrypt, mysql2, drizzle, dsb).
 *
 * NextAuth dibuat ulang dari authConfig yang edge-safe (tanpa provider DB/bcrypt).
 * Validasi JWT token tetap bekerja karena menggunakan AUTH_SECRET yang sama.
 */

import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

// Instance NextAuth yang ringan — hanya untuk validasi JWT di edge runtime
const { auth } = NextAuth(authConfig);

// Di Next.js 16, proxy.ts mengekspor named function "proxy" bukan default export
export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Proteksi semua route dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect user yang sudah login dari halaman login ke dashboard
  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match semua path KECUALI:
     * - api (API routes, termasuk api/auth, api/users, dll)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico|public).*)",
  ],
};
