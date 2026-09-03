import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { kemitraan } from "@/lib/db/schema";
import { kemitraanSchema } from "@/lib/validations";
import { and, isNull, like, or, asc, eq, sql } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// GET /api/kemitraan
// Query: page, limit, search, kategori_mitra
// Default order: order_index ASC, created_at ASC
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const kategoriMitra = searchParams.get("kategori_mitra") || searchParams.get("kategoriMitra");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const offset = (page - 1) * limit;

    const whereClause = and(
      isNull(kemitraan.deletedAt),
      kategoriMitra === "universitas" || kategoriMitra === "lembaga"
        ? eq(kemitraan.kategoriMitra, kategoriMitra)
        : undefined,
      search
        ? or(
            like(kemitraan.partnerName, `%${search}%`),
            like(kemitraan.partnershipType, `%${search}%`)
          )
        : undefined
    );

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(kemitraan)
        .where(whereClause)
        .orderBy(asc(kemitraan.orderIndex), asc(kemitraan.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(kemitraan)
        .where(whereClause),
    ]);

    const total = Number(countResult[0]?.count ?? 0);

    return NextResponse.json({
      data: rows,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/kemitraan]", error);
    return NextResponse.json({ error: "Gagal mengambil data kemitraan" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// POST /api/kemitraan
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = kemitraanSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { partnerName, kategoriMitra, logoUrl, partnershipType, mouDate, description, websiteUrl } = parsed.data;

    // Ambil max order_index per kategori_mitra untuk menaruh di urutan terbawah kategori tersebut
    const [maxOrder] = await db
      .select({ maxIdx: sql<number>`MAX(order_index)` })
      .from(kemitraan)
      .where(and(isNull(kemitraan.deletedAt), eq(kemitraan.kategoriMitra, kategoriMitra)));

    const nextOrder = (Number(maxOrder?.maxIdx ?? -1)) + 1;

    const [result] = await db.insert(kemitraan).values({
      partnerName,
      kategoriMitra,
      logoUrl: logoUrl && logoUrl.trim() !== "" ? logoUrl : null,
      partnershipType: partnershipType && partnershipType.trim() !== "" ? partnershipType : null,
      mouDate: mouDate && mouDate.trim() !== "" ? new Date(mouDate) : null,
      description: description && description.trim() !== "" ? description : null,
      websiteUrl: websiteUrl && websiteUrl.trim() !== "" ? websiteUrl : null,
      orderIndex: nextOrder,
    });

    const newId = (result as { insertId: number }).insertId;

    await logActivity({
      userId: Number(session.user.id),
      action: "create",
      module: "kemitraan",
      recordId: newId,
      detail: JSON.stringify({ partnerName, kategoriMitra }),
    });

    const [newRecord] = await db
      .select()
      .from(kemitraan)
      .where(eq(kemitraan.id, newId))
      .limit(1);

    return NextResponse.json({ data: newRecord }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/kemitraan]", error);
    return NextResponse.json({ error: "Gagal menyimpan kemitraan" }, { status: 500 });
  }
}
