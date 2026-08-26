import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jadwalKuliah, programStudi } from "@/lib/db/schema";
import { jadwalKuliahUpdateSchema } from "@/lib/validations";
import { and, eq, isNull } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// PUT /api/akademik/jadwal/[id] — Update
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
  const jadwalId = parseInt(id, 10);
  if (isNaN(jadwalId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: jadwalKuliah.id })
    .from(jadwalKuliah)
    .where(and(eq(jadwalKuliah.id, jadwalId), isNull(jadwalKuliah.deletedAt)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Jadwal kuliah tidak ditemukan" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const parsed = jadwalKuliahUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { prodiId, fileUrl, semester, tahunAjaran } = parsed.data;

    const [prodi] = await db
      .select({ id: programStudi.id, nama: programStudi.nama })
      .from(programStudi)
      .where(eq(programStudi.id, prodiId))
      .limit(1);

    if (!prodi) {
      return NextResponse.json({ error: "Program studi tidak ditemukan" }, { status: 422 });
    }

    await db
      .update(jadwalKuliah)
      .set({ prodiId, fileUrl, semester, tahunAjaran })
      .where(eq(jadwalKuliah.id, jadwalId));

    await logActivity({
      userId: Number(session.user.id),
      action: "update",
      module: "jadwal_kuliah",
      recordId: jadwalId,
      detail: JSON.stringify({ prodi: prodi.nama, semester, tahunAjaran }),
    });

    const [updated] = await db
      .select({
        id: jadwalKuliah.id,
        prodiId: jadwalKuliah.prodiId,
        prodiNama: programStudi.nama,
        fileUrl: jadwalKuliah.fileUrl,
        semester: jadwalKuliah.semester,
        tahunAjaran: jadwalKuliah.tahunAjaran,
        createdAt: jadwalKuliah.createdAt,
        updatedAt: jadwalKuliah.updatedAt,
      })
      .from(jadwalKuliah)
      .leftJoin(programStudi, eq(jadwalKuliah.prodiId, programStudi.id))
      .where(eq(jadwalKuliah.id, jadwalId))
      .limit(1);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/akademik/jadwal/[id]]", error);
    return NextResponse.json({ error: "Gagal mengupdate jadwal kuliah" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// DELETE /api/akademik/jadwal/[id] — Soft delete
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
  const jadwalId = parseInt(id, 10);
  if (isNaN(jadwalId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: jadwalKuliah.id, tahunAjaran: jadwalKuliah.tahunAjaran, semester: jadwalKuliah.semester })
    .from(jadwalKuliah)
    .where(and(eq(jadwalKuliah.id, jadwalId), isNull(jadwalKuliah.deletedAt)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Jadwal kuliah tidak ditemukan" }, { status: 404 });
  }

  await db
    .update(jadwalKuliah)
    .set({ deletedAt: new Date() })
    .where(eq(jadwalKuliah.id, jadwalId));

  await logActivity({
    userId: Number(session.user.id),
    action: "delete",
    module: "jadwal_kuliah",
    recordId: jadwalId,
    detail: JSON.stringify({ tahunAjaran: existing.tahunAjaran, semester: existing.semester }),
  });

  return NextResponse.json({ success: true });
}
