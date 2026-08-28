import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  berita,
  prestasi,
  kemitraan,
  dosen,
  tenagaPendidikan,
  pimpinanFakultas,
  activityLogs,
  users,
  strukturOrganisasi,
  visitorLogs,
} from "@/lib/db/schema";
import { and, eq, isNull, sql, desc } from "drizzle-orm";

// ─────────────────────────────────────────────
// GET /api/dashboard/stats
// Returns: all content counts, recent activity (10), and struktur image
// ─────────────────────────────────────────────
export async function GET() {
  try {
    const [
      beritaPublished,
      beritaDraft,
      prestasiCount,
      kemitraanCount,
      dosenCount,
      tenagaCount,
      pimpinanCount,
      recentLogs,
      strukturRow,
      totalVisitorsRow,
      todayVisitorsRow,
    ] = await Promise.all([
      // Berita published
      db
        .select({ count: sql<number>`count(*)` })
        .from(berita)
        .where(and(isNull(berita.deletedAt), eq(berita.status, "published"))),

      // Berita draft
      db
        .select({ count: sql<number>`count(*)` })
        .from(berita)
        .where(and(isNull(berita.deletedAt), eq(berita.status, "draft"))),

      // Prestasi
      db
        .select({ count: sql<number>`count(*)` })
        .from(prestasi)
        .where(isNull(prestasi.deletedAt)),

      // Kemitraan
      db
        .select({ count: sql<number>`count(*)` })
        .from(kemitraan)
        .where(isNull(kemitraan.deletedAt)),

      // Dosen
      db
        .select({ count: sql<number>`count(*)` })
        .from(dosen)
        .where(isNull(dosen.deletedAt)),

      // Tenaga Pendidikan
      db
        .select({ count: sql<number>`count(*)` })
        .from(tenagaPendidikan)
        .where(isNull(tenagaPendidikan.deletedAt)),

      // Pimpinan Fakultas
      db
        .select({ count: sql<number>`count(*)` })
        .from(pimpinanFakultas)
        .where(isNull(pimpinanFakultas.deletedAt)),

      // Activity logs — 10 terbaru + join ke users untuk nama
      db
        .select({
          id: activityLogs.id,
          action: activityLogs.action,
          module: activityLogs.module,
          detail: activityLogs.detail,
          createdAt: activityLogs.createdAt,
          userName: users.name,
        })
        .from(activityLogs)
        .leftJoin(users, eq(activityLogs.userId, users.id))
        .orderBy(desc(activityLogs.createdAt))
        .limit(10),

      // Struktur organisasi (single row)
      db.select({ imageUrl: strukturOrganisasi.imageUrl }).from(strukturOrganisasi).limit(1),

      // Total unique visitors (all-time)
      db
        .select({ count: sql<number>`COUNT(DISTINCT visitor_id)` })
        .from(visitorLogs),

      // Unique visitors hari ini
      db
        .select({ count: sql<number>`COUNT(DISTINCT visitor_id)` })
        .from(visitorLogs)
        .where(sql`DATE(created_at) = CURDATE()`),
    ]);

    return NextResponse.json({
      stats: {
        beritaPublished: Number(beritaPublished[0]?.count ?? 0),
        beritaDraft: Number(beritaDraft[0]?.count ?? 0),
        prestasi: Number(prestasiCount[0]?.count ?? 0),
        kemitraan: Number(kemitraanCount[0]?.count ?? 0),
        dosen: Number(dosenCount[0]?.count ?? 0),
        tenagaPendidikan: Number(tenagaCount[0]?.count ?? 0),
        pimpinan: Number(pimpinanCount[0]?.count ?? 0),
        totalVisitors: Number(totalVisitorsRow[0]?.count ?? 0),
        todayVisitors: Number(todayVisitorsRow[0]?.count ?? 0),
      },
      recentActivity: recentLogs,
      strukturImage: strukturRow[0]?.imageUrl ?? null,
    });
  } catch (error) {
    console.error("[GET /api/dashboard/stats]", error);
    return NextResponse.json(
      { error: "Gagal mengambil statistik dashboard" },
      { status: 500 }
    );
  }
}
