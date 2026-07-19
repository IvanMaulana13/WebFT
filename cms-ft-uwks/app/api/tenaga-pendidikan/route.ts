import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tenagaPendidikan, activityLogs } from "@/lib/db/schema";
import { tenagaPendidikanSchema } from "@/lib/validations";
import { and, eq, isNull, or, like, sql } from "drizzle-orm";

// ─────────────────────────────────────────────
// GET /api/tenaga-pendidikan
// Query params: search, page (default 1), limit (default 10)
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
    const offset = (page - 1) * limit;

    const whereClause = and(
      isNull(tenagaPendidikan.deletedAt),
      search
        ? or(
            like(tenagaPendidikan.name, `%${search}%`),
            like(tenagaPendidikan.nuptk, `%${search}%`)
          )
        : undefined
    );

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(tenagaPendidikan)
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .orderBy(tenagaPendidikan.createdAt),
      db
        .select({ count: sql<number>`count(*)` })
        .from(tenagaPendidikan)
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
    console.error("[GET /api/tenaga-pendidikan]", error);
    return NextResponse.json(
      { error: "Gagal mengambil data tenaga pendidikan" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// POST /api/tenaga-pendidikan
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validasi Zod
    const parsed = tenagaPendidikanSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, jabatan, email, nuptk, photoUrl } = parsed.data;

    // Cek NUPTK unik jika diisi
    if (nuptk && nuptk.trim() !== "") {
      const existing = await db
        .select({ id: tenagaPendidikan.id })
        .from(tenagaPendidikan)
        .where(
          and(
            eq(tenagaPendidikan.nuptk, nuptk),
            isNull(tenagaPendidikan.deletedAt)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        return NextResponse.json(
          { error: "NUPTK sudah digunakan oleh tenaga pendidikan lain" },
          { status: 400 }
        );
      }
    }

    const [result] = await db.insert(tenagaPendidikan).values({
      name,
      jabatan,
      email,
      nuptk: nuptk && nuptk.trim() !== "" ? nuptk : null,
      photoUrl: photoUrl && photoUrl.trim() !== "" ? photoUrl : null,
    });

    const newId = (result as { insertId: number }).insertId;

    // Catat activity log
    await db.insert(activityLogs).values({
      action: "create",
      module: "tenaga_pendidikan",
      entityId: newId,
      description: `Menambahkan tenaga pendidikan: ${name}`,
    });

    const [newRecord] = await db
      .select()
      .from(tenagaPendidikan)
      .where(eq(tenagaPendidikan.id, newId))
      .limit(1);

    return NextResponse.json({ data: newRecord }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/tenaga-pendidikan]", error);
    return NextResponse.json(
      { error: "Gagal menyimpan tenaga pendidikan" },
      { status: 500 }
    );
  }
}
