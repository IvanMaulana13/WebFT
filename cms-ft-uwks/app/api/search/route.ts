import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  berita,
  prestasi,
  dosen,
  ormawa,
  lomba,
  prosedurAkademik,
} from "@/lib/db/schema";
import { and, isNull, like, or, eq, sql } from "drizzle-orm";
import { checkSearchRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // 1. Rate Limiting per IP (30 request / menit)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "127.0.0.1";

    const { limited } = checkSearchRateLimit(ip);
    if (limited) {
      return NextResponse.json(
        {
          error: "Terlalu banyak permintaan pencarian. Silakan coba beberapa saat lagi.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
          },
        }
      );
    }

    // 2. Query validation
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";

    if (q.length < 2) {
      return NextResponse.json({
        query: q,
        data: {
          berita: [],
          prestasi: [],
          dosen: [],
          ormawa: [],
          lomba: [],
          prosedur: [],
        },
        counts: {
          berita: 0,
          prestasi: 0,
          dosen: 0,
          ormawa: 0,
          lomba: 0,
          prosedur: 0,
          total: 0,
        },
      });
    }

    const pattern = `%${q}%`;

    // 3. Where clauses for each category
    const beritaWhere = and(
      isNull(berita.deletedAt),
      eq(berita.status, "published"),
      or(like(berita.title, pattern), like(berita.content, pattern))
    );

    const prestasiWhere = and(
      isNull(prestasi.deletedAt),
      or(like(prestasi.title, pattern), like(prestasi.achieverName, pattern))
    );

    const dosenWhere = and(
      isNull(dosen.deletedAt),
      like(dosen.name, pattern)
    );

    const ormawaWhere = and(
      isNull(ormawa.deletedAt),
      like(ormawa.nama, pattern)
    );

    const lombaWhere = and(
      isNull(lomba.deletedAt),
      like(lomba.namaLomba, pattern)
    );

    const prosedurWhere = and(
      isNull(prosedurAkademik.deletedAt),
      like(prosedurAkademik.judulSop, pattern)
    );

    // 4. Parallel execution of data & count queries
    const [
      beritaRows,
      beritaCount,
      prestasiRows,
      prestasiCount,
      dosenRows,
      dosenCount,
      ormawaRows,
      ormawaCount,
      lombaRows,
      lombaCount,
      prosedurRows,
      prosedurCount,
    ] = await Promise.all([
      // Berita
      db
        .select({
          title: berita.title,
          slug: berita.slug,
          thumbnailUrl: berita.thumbnailUrl,
          category: berita.category,
        })
        .from(berita)
        .where(beritaWhere)
        .limit(5),
      db
        .select({ count: sql<number>`count(*)` })
        .from(berita)
        .where(beritaWhere),

      // Prestasi
      db
        .select({
          title: prestasi.title,
          id: prestasi.id,
          imageUrl: prestasi.imageUrl,
        })
        .from(prestasi)
        .where(prestasiWhere)
        .limit(5),
      db
        .select({ count: sql<number>`count(*)` })
        .from(prestasi)
        .where(prestasiWhere),

      // Dosen
      db
        .select({
          name: dosen.name,
          id: dosen.id,
          photoUrl: dosen.photoUrl,
          prodi: dosen.prodi,
        })
        .from(dosen)
        .where(dosenWhere)
        .limit(5),
      db
        .select({ count: sql<number>`count(*)` })
        .from(dosen)
        .where(dosenWhere),

      // Ormawa
      db
        .select({
          namaOrganisasi: ormawa.nama,
          id: ormawa.id,
          logoUrl: ormawa.logoUrl,
          linkWebsite: ormawa.websiteUrl,
        })
        .from(ormawa)
        .where(ormawaWhere)
        .limit(5),
      db
        .select({ count: sql<number>`count(*)` })
        .from(ormawa)
        .where(ormawaWhere),

      // Lomba
      db
        .select({
          namaLomba: lomba.namaLomba,
          id: lomba.id,
        })
        .from(lomba)
        .where(lombaWhere)
        .limit(5),
      db
        .select({ count: sql<number>`count(*)` })
        .from(lomba)
        .where(lombaWhere),

      // Prosedur Akademik
      db
        .select({
          judulSop: prosedurAkademik.judulSop,
          id: prosedurAkademik.id,
        })
        .from(prosedurAkademik)
        .where(prosedurWhere)
        .limit(5),
      db
        .select({ count: sql<number>`count(*)` })
        .from(prosedurAkademik)
        .where(prosedurWhere),
    ]);

    // 5. Format results
    const bCount = Number(beritaCount[0]?.count || 0);
    const pCount = Number(prestasiCount[0]?.count || 0);
    const dCount = Number(dosenCount[0]?.count || 0);
    const oCount = Number(ormawaCount[0]?.count || 0);
    const lCount = Number(lombaCount[0]?.count || 0);
    const prCount = Number(prosedurCount[0]?.count || 0);
    const totalCount = bCount + pCount + dCount + oCount + lCount + prCount;

    return NextResponse.json({
      query: q,
      data: {
        berita: beritaRows.map((b) => ({
          type: "berita" as const,
          title: b.title,
          slug: b.slug,
          thumbnail_url: b.thumbnailUrl,
          category: b.category,
        })),
        prestasi: prestasiRows.map((p) => ({
          type: "prestasi" as const,
          title: p.title,
          id: p.id,
          image_url: p.imageUrl,
        })),
        dosen: dosenRows.map((d) => ({
          type: "dosen" as const,
          name: d.name,
          id: d.id,
          photo_url: d.photoUrl,
          prodi: d.prodi,
        })),
        ormawa: ormawaRows.map((o) => ({
          type: "ormawa" as const,
          nama_organisasi: o.namaOrganisasi,
          id: o.id,
          logo_url: o.logoUrl,
          link_website: o.linkWebsite,
        })),
        lomba: lombaRows.map((l) => ({
          type: "lomba" as const,
          nama_lomba: l.namaLomba,
          id: l.id,
        })),
        prosedur: prosedurRows.map((pr) => ({
          type: "prosedur" as const,
          judul_sop: pr.judulSop,
          id: pr.id,
        })),
      },
      counts: {
        berita: bCount,
        prestasi: pCount,
        dosen: dCount,
        ormawa: oCount,
        lomba: lCount,
        prosedur: prCount,
        total: totalCount,
      },
    });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { error: "Gagal memproses pencarian" },
      { status: 500 }
    );
  }
}
