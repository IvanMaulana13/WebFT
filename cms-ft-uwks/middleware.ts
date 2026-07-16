import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware Placeholder — Part 0
 *
 * Auth middleware penuh akan diimplementasikan di Part 2 menggunakan Auth.js v5.
 * Saat ini middleware hanya mem-pass semua request tanpa cek session.
 *
 * PENTING: Ganti konten file ini di Part 2 dengan implementasi Auth.js yang sebenarnya.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // TODO (Part 2): Implementasi pengecekan session Auth.js di sini
  // Contoh: jika tidak ada session & pathname startsWith('/dashboard'), redirect ke /login

  // Placeholder: allow all requests for now
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
