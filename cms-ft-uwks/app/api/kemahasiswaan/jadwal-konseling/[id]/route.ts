import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jadwalKonseling } from "@/lib/db/schema";
import { jadwalKonselingSchema } from "@/lib/validations";
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
  const jadwalId = parseInt(id, 10);
  if (isNaN(jadwalId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: jadwalKonseling.id })
    .from(jadwalKonseling)
    .where(and(eq(jadwalKonseling.id, jadwalId), isNull(jadwalKonseling.deletedAt)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Jadwal tidak ditemukan" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const parsed = jadwalKonselingSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { tanggal, jam, status } = parsed.data;

    await db
      .update(jadwalKonseling)
      .set({
        tanggal: new Date(tanggal),
        jam,
        status,
      })
      .where(eq(jadwalKonseling.id, jadwalId));

    await logActivity({
      userId: Number(session.user.id),
      action: "update",
      module: "jadwal_konseling",
      recordId: jadwalId,
      detail: JSON.stringify({ tanggal, jam, status }),
    });

    const [updated] = await db
      .select()
      .from(jadwalKonseling)
      .where(eq(jadwalKonseling.id, jadwalId))
      .limit(1);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/kemahasiswaan/jadwal-konseling/[id]]", error);
    return NextResponse.json({ error: "Gagal mengupdate jadwal" }, { status: 500 });
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
  const jadwalId = parseInt(id, 10);
  if (isNaN(jadwalId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: jadwalKonseling.id, tanggal: jadwalKonseling.tanggal })
    .from(jadwalKonseling)
    .where(and(eq(jadwalKonseling.id, jadwalId), isNull(jadwalKonseling.deletedAt)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Jadwal tidak ditemukan" }, { status: 404 });
  }

  await db
    .update(jadwalKonseling)
    .set({ deletedAt: new Date() })
    .where(eq(jadwalKonseling.id, jadwalId));

  await logActivity({
    userId: Number(session.user.id),
    action: "delete",
    module: "jadwal_konseling",
    recordId: jadwalId,
    detail: JSON.stringify({ tanggal: existing.tanggal }),
  });

  return NextResponse.json({ success: true });
}
