import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { informasi } from "@/lib/db/schema";
import { informasiSchema } from "@/lib/validations";
import { and, isNull, like, or, eq, asc, sql } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// GET /api/informasi
// Query: page, limit, search, status
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const status = searchParams.get("status") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const offset = (page - 1) * limit;

    const whereClause = and(
      isNull(informasi.deletedAt),
      search
        ? or(
            like(informasi.title, `%${search}%`),
            like(informasi.category, `%${search}%`)
          )
        : undefined,
      status && (status === "draft" || status === "published")
        ? eq(informasi.status, status)
        : undefined
    );

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(informasi)
        .where(whereClause)
        .orderBy(asc(informasi.orderIndex), asc(informasi.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(informasi)
        .where(whereClause),
    ]);

    const total = Number(countResult[0]?.count ?? 0);

    return NextResponse.json({
      data: rows,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/informasi]", error);
    return NextResponse.json({ error: "Gagal mengambil data informasi" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// POST /api/informasi
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = informasiSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { title, content, category, status } = parsed.data;
    const userId = Number(session.user.id);

    // Ambil max order_index untuk menaruh di bawah
    const [maxOrder] = await db
      .select({ maxIdx: sql<number>`MAX(order_index)` })
      .from(informasi)
      .where(isNull(informasi.deletedAt));

    const nextOrder = (Number(maxOrder?.maxIdx ?? -1)) + 1;

    const [result] = await db.insert(informasi).values({
      title,
      content,
      category: category && category.trim() !== "" ? category : null,
      status,
      orderIndex: nextOrder,
      createdBy: userId,
    });

    const newId = (result as { insertId: number }).insertId;

    await logActivity({
      userId,
      action: "create",
      module: "informasi",
      recordId: newId,
      detail: JSON.stringify({ title, status }),
    });

    const [newRecord] = await db
      .select()
      .from(informasi)
      .where(eq(informasi.id, newId))
      .limit(1);

    return NextResponse.json({ data: newRecord }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/informasi]", error);
    return NextResponse.json({ error: "Gagal menyimpan informasi" }, { status: 500 });
  }
}
