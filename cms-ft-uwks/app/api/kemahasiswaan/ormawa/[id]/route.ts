import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ormawa } from "@/lib/db/schema";
import { ormawaSchema } from "@/lib/validations";
import { and, eq, isNull } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ormawaId = parseInt(id, 10);
  if (isNaN(ormawaId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: ormawa.id })
    .from(ormawa)
    .where(and(eq(ormawa.id, ormawaId), isNull(ormawa.deletedAt)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Ormawa tidak ditemukan" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const parsed = ormawaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { nama, logoUrl, deskripsi, websiteUrl, instagramUrl } = parsed.data;

    await db
      .update(ormawa)
      .set({
        nama,
        logoUrl: logoUrl || null,
        deskripsi,
        websiteUrl: websiteUrl || null,
        instagramUrl: instagramUrl || null,
      })
      .where(eq(ormawa.id, ormawaId));

    await logActivity({
      userId: Number(session.user.id),
      action: "update",
      module: "ormawa",
      recordId: ormawaId,
      detail: JSON.stringify({ nama }),
    });

    const [updated] = await db
      .select()
      .from(ormawa)
      .where(eq(ormawa.id, ormawaId))
      .limit(1);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/kemahasiswaan/ormawa/[id]]", error);
    return NextResponse.json({ error: "Gagal mengupdate ormawa" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ormawaId = parseInt(id, 10);
  if (isNaN(ormawaId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: ormawa.id, nama: ormawa.nama })
    .from(ormawa)
    .where(and(eq(ormawa.id, ormawaId), isNull(ormawa.deletedAt)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Ormawa tidak ditemukan" }, { status: 404 });
  }

  await db
    .update(ormawa)
    .set({ deletedAt: new Date() })
    .where(eq(ormawa.id, ormawaId));

  await logActivity({
    userId: Number(session.user.id),
    action: "delete",
    module: "ormawa",
    recordId: ormawaId,
    detail: JSON.stringify({ nama: existing.nama }),
  });

  return NextResponse.json({ success: true });
}
