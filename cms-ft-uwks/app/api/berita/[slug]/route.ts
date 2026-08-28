import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { berita } from "@/lib/db/schema";
import { beritaUpdateSchema } from "@/lib/validations";
import { and, eq, isNull, ne } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// GET /api/berita/[slug] — Public endpoint (tidak perlu auth)
// HANYA kembalikan data jika status = 'published'
// ─────────────────────────────────────────────
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: "Slug tidak valid" }, { status: 400 });
  }

  const [record] = await db
    .select()
    .from(berita)
    .where(
      and(
        eq(berita.slug, slug),
        eq(berita.status, "published"),
        isNull(berita.deletedAt)
      )
    )
    .limit(1);

  if (!record) {
    return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ data: record });
}

// ─────────────────────────────────────────────
// PUT /api/berita/[id] (menerima ID pada path parameter)
// ─────────────────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const beritaId = parseInt(slug, 10);
  if (isNaN(beritaId)) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

  const [existing] = await db
    .select({ id: berita.id })
    .from(berita)
    .where(and(eq(berita.id, beritaId), isNull(berita.deletedAt)))
    .limit(1);

  if (!existing) return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 });

  try {
    const body = await request.json();
    const parsed = beritaUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { title, slug: newSlug, content, thumbnailUrl, category, status, publishedAt } = parsed.data;

    // Validasi slug unik — boleh sama dengan milik sendiri
    const [slugConflict] = await db
      .select({ id: berita.id })
      .from(berita)
      .where(
        and(
          eq(berita.slug, newSlug),
          isNull(berita.deletedAt),
          ne(berita.id, beritaId) // bukan record sendiri
        )
      )
      .limit(1);

    if (slugConflict) {
      return NextResponse.json(
        { error: "Slug sudah digunakan oleh berita lain", field: "slug" },
        { status: 409 }
      );
    }

    const resolvedPublishedAt =
      status === "published"
        ? publishedAt
          ? new Date(publishedAt)
          : new Date()
        : null;

    await db
      .update(berita)
      .set({
        title,
        slug: newSlug,
        content,
        thumbnailUrl: thumbnailUrl && thumbnailUrl.trim() !== "" ? thumbnailUrl : null,
        category,
        status,
        publishedAt: resolvedPublishedAt,
      })
      .where(eq(berita.id, beritaId));

    await logActivity({
      userId: Number(session.user.id),
      action: "update",
      module: "berita",
      recordId: beritaId,
      detail: JSON.stringify({ title, slug: newSlug, status }),
    });

    const [updated] = await db
      .select()
      .from(berita)
      .where(eq(berita.id, beritaId))
      .limit(1);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/berita/[id]]", error);
    return NextResponse.json({ error: "Gagal mengupdate berita" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// DELETE /api/berita/[id] (menerima ID pada path parameter) — Soft delete
// ─────────────────────────────────────────────
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const beritaId = parseInt(slug, 10);
  if (isNaN(beritaId)) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

  const [existing] = await db
    .select({ id: berita.id, title: berita.title })
    .from(berita)
    .where(and(eq(berita.id, beritaId), isNull(berita.deletedAt)))
    .limit(1);

  if (!existing) return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 });

  await db
    .update(berita)
    .set({ deletedAt: new Date() })
    .where(eq(berita.id, beritaId));

  await logActivity({
    userId: Number(session.user.id),
    action: "delete",
    module: "berita",
    recordId: beritaId,
    detail: JSON.stringify({ title: existing.title }),
  });

  return NextResponse.json({ success: true });
}
