"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const COOKIE_NAME = "visitor_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 tahun

/**
 * Generate UUID v4 menggunakan Web Crypto API yang aman.
 * Tersedia di semua browser modern dan Node.js 15+.
 */
function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Baca cookie berdasarkan nama.
 * Tidak membaca query param atau localStorage - hanya cookie.
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? match.split("=")[1] : null;
}

/**
 * Set cookie dengan konfigurasi aman.
 * SameSite=Lax: lindungi CSRF tanpa memblokir navigasi normal.
 * Path=/: berlaku untuk seluruh domain.
 */
function setCookie(name: string, value: string, maxAge: number): void {
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

/**
 * UUID v4 regex untuk validasi sebelum dikirim ke server.
 */
const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * VisitorTracker
 *
 * Komponen tidak-tampak (invisible) yang:
 * 1. Membaca cookie 'visitor_id' — jika belum ada, generate UUID baru dan set cookie
 * 2. Mengirim POST /api/track dengan visitorId dan path saat ini
 * 3. Berjalan satu kali per navigasi halaman
 *
 * Tidak menyimpan nama, email, IP, atau data pribadi lainnya.
 */
export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Jalankan hanya di client side
    if (typeof window === "undefined") return;

    // Baca atau buat visitor_id
    let visitorId = getCookie(COOKIE_NAME);
    if (!visitorId || !UUID_V4_REGEX.test(visitorId)) {
      // Cookie belum ada atau tidak valid — buat baru
      visitorId = generateUUID();
      setCookie(COOKIE_NAME, visitorId, COOKIE_MAX_AGE);
    }

    // Kirim tracking ke server — fire-and-forget (tidak blocking UI)
    // Gunakan try-catch agar error network tidak crash halaman
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // timeout 5 detik

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId, path: pathname }),
      signal: controller.signal,
    })
      .catch(() => {
        // Silent fail — tracking error tidak boleh mempengaruhi UX
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // re-run saat pindah halaman

  // Komponen tidak me-render apa pun
  return null;
}
