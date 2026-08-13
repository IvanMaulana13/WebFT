import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pimpinanFakultas, activityLogs } from "@/lib/db/schema";
import { pimpinanSchema } from "@/lib/validations";
import { and, isNull, like, or, sql } from "drizzle-orm";

// ─────────────────────────────────────────────
// GET /api/pimpinan
// Query params: search, page (default 1), limit (default 10)
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10))
    );
    const offset = (page - 1) * limit;

    const whereClause = and(
      isNull(pimpinanFakultas.deletedAt),
      search
        ? or(
            like(pimpinanFakultas.name, `%${search}%`),
            like(pimpinanFakultas.jabatan, `%${search}%`)
          )
        : undefined
    );

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(pimpinanFakultas)
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .orderBy(pimpinanFakultas.name),
      db
        .select({ count: sql<number>`count(*)` })
        .from(pimpinanFakultas)
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
    console.error("[GET /api/pimpinan]", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pimpinan fakultas" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// POST /api/pimpinan
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = pimpinanSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, photoUrl, jabatan, periodeMulai, periodeSelesai, sambutan } =
      parsed.data;

    const [result] = await db.insert(pimpinanFakultas).values({
      name,
      photoUrl: photoUrl?.trim() || null,
      jabatan,
      periodeMulai: periodeMulai?.trim() ? new Date(periodeMulai.trim()) : null,
      periodeSelesai: periodeSelesai?.trim()
        ? new Date(periodeSelesai.trim())
        : null,
      // sambutan hanya disimpan jika jabatan = "Dekan"
      sambutan:
        jabatan === "Dekan" && sambutan?.trim()
          ? sambutan.trim()
          : null,
    });

    const newId = (result as { insertId: number }).insertId;

    await db.insert(activityLogs).values({
      action: "create",
      module: "pimpinan_fakultas",
      recordId: newId,
      detail: `Menambahkan pimpinan: ${name} (${jabatan})`,
    });

    const [newRecord] = await db
      .select()
      .from(pimpinanFakultas)
      .where(
        and(
          // re-fetch by id
          sql`${pimpinanFakultas.id} = ${newId}`
        )
      )
      .limit(1);

    return NextResponse.json({ data: newRecord }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/pimpinan]", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data pimpinan" },
      { status: 500 }
    );
  }
}
