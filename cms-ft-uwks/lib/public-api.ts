import { headers } from "next/headers";
import { db } from "@/lib/db";
import {
  siteSettings,
  informasi,
  berita,
  prestasi,
  kemitraan,
  pimpinanFakultas,
  strukturOrganisasi,
  dosen,
  tenagaPendidikan,
} from "@/lib/db/schema";
import { sql } from "drizzle-orm";

/**
 * Helper function for fetching public data from API routes in Server Components.
 * Uses HTTP fetch first as instructed. If API requires auth or returns 401,
 * it seamlessly queries the database directly as a fallback.
 */
export async function fetchPublicData<T>(path: string): Promise<T | null> {
  try {
    let baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    try {
      const headersList = await headers();
      const host = headersList.get("host");
      const protocol = headersList.get("x-forwarded-proto") || "http";
      if (host) {
        baseUrl = `${protocol}://${host}`;
      }
    } catch {
      // Static build time
    }

    const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    const res = await fetch(url, {
      next: { revalidate: 10 },
    });

    if (res.ok) {
      const json = await res.json();
      return (json.data ?? json) as T;
    }
  } catch (error) {
    console.warn(`[public-api] Fetch error for ${path}:`, error);
  }

  // Fallback direct DB query if API endpoint returned 401 or was unreachable
  try {
    if (path.includes("/api/settings")) {
      const [record] = await db.select().from(siteSettings).limit(1);
      return (record ?? null) as T;
    }
    if (path.includes("/api/informasi")) {
      const records = await db.select().from(informasi);
      return records as T;
    }
    if (path.includes("/api/berita")) {
      const records = await db.select().from(berita);
      return records as T;
    }
    if (path.includes("/api/prestasi")) {
      const records = await db.select().from(prestasi);
      return records as T;
    }
    if (path.includes("/api/kemitraan")) {
      const records = await db.select().from(kemitraan);
      return records as T;
    }
    if (path.includes("/api/pimpinan")) {
      const records = await db.select().from(pimpinanFakultas);
      return records as T;
    }
    if (path.includes("/api/struktur-organisasi")) {
      const [record] = await db.select().from(strukturOrganisasi).limit(1);
      return (record ?? null) as T;
    }
    if (path.includes("/api/dosen")) {
      const records = await db.select().from(dosen);
      return records as T;
    }
    if (path.includes("/api/tenaga-pendidikan")) {
      const records = await db.select().from(tenagaPendidikan);
      return records as T;
    }
  } catch (dbErr) {
    console.warn(`[public-api] DB fallback error for ${path}:`, dbErr);
  }

  return null;
}
