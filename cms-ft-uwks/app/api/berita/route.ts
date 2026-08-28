import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { berita } from "@/lib/db/schema";
import { beritaSchema } from "@/lib/validations";
import { and, isNull, like, or, eq, desc, gte, lte, sql } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";
import { generateSlug } from "@/lib/utils/slug";

// ─────────────────────────────────────────────
// GET /api/berita
// Query: page, limit, search, category, status, dateFrom, dateTo
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const status = searchParams.get("status") ?? "";
    const dateFrom = searchParams.get("dateFrom") ?? "";
    const dateTo = searchParams.get("dateTo") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
    const offset = (page - 1) * limit;

    const whereClause = and(
      isNull(berita.deletedAt),
      search
        ? or(
            like(berita.title, `%${search}%`),
            like(berita.slug, `%${search}%`)
          )
        : undefined,
      category && ["berita", "kegiatan", "beasiswa"].includes(category)
        ? eq(berita.category, category as "berita" | "kegiatan" | "beasiswa")
        : undefined,
      status && ["draft", "published", "archived"].includes(status)
        ? eq(berita.status, status as "draft" | "published" | "archived")
        : undefined,
      dateFrom ? gte(berita.publishedAt, new Date(dateFrom)) : undefined,
      dateTo ? lte(berita.publishedAt, new Date(dateTo + "T23:59:59")) : undefined
    );

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(berita)
        .where(whereClause)
        .orderBy(desc(berita.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(berita)
        .where(whereClause),
    ]);

    const total = Number(countResult[0]?.count ?? 0);

    return NextResponse.json({
      data: rows,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/berita]", error);
    return NextResponse.json({ error: "Gagal mengambil data berita" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// POST /api/berita
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = beritaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { title, slug, content, thumbnailUrl, category, status, publishedAt } = parsed.data;

    // Validasi slug unik
    const [slugConflict] = await db
      .select({ id: berita.id })
      .from(berita)
      .where(and(eq(berita.slug, slug), isNull(berita.deletedAt)))
      .limit(1);

    if (slugConflict) {
      return NextResponse.json(
        { error: "Slug sudah digunakan oleh berita lain", field: "slug" },
        { status: 409 }
      );
    }

    const userId = Number(session.user.id);
    const resolvedPublishedAt =
      status === "published"
        ? publishedAt
          ? new Date(publishedAt)
          : new Date()
        : null;

    const [result] = await db.insert(berita).values({
      title,
      slug,
      content,
      thumbnailUrl: thumbnailUrl && thumbnailUrl.trim() !== "" ? thumbnailUrl : null,
      category,
      status,
      publishedAt: resolvedPublishedAt,
      createdBy: userId,
    });

    const newId = (result as { insertId: number }).insertId;

    await logActivity({
      userId,
      action: "create",
      module: "berita",
      recordId: newId,
      detail: JSON.stringify({ title, slug, status }),
    });

    const [newRecord] = await db
      .select()
      .from(berita)
      .where(eq(berita.id, newId))
      .limit(1);

    return NextResponse.json({ data: newRecord }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/berita]", error);
    return NextResponse.json({ error: "Gagal menyimpan berita" }, { status: 500 });
  }
}

// Export generateSlug so client can use it without separate module resolution issues
export { generateSlug };
