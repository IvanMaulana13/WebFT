import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { prestasi } from "@/lib/db/schema";
import { prestasiUpdateSchema } from "@/lib/validations";
import { and, eq, isNull } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// GET /api/prestasi/[id] — Fetch single for edit form
// ─────────────────────────────────────────────
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const prestasiId = parseInt(id, 10);
  if (isNaN(prestasiId)) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

  const [record] = await db
    .select()
    .from(prestasi)
    .where(and(eq(prestasi.id, prestasiId), isNull(prestasi.deletedAt)))
    .limit(1);

  if (!record) return NextResponse.json({ error: "Prestasi tidak ditemukan" }, { status: 404 });

  return NextResponse.json({ data: record });
}

// ─────────────────────────────────────────────
// PUT /api/prestasi/[id]
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
  const prestasiId = parseInt(id, 10);
  if (isNaN(prestasiId)) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

  const [existing] = await db
    .select({ id: prestasi.id })
    .from(prestasi)
    .where(and(eq(prestasi.id, prestasiId), isNull(prestasi.deletedAt)))
    .limit(1);

  if (!existing) return NextResponse.json({ error: "Prestasi tidak ditemukan" }, { status: 404 });

  try {
    const body = await request.json();
    const parsed = prestasiUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { title, achieverName, level, year, imageUrl, description } = parsed.data;

    await db
      .update(prestasi)
      .set({
        title,
        achieverName,
        level,
        year,
        imageUrl: imageUrl && imageUrl.trim() !== "" ? imageUrl : null,
        description: description && description.trim() !== "" ? description : null,
      })
      .where(eq(prestasi.id, prestasiId));

    await logActivity({
      userId: Number(session.user.id),
      action: "update",
      module: "prestasi",
      recordId: prestasiId,
      detail: JSON.stringify({ title, level, year }),
    });

    const [updated] = await db
      .select()
      .from(prestasi)
      .where(eq(prestasi.id, prestasiId))
      .limit(1);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/prestasi/[id]]", error);
    return NextResponse.json({ error: "Gagal mengupdate prestasi" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// DELETE /api/prestasi/[id] — Soft delete
// ─────────────────────────────────────────────
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const prestasiId = parseInt(id, 10);
  if (isNaN(prestasiId)) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

  const [existing] = await db
    .select({ id: prestasi.id, title: prestasi.title })
    .from(prestasi)
    .where(and(eq(prestasi.id, prestasiId), isNull(prestasi.deletedAt)))
    .limit(1);

  if (!existing) return NextResponse.json({ error: "Prestasi tidak ditemukan" }, { status: 404 });

  await db
    .update(prestasi)
    .set({ deletedAt: new Date() })
    .where(eq(prestasi.id, prestasiId));

  await logActivity({
    userId: Number(session.user.id),
    action: "delete",
    module: "prestasi",
    recordId: prestasiId,
    detail: JSON.stringify({ title: existing.title }),
  });

  return NextResponse.json({ success: true });
}
