import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { prestasi } from "@/lib/db/schema";
import { prestasiSchema } from "@/lib/validations";
import { and, isNull, like, or, eq, desc, sql } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// GET /api/prestasi
// Query: page, limit, search, level, year
// Default order: year DESC
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const level = searchParams.get("level") ?? "";
    const yearStr = searchParams.get("year") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
    const offset = (page - 1) * limit;

    const yearFilter = yearStr && !isNaN(parseInt(yearStr, 10)) ? parseInt(yearStr, 10) : null;

    const whereClause = and(
      isNull(prestasi.deletedAt),
      search
        ? or(
            like(prestasi.title, `%${search}%`),
            like(prestasi.achieverName, `%${search}%`)
          )
        : undefined,
      level && ["nasional", "internasional"].includes(level)
        ? eq(prestasi.level, level as "nasional" | "internasional")
        : undefined,
      yearFilter ? eq(prestasi.year, yearFilter) : undefined
    );

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(prestasi)
        .where(whereClause)
        .orderBy(desc(prestasi.year), desc(prestasi.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(prestasi)
        .where(whereClause),
    ]);

    const total = Number(countResult[0]?.count ?? 0);

    return NextResponse.json({
      data: rows,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/prestasi]", error);
    return NextResponse.json({ error: "Gagal mengambil data prestasi" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// POST /api/prestasi
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = prestasiSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { title, achieverName, level, year, imageUrl, description } = parsed.data;

    const [result] = await db.insert(prestasi).values({
      title,
      achieverName,
      level,
      year,
      imageUrl: imageUrl && imageUrl.trim() !== "" ? imageUrl : null,
      description: description && description.trim() !== "" ? description : null,
    });

    const newId = (result as { insertId: number }).insertId;

    await logActivity({
      userId: Number(session.user.id),
      action: "create",
      module: "prestasi",
      recordId: newId,
      detail: JSON.stringify({ title, level, year }),
    });

    const [newRecord] = await db
      .select()
      .from(prestasi)
      .where(eq(prestasi.id, newId))
      .limit(1);

    return NextResponse.json({ data: newRecord }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/prestasi]", error);
    return NextResponse.json({ error: "Gagal menyimpan prestasi" }, { status: 500 });
  }
}
