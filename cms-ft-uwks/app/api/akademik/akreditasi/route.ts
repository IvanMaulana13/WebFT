import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { akreditasi, programStudi } from "@/lib/db/schema";
import { akreditasiSchema } from "@/lib/validations";
import { and, eq, isNull } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// GET /api/akademik/akreditasi
// Query params: prodi_id
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const prodiIdParam = searchParams.get("prodi_id");

  const conditions = [isNull(akreditasi.deletedAt)];

  if (prodiIdParam) {
    const prodiId = parseInt(prodiIdParam, 10);
    if (!isNaN(prodiId)) conditions.push(eq(akreditasi.prodiId, prodiId));
  }

  const data = await db
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
    .where(and(...conditions))
    .orderBy(akreditasi.createdAt);

  return NextResponse.json({ data });
}

// ─────────────────────────────────────────────
// POST /api/akademik/akreditasi — Create
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = akreditasiSchema.safeParse(body);
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

    const [inserted] = await db
      .insert(akreditasi)
      .values({ prodiId, peringkat, noSk, tanggalBerlaku: new Date(tanggalBerlaku), fileSertifikat })
      .$returningId();

    await logActivity({
      userId: Number(session.user.id),
      action: "create",
      module: "akreditasi",
      recordId: inserted.id,
      detail: JSON.stringify({ prodi: prodi.nama, peringkat, noSk }),
    });

    const [newRecord] = await db
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
      .where(eq(akreditasi.id, inserted.id))
      .limit(1);

    return NextResponse.json({ data: newRecord }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/akademik/akreditasi]", error);
    return NextResponse.json({ error: "Gagal membuat data akreditasi" }, { status: 500 });
  }
}
