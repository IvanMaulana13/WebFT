import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { akreditasi, programStudi } from "@/lib/db/schema";
import { akreditasiUpdateSchema } from "@/lib/validations";
import { and, eq, isNull } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// PUT /api/akademik/akreditasi/[id] — Update
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
  const akreditasiId = parseInt(id, 10);
  if (isNaN(akreditasiId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: akreditasi.id })
    .from(akreditasi)
    .where(and(eq(akreditasi.id, akreditasiId), isNull(akreditasi.deletedAt)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Data akreditasi tidak ditemukan" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const parsed = akreditasiUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { prodiId, peringkat, noSk, tanggalBerlaku, fileSertifikat } = parsed.data;

    const [prodi] = await db
      .select({ id: programStudi.id, nama: programStudi.nama })
      .from(programStudi)
      .where(eq(programStudi.id, prodiId))
      .limit(1);

    if (!prodi) {
      return NextResponse.json({ error: "Program studi tidak ditemukan" }, { status: 422 });
    }

    await db
      .update(akreditasi)
      .set({ prodiId, peringkat, noSk, tanggalBerlaku: new Date(tanggalBerlaku), fileSertifikat })
      .where(eq(akreditasi.id, akreditasiId));

    await logActivity({
      userId: Number(session.user.id),
      action: "update",
      module: "akreditasi",
      recordId: akreditasiId,
      detail: JSON.stringify({ prodi: prodi.nama, peringkat, noSk }),
    });

    const [updated] = await db
      .select({
        id: akreditasi.id,
        prodiId: akreditasi.prodiId,
        prodiNama: programStudi.nama,
        peringkat: akreditasi.peringkat,
        noSk: akreditasi.noSk,
        tanggalBerlaku: akreditasi.tanggalBerlaku,
        fileSertifikat: akreditasi.fileSertifikat,
        createdAt: akreditasi.createdAt,
        updatedAt: akreditasi.updatedAt,
      })
      .from(akreditasi)
      .leftJoin(programStudi, eq(akreditasi.prodiId, programStudi.id))
      .where(eq(akreditasi.id, akreditasiId))
      .limit(1);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/akademik/akreditasi/[id]]", error);
    return NextResponse.json({ error: "Gagal mengupdate akreditasi" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// DELETE /api/akademik/akreditasi/[id] — Soft delete
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
  const akreditasiId = parseInt(id, 10);
  if (isNaN(akreditasiId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: akreditasi.id, noSk: akreditasi.noSk })
    .from(akreditasi)
    .where(and(eq(akreditasi.id, akreditasiId), isNull(akreditasi.deletedAt)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Data akreditasi tidak ditemukan" }, { status: 404 });
  }

  await db
    .update(akreditasi)
    .set({ deletedAt: new Date() })
    .where(eq(akreditasi.id, akreditasiId));

  await logActivity({
    userId: Number(session.user.id),
    action: "delete",
    module: "akreditasi",
    recordId: akreditasiId,
    detail: JSON.stringify({ noSk: existing.noSk }),
  });

  return NextResponse.json({ success: true });
}
