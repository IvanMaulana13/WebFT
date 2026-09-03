import { db } from "@/lib/db";
import {
  siteSettings,
  berita,
  prestasi,
  kemitraan,
  pimpinanFakultas,
  strukturOrganisasi,
  dosen,
  tenagaPendidikan,
  visitorLogs,
  programStudi,
  kalenderAkademik,
  pedomanAkademik,
  jadwalKuliah,
  akreditasi,
  prosedurAkademik,
  ormawa,
  lomba,
  konselingLayanan,
  jadwalKonseling,
} from "@/lib/db/schema";
import { and, isNull, asc, desc, eq, sql, gte } from "drizzle-orm";

/**
 * Helper untuk mengambil data publik langsung dari database.
 */
export async function fetchPublicData<T>(path: string): Promise<T | null> {
  try {
    if (path.includes("/api/settings")) {
      const [record] = await db.select().from(siteSettings).limit(1);
      return (record ?? null) as T;
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
      const isBeasiswa = path.includes("category=beasiswa");
      const isKegiatan = path.includes("category=kegiatan");
      const isBerita = path.includes("category=berita");

      const categoryFilter = isBeasiswa
        ? eq(berita.category, "beasiswa")
        : isKegiatan
        ? eq(berita.category, "kegiatan")
        : isBerita
        ? eq(berita.category, "berita")
        : undefined;

      const records = await db
        .select()
        .from(berita)
        .where(
          and(
            isNull(berita.deletedAt),
            eq(berita.status, "published"),
            categoryFilter
          )
        )
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
      const records = await db
        .select()
        .from(prestasi)
        .where(isNull(prestasi.deletedAt))
        .orderBy(desc(prestasi.year), desc(prestasi.createdAt));
      return records as T;
    }

    if (path.includes("/api/kemitraan")) {
      const isUniversitas = path.includes("kategori_mitra=universitas") || path.includes("kategori=universitas");
      const isLembaga = path.includes("kategori_mitra=lembaga") || path.includes("kategori=lembaga");
      const kategoriFilter = isUniversitas
        ? eq(kemitraan.kategoriMitra, "universitas")
        : isLembaga
        ? eq(kemitraan.kategoriMitra, "lembaga")
        : undefined;

      const records = await db
        .select()
        .from(kemitraan)
        .where(and(isNull(kemitraan.deletedAt), kategoriFilter))
        .orderBy(asc(kemitraan.orderIndex), asc(kemitraan.createdAt));
      return records as T;
    }

    if (path.includes("/api/pimpinan")) {
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
      const records = await db
        .select()
        .from(dosen)
        .where(isNull(dosen.deletedAt))
        .orderBy(asc(dosen.name));
      return records as T;
    }

    if (path.includes("/api/tenaga-pendidikan")) {
      const records = await db
        .select()
        .from(tenagaPendidikan)
        .where(isNull(tenagaPendidikan.deletedAt))
        .orderBy(asc(tenagaPendidikan.name));
      return records as T;
    }

    // ── Akademik ──
    if (path.includes("/api/akademik/kalender")) {
      const [record] = await db.select().from(kalenderAkademik).limit(1);
      return (record ?? null) as T;
    }

    if (path.includes("/api/akademik/pedoman")) {
      const [record] = await db.select().from(pedomanAkademik).limit(1);
      return (record ?? null) as T;
    }

    if (path.includes("/api/akademik/program-studi")) {
      const records = await db.select().from(programStudi).orderBy(asc(programStudi.nama));
      return records as T;
    }

    if (path.includes("/api/akademik/jadwal")) {
      const records = await db
        .select({
          id: jadwalKuliah.id,
          prodiId: jadwalKuliah.prodiId,
          prodiNama: programStudi.nama,
          fileUrl: jadwalKuliah.fileUrl,
          semester: jadwalKuliah.semester,
          tahunAjaran: jadwalKuliah.tahunAjaran,
          createdAt: jadwalKuliah.createdAt,
        })
        .from(jadwalKuliah)
        .leftJoin(programStudi, eq(jadwalKuliah.prodiId, programStudi.id))
        .where(isNull(jadwalKuliah.deletedAt))
        .orderBy(desc(jadwalKuliah.createdAt));
      return records as T;
    }

    if (path.includes("/api/akademik/akreditasi")) {
      const records = await db
        .select({
          id: akreditasi.id,
          prodiId: akreditasi.prodiId,
          prodiNama: programStudi.nama,
          peringkat: akreditasi.peringkat,
          noSk: akreditasi.noSk,
          tanggalBerlaku: akreditasi.tanggalBerlaku,
          fileSertifikat: akreditasi.fileSertifikat,
          createdAt: akreditasi.createdAt,
        })
        .from(akreditasi)
        .leftJoin(programStudi, eq(akreditasi.prodiId, programStudi.id))
        .where(isNull(akreditasi.deletedAt))
        .orderBy(desc(akreditasi.tanggalBerlaku));
      return records as T;
    }

    if (path.includes("/api/akademik/prosedur")) {
      const records = await db
        .select()
        .from(prosedurAkademik)
        .where(isNull(prosedurAkademik.deletedAt))
        .orderBy(asc(prosedurAkademik.createdAt));
      return records as T;
    }

    // ── Kemahasiswaan ──
    if (path.includes("/api/kemahasiswaan/ormawa")) {
      const records = await db
        .select()
        .from(ormawa)
        .where(isNull(ormawa.deletedAt))
        .orderBy(asc(ormawa.createdAt));
      return records as T;
    }

    if (path.includes("/api/kemahasiswaan/lomba")) {
      const records = await db
        .select()
        .from(lomba)
        .where(isNull(lomba.deletedAt))
        .orderBy(asc(lomba.tanggalSelesaiPendaftaran));
      return records as T;
    }

    if (path.includes("/api/kemahasiswaan/konseling")) {
      const [record] = await db
        .select()
        .from(konselingLayanan)
        .where(eq(konselingLayanan.id, 1))
        .limit(1);
      return (record ?? null) as T;
    }

    if (path.includes("/api/kemahasiswaan/jadwal-konseling")) {
      const records = await db
        .select()
        .from(jadwalKonseling)
        .where(
          and(
            isNull(jadwalKonseling.deletedAt),
            eq(jadwalKonseling.status, "tersedia"),
            gte(jadwalKonseling.tanggal, sql`CURDATE()`)
          )
        )
        .orderBy(asc(jadwalKonseling.tanggal), asc(jadwalKonseling.jam));
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

export async function fetchPublicKalender() {
  return fetchPublicData<typeof kalenderAkademik.$inferSelect>("/api/akademik/kalender");
}

export async function fetchPublicPedoman() {
  return fetchPublicData<typeof pedomanAkademik.$inferSelect>("/api/akademik/pedoman");
}

export async function fetchPublicProgramStudi() {
  return fetchPublicData<Array<typeof programStudi.$inferSelect>>("/api/akademik/program-studi");
}

export async function fetchPublicJadwal() {
  return fetchPublicData<
    Array<{
      id: number;
      prodiId: number;
      prodiNama: string | null;
      fileUrl: string;
      semester: "ganjil" | "genap";
      tahunAjaran: string;
      createdAt: Date;
    }>
  >("/api/akademik/jadwal");
}

export async function fetchPublicAkreditasi() {
  return fetchPublicData<
    Array<{
      id: number;
      prodiId: number;
      prodiNama: string | null;
      peringkat: string;
      noSk: string;
      tanggalBerlaku: string;
      fileSertifikat: string;
      createdAt: Date;
    }>
  >("/api/akademik/akreditasi");
}

export async function fetchPublicProsedur() {
  return fetchPublicData<Array<typeof prosedurAkademik.$inferSelect>>("/api/akademik/prosedur");
}

export async function fetchPublicOrmawa() {
  return fetchPublicData<Array<typeof ormawa.$inferSelect>>("/api/kemahasiswaan/ormawa");
}

export async function fetchPublicLomba() {
  return fetchPublicData<Array<typeof lomba.$inferSelect>>("/api/kemahasiswaan/lomba");
}

export async function fetchPublicKonseling() {
  return fetchPublicData<typeof konselingLayanan.$inferSelect>("/api/kemahasiswaan/konseling");
}

export async function fetchPublicJadwalKonseling() {
  return fetchPublicData<Array<typeof jadwalKonseling.$inferSelect>>("/api/kemahasiswaan/jadwal-konseling?public=true");
}

export async function fetchPublicBeritaByCategory(category: "beasiswa" | "kegiatan" | "berita") {
  return fetchPublicData<Array<typeof berita.$inferSelect>>(`/api/berita?category=${category}`);
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
