import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jadwalKuliah, programStudi } from "@/lib/db/schema";
import { jadwalKuliahSchema } from "@/lib/validations";
import { and, eq, isNull, like } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// GET /api/akademik/jadwal
// Query params: prodi_id, semester, tahun_ajaran
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const prodiIdParam = searchParams.get("prodi_id");
  const semester = searchParams.get("semester");
  const tahunAjaran = searchParams.get("tahun_ajaran");

  const conditions = [isNull(jadwalKuliah.deletedAt)];

  if (prodiIdParam) {
    const prodiId = parseInt(prodiIdParam, 10);
    if (!isNaN(prodiId)) conditions.push(eq(jadwalKuliah.prodiId, prodiId));
  }
  if (semester && (semester === "ganjil" || semester === "genap")) {
    conditions.push(eq(jadwalKuliah.semester, semester));
  }
  if (tahunAjaran) {
    conditions.push(like(jadwalKuliah.tahunAjaran, `%${tahunAjaran}%`));
  }

  const data = await db
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
    .where(and(...conditions))
    .orderBy(jadwalKuliah.createdAt);

  return NextResponse.json({ data });
}

// ─────────────────────────────────────────────
// POST /api/akademik/jadwal — Create
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = jadwalKuliahSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { prodiId, fileUrl, semester, tahunAjaran } = parsed.data;

    // Validasi prodi_id ada di DB
    const [prodi] = await db
      .select({ id: programStudi.id, nama: programStudi.nama })
      .from(programStudi)
      .where(eq(programStudi.id, prodiId))
      .limit(1);

    if (!prodi) {
      return NextResponse.json({ error: "Program studi tidak ditemukan" }, { status: 422 });
    }

    const [inserted] = await db
      .insert(jadwalKuliah)
      .values({ prodiId, fileUrl, semester, tahunAjaran })
      .$returningId();

    await logActivity({
      userId: Number(session.user.id),
      action: "create",
      module: "jadwal_kuliah",
      recordId: inserted.id,
      detail: JSON.stringify({ prodi: prodi.nama, semester, tahunAjaran }),
    });

    const [newRecord] = await db
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
      .where(eq(jadwalKuliah.id, inserted.id))
      .limit(1);

    return NextResponse.json({ data: newRecord }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/akademik/jadwal]", error);
    return NextResponse.json({ error: "Gagal membuat jadwal kuliah" }, { status: 500 });
  }
}
