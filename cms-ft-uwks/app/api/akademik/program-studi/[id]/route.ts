import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { programStudi, jadwalKuliah, akreditasi } from "@/lib/db/schema";
import { programStudiUpdateSchema } from "@/lib/validations";
import { and, eq, ne, or, isNull } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// PUT /api/akademik/program-studi/[id] — Super Admin only
// ─────────────────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const prodiId = parseInt(id, 10);
  if (isNaN(prodiId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const [existing] = await db
    .select()
    .from(programStudi)
    .where(eq(programStudi.id, prodiId))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Program studi tidak ditemukan" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const parsed = programStudiUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { nama, kode } = parsed.data;

    // Cek kode unik (kecuali diri sendiri)
    const [dupKode] = await db
      .select({ id: programStudi.id })
      .from(programStudi)
      .where(and(eq(programStudi.kode, kode), ne(programStudi.id, prodiId)))
      .limit(1);

    if (dupKode) {
      return NextResponse.json(
        { error: "Kode program studi sudah digunakan" },
        { status: 409 }
      );
    }

    await db
      .update(programStudi)
      .set({ nama, kode })
      .where(eq(programStudi.id, prodiId));

    await logActivity({
      userId: Number(session.user.id),
      action: "update",
      module: "program_studi",
      recordId: prodiId,
      detail: JSON.stringify({ nama, kode }),
    });

    const [updated] = await db
      .select()
      .from(programStudi)
      .where(eq(programStudi.id, prodiId))
      .limit(1);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/akademik/program-studi/[id]]", error);
    return NextResponse.json({ error: "Gagal mengupdate program studi" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// DELETE /api/akademik/program-studi/[id] — Super Admin only (hard delete, guard relasi)
// ─────────────────────────────────────────────
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const prodiId = parseInt(id, 10);
  if (isNaN(prodiId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: programStudi.id, nama: programStudi.nama })
    .from(programStudi)
    .where(eq(programStudi.id, prodiId))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Program studi tidak ditemukan" }, { status: 404 });
  }

  // Guard: cek apakah ada jadwal atau akreditasi yang mereferensikannya
  const [usedInJadwal] = await db
    .select({ id: jadwalKuliah.id })
    .from(jadwalKuliah)
    .where(and(eq(jadwalKuliah.prodiId, prodiId), isNull(jadwalKuliah.deletedAt)))
    .limit(1);

  const [usedInAkreditasi] = await db
    .select({ id: akreditasi.id })
    .from(akreditasi)
    .where(and(eq(akreditasi.prodiId, prodiId), isNull(akreditasi.deletedAt)))
    .limit(1);

  if (usedInJadwal || usedInAkreditasi) {
    return NextResponse.json(
      { error: "Program studi tidak dapat dihapus karena masih digunakan di data jadwal atau akreditasi" },
      { status: 409 }
    );
  }

  await db.delete(programStudi).where(eq(programStudi.id, prodiId));

  await logActivity({
    userId: Number(session.user.id),
    action: "delete",
    module: "program_studi",
    recordId: prodiId,
    detail: JSON.stringify({ nama: existing.nama }),
  });

  return NextResponse.json({ success: true });
}
