import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lomba } from "@/lib/db/schema";
import { lombaSchema } from "@/lib/validations";
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
  const lombaId = parseInt(id, 10);
  if (isNaN(lombaId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: lomba.id })
    .from(lomba)
    .where(and(eq(lomba.id, lombaId), isNull(lomba.deletedAt)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Lomba tidak ditemukan" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const parsed = lombaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const data = parsed.data;

    await db
      .update(lomba)
      .set({
        namaLomba: data.namaLomba,
        tingkat: data.tingkat,
        tanggalMulaiPendaftaran: new Date(data.tanggalMulaiPendaftaran),
        tanggalSelesaiPendaftaran: new Date(data.tanggalSelesaiPendaftaran),
        linkPendaftaran: data.linkPendaftaran,
        deskripsi: data.deskripsi,
      })
      .where(eq(lomba.id, lombaId));

    await logActivity({
      userId: Number(session.user.id),
      action: "update",
      module: "lomba",
      recordId: lombaId,
      detail: JSON.stringify({ namaLomba: data.namaLomba }),
    });

    const [updated] = await db
      .select()
      .from(lomba)
      .where(eq(lomba.id, lombaId))
      .limit(1);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/kemahasiswaan/lomba/[id]]", error);
    return NextResponse.json({ error: "Gagal mengupdate lomba" }, { status: 500 });
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
  const lombaId = parseInt(id, 10);
  if (isNaN(lombaId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: lomba.id, namaLomba: lomba.namaLomba })
    .from(lomba)
    .where(and(eq(lomba.id, lombaId), isNull(lomba.deletedAt)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Lomba tidak ditemukan" }, { status: 404 });
  }

  await db
    .update(lomba)
    .set({ deletedAt: new Date() })
    .where(eq(lomba.id, lombaId));

  await logActivity({
    userId: Number(session.user.id),
    action: "delete",
    module: "lomba",
    recordId: lombaId,
    detail: JSON.stringify({ namaLomba: existing.namaLomba }),
  });

  return NextResponse.json({ success: true });
}
