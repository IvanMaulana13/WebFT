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
  visitorLogs,
} from "@/lib/db/schema";
import { and, isNull, asc, desc, eq, sql } from "drizzle-orm";

/**
 * Helper untuk mengambil data publik langsung dari database.
 *
 * Semua endpoint GET memerlukan session auth, sehingga request dari
 * Server Component (tanpa cookie) selalu mendapat 401. Karena itu
 * kita langsung query DB dengan filter yang IDENTIK dengan API handler:
 *   - AND(isNull(deletedAt), ...) → exclude soft-deleted records
 *   - AND status = 'published'    → hanya data yang dipublikasikan
 *   - Urutan sesuai API masing-masing
 */
export async function fetchPublicData<T>(path: string): Promise<T | null> {

  // ── Direct DB query (primary path untuk halaman publik) ──
  // Semua query menggunakan filter yang IDENTIK dengan API handler:
  // - isNull(*.deletedAt) → exclude soft-deleted records
  // - status filter → hanya tampilkan yang published
  // - urutan sesuai API
  try {
    if (path.includes("/api/settings")) {
      const [record] = await db.select().from(siteSettings).limit(1);
      return (record ?? null) as T;
    }

    if (path.includes("/api/informasi")) {
      // Filter: deletedAt IS NULL AND status='published' + order orderIndex ASC
      const records = await db
        .select()
        .from(informasi)
        .where(and(isNull(informasi.deletedAt), eq(informasi.status, "published")))
        .orderBy(asc(informasi.orderIndex), asc(informasi.createdAt));
      return records as T;
    }

    if (path.startsWith("/api/berita/")) {
      const slug = path.replace("/api/berita/", "").trim();
      const [record] = await db
        .select()
        .from(berita)
        .where(
          and(
            eq(berita.slug, decodeURIComponent(slug)),
            eq(berita.status, "published"),
            isNull(berita.deletedAt)
          )
        )
        .limit(1);
      return (record ?? null) as T;
    }

    if (path.includes("/api/berita")) {
      // Filter: deletedAt IS NULL AND status='published' + order publishedAt DESC
      // PENTING: kedua kondisi harus AND — berita yg di-soft-delete tidak boleh muncul
      // meski sebelumnya berstatus 'published'
      const records = await db
        .select()
        .from(berita)
        .where(and(isNull(berita.deletedAt), eq(berita.status, "published")))
        .orderBy(desc(berita.publishedAt), desc(berita.createdAt));
      return records as T;
    }

    if (path.startsWith("/api/prestasi/")) {
      const idStr = path.replace("/api/prestasi/", "").trim();
      const id = parseInt(idStr, 10);
      if (isNaN(id)) return null;
      const [record] = await db
        .select()
        .from(prestasi)
        .where(and(eq(prestasi.id, id), isNull(prestasi.deletedAt)))
        .limit(1);
      return (record ?? null) as T;
    }

    if (path.includes("/api/prestasi")) {
      // Identik dengan GET /api/prestasi: filter deletedAt IS NULL + order year DESC
      const records = await db
        .select()
        .from(prestasi)
        .where(isNull(prestasi.deletedAt))
        .orderBy(desc(prestasi.year), desc(prestasi.createdAt));
      return records as T;
    }

    if (path.includes("/api/kemitraan")) {
      // Identik dengan GET /api/kemitraan: filter deletedAt IS NULL + order orderIndex ASC
      const records = await db
        .select()
        .from(kemitraan)
        .where(isNull(kemitraan.deletedAt))
        .orderBy(asc(kemitraan.orderIndex), asc(kemitraan.createdAt));
      return records as T;
    }

    if (path.includes("/api/pimpinan")) {
      // Filter deletedAt IS NULL
      const records = await db
        .select()
        .from(pimpinanFakultas)
        .where(isNull(pimpinanFakultas.deletedAt))
        .orderBy(asc(pimpinanFakultas.createdAt));
      return records as T;
    }

    if (path.includes("/api/struktur-organisasi")) {
      const [record] = await db.select().from(strukturOrganisasi).limit(1);
      return (record ?? null) as T;
    }

    if (path.includes("/api/dosen")) {
      // Filter deletedAt IS NULL
      const records = await db
        .select()
        .from(dosen)
        .where(isNull(dosen.deletedAt))
        .orderBy(asc(dosen.name));
      return records as T;
    }

    if (path.includes("/api/tenaga-pendidikan")) {
      // Filter deletedAt IS NULL
      const records = await db
        .select()
        .from(tenagaPendidikan)
        .where(isNull(tenagaPendidikan.deletedAt))
        .orderBy(asc(tenagaPendidikan.name));
      return records as T;
    }
  } catch (dbErr) {
    console.error(`[public-api] DB query error for ${path}:`, dbErr);
  }

  return null;
}

export async function fetchPublicBeritaBySlug(slug: string) {
  return fetchPublicData<typeof berita.$inferSelect>(`/api/berita/${encodeURIComponent(slug)}`);
}

export async function fetchPublicPrestasiById(id: number | string) {
  return fetchPublicData<typeof prestasi.$inferSelect>(`/api/prestasi/${id}`);
}

/**
 * Mengambil total pengunjung unik langsung dari database.
 * Dipakai oleh footer (Server Component) — COUNT(DISTINCT) langsung di DB.
 */
export async function fetchPublicVisitorStats(): Promise<{
  totalVisitors: number;
  todayVisitors: number;
}> {
  try {
    const [total, today] = await Promise.all([
      db
        .select({ count: sql<number>`COUNT(DISTINCT visitor_id)` })
        .from(visitorLogs),
      db
        .select({ count: sql<number>`COUNT(DISTINCT visitor_id)` })
        .from(visitorLogs)
        .where(sql`DATE(created_at) = CURDATE()`),
    ]);
    return {
      totalVisitors: Number(total[0]?.count ?? 0),
      todayVisitors: Number(today[0]?.count ?? 0),
    };
  } catch (err) {
    console.error("[public-api] fetchPublicVisitorStats error:", err);
    return { totalVisitors: 0, todayVisitors: 0 };
  }
}
