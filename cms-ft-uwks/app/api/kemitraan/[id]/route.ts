import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { kemitraan } from "@/lib/db/schema";
import { kemitraanUpdateSchema } from "@/lib/validations";
import { and, eq, isNull } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// GET /api/kemitraan/[id]
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
  const kemitraanId = parseInt(id, 10);
  if (isNaN(kemitraanId)) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

  const [record] = await db
    .select()
    .from(kemitraan)
    .where(and(eq(kemitraan.id, kemitraanId), isNull(kemitraan.deletedAt)))
    .limit(1);

  if (!record) return NextResponse.json({ error: "Kemitraan tidak ditemukan" }, { status: 404 });

  return NextResponse.json({ data: record });
}

// ─────────────────────────────────────────────
// PUT /api/kemitraan/[id]
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
  const kemitraanId = parseInt(id, 10);
  if (isNaN(kemitraanId)) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

  const [existing] = await db
    .select({ id: kemitraan.id })
    .from(kemitraan)
    .where(and(eq(kemitraan.id, kemitraanId), isNull(kemitraan.deletedAt)))
    .limit(1);

  if (!existing) return NextResponse.json({ error: "Kemitraan tidak ditemukan" }, { status: 404 });

  try {
    const body = await request.json();
    const parsed = kemitraanUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { partnerName, kategoriMitra, logoUrl, partnershipType, mouDate, description, websiteUrl } = parsed.data;

    await db
      .update(kemitraan)
      .set({
        partnerName,
        kategoriMitra,
        logoUrl: logoUrl && logoUrl.trim() !== "" ? logoUrl : null,
        partnershipType: partnershipType && partnershipType.trim() !== "" ? partnershipType : null,
        mouDate: mouDate && mouDate.trim() !== "" ? new Date(mouDate) : null,
        description: description && description.trim() !== "" ? description : null,
        websiteUrl: websiteUrl && websiteUrl.trim() !== "" ? websiteUrl : null,
      })
      .where(eq(kemitraan.id, kemitraanId));

    await logActivity({
      userId: Number(session.user.id),
      action: "update",
      module: "kemitraan",
      recordId: kemitraanId,
      detail: JSON.stringify({ partnerName, kategoriMitra }),
    });

    const [updated] = await db
      .select()
      .from(kemitraan)
      .where(eq(kemitraan.id, kemitraanId))
      .limit(1);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/kemitraan/[id]]", error);
    return NextResponse.json({ error: "Gagal mengupdate kemitraan" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// DELETE /api/kemitraan/[id] — Soft delete
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
  const kemitraanId = parseInt(id, 10);
  if (isNaN(kemitraanId)) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

  const [existing] = await db
    .select({ id: kemitraan.id, partnerName: kemitraan.partnerName })
    .from(kemitraan)
    .where(and(eq(kemitraan.id, kemitraanId), isNull(kemitraan.deletedAt)))
    .limit(1);

  if (!existing) return NextResponse.json({ error: "Kemitraan tidak ditemukan" }, { status: 404 });

  await db
    .update(kemitraan)
    .set({ deletedAt: new Date() })
    .where(eq(kemitraan.id, kemitraanId));

  await logActivity({
    userId: Number(session.user.id),
    action: "delete",
    module: "kemitraan",
    recordId: kemitraanId,
    detail: JSON.stringify({ partnerName: existing.partnerName }),
  });

  return NextResponse.json({ success: true });
}
