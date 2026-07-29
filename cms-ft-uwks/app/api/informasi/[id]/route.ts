import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { informasi } from "@/lib/db/schema";
import { informasiUpdateSchema } from "@/lib/validations";
import { eq, isNull, and } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// PUT /api/informasi/[id]
// ─────────────────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const informasiId = parseInt(id, 10);
  if (isNaN(informasiId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  try {
    // Cek record ada
    const [existing] = await db
      .select({ id: informasi.id })
      .from(informasi)
      .where(and(eq(informasi.id, informasiId), isNull(informasi.deletedAt)))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Informasi tidak ditemukan" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = informasiUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { title, content, category, status } = parsed.data;
    const userId = Number(session.user.id);

    await db
      .update(informasi)
      .set({
        title,
        content,
        category: category && category.trim() !== "" ? category : null,
        status,
      })
      .where(eq(informasi.id, informasiId));

    await logActivity({
      userId,
      action: "update",
      module: "informasi",
      recordId: informasiId,
      detail: JSON.stringify({ title, status }),
    });

    const [updated] = await db
      .select()
      .from(informasi)
      .where(eq(informasi.id, informasiId))
      .limit(1);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/informasi/[id]]", error);
    return NextResponse.json({ error: "Gagal mengupdate informasi" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// DELETE /api/informasi/[id] — Soft delete
// ─────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const informasiId = parseInt(id, 10);
  if (isNaN(informasiId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  try {
    const [existing] = await db
      .select({ id: informasi.id, title: informasi.title })
      .from(informasi)
      .where(and(eq(informasi.id, informasiId), isNull(informasi.deletedAt)))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Informasi tidak ditemukan" }, { status: 404 });
    }

    // Soft delete
    await db
      .update(informasi)
      .set({ deletedAt: new Date() })
      .where(eq(informasi.id, informasiId));

    await logActivity({
      userId: Number(session.user.id),
      action: "delete",
      module: "informasi",
      recordId: informasiId,
      detail: JSON.stringify({ title: existing.title }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/informasi/[id]]", error);
    return NextResponse.json({ error: "Gagal menghapus informasi" }, { status: 500 });
  }
}
