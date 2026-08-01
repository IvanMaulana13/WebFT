import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dosen, activityLogs } from "@/lib/db/schema";
import { dosenSchema } from "@/lib/validations";
import { and, eq, isNull, or, like, sql } from "drizzle-orm";

// ─────────────────────────────────────────────
// GET /api/dosen
// Query params: search, prodi, page (default 1), limit (default 10)
// search: mencari di name, nik, kodeDosen, nidn
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const prodi = searchParams.get("prodi") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10))
    );
    const offset = (page - 1) * limit;

    const whereClause = and(
      isNull(dosen.deletedAt),
      search
        ? or(
            like(dosen.name, `%${search}%`),
            like(dosen.nik, `%${search}%`),
            like(dosen.kodeDosen, `%${search}%`),
            like(dosen.nidn, `%${search}%`)
          )
        : undefined,
      prodi ? eq(dosen.prodi, prodi) : undefined
    );

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(dosen)
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .orderBy(dosen.name),
      db
        .select({ count: sql<number>`count(*)` })
        .from(dosen)
        .where(whereClause),
    ]);

    const total = Number(countResult[0]?.count ?? 0);

    return NextResponse.json({
      data: rows,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/dosen]", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dosen" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// POST /api/dosen
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validasi Zod
    const parsed = dosenSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { photoUrl, nik, kodeDosen, nidn, name, prodi, email } = parsed.data;

    // Cek NIK unik
    const existingNik = await db
      .select({ id: dosen.id })
      .from(dosen)
      .where(and(eq(dosen.nik, nik), isNull(dosen.deletedAt)))
      .limit(1);

    if (existingNik.length > 0) {
      return NextResponse.json(
        {
          error: "Validasi duplikat",
          details: { nik: ["NIK sudah digunakan oleh dosen lain"] },
        },
        { status: 409 }
      );
    }

    // Cek Kode Dosen unik
    const existingKode = await db
      .select({ id: dosen.id })
      .from(dosen)
      .where(and(eq(dosen.kodeDosen, kodeDosen), isNull(dosen.deletedAt)))
      .limit(1);

    if (existingKode.length > 0) {
      return NextResponse.json(
        {
          error: "Validasi duplikat",
          details: { kodeDosen: ["Kode Dosen sudah digunakan oleh dosen lain"] },
        },
        { status: 409 }
      );
    }

    // Cek NIDN unik
    const existingNidn = await db
      .select({ id: dosen.id })
      .from(dosen)
      .where(and(eq(dosen.nidn, nidn), isNull(dosen.deletedAt)))
      .limit(1);

    if (existingNidn.length > 0) {
      return NextResponse.json(
        {
          error: "Validasi duplikat",
          details: { nidn: ["NIDN sudah digunakan oleh dosen lain"] },
        },
        { status: 409 }
      );
    }

    const [result] = await db.insert(dosen).values({
      photoUrl: photoUrl && photoUrl.trim() !== "" ? photoUrl : null,
      nik,
      kodeDosen,
      nidn,
      name,
      prodi,
      email,
    });

    const newId = (result as { insertId: number }).insertId;

    // Catat activity log
    await db.insert(activityLogs).values({
      action: "create",
      module: "dosen",
      recordId: newId,
      detail: `Menambahkan dosen: ${name} (NIK: ${nik})`,
    });

    const [newRecord] = await db
      .select()
      .from(dosen)
      .where(eq(dosen.id, newId))
      .limit(1);

    return NextResponse.json({ data: newRecord }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/dosen]", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data dosen" },
      { status: 500 }
    );
  }
}
