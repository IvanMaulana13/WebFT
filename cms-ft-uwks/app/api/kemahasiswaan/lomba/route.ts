import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lomba } from "@/lib/db/schema";
import { lombaSchema } from "@/lib/validations";
import { and, desc, isNull, asc } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  // Filtering could be implemented here if needed.
  
  const rows = await db
    .select()
    .from(lomba)
    .where(isNull(lomba.deletedAt))
    .orderBy(asc(lomba.tanggalSelesaiPendaftaran));

  return NextResponse.json({ data: rows });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const [inserted] = await db
      .insert(lomba)
      .values({
        namaLomba: data.namaLomba,
        tingkat: data.tingkat,
        tanggalMulaiPendaftaran: new Date(data.tanggalMulaiPendaftaran),
        tanggalSelesaiPendaftaran: new Date(data.tanggalSelesaiPendaftaran),
        linkPendaftaran: data.linkPendaftaran,
        posterUrl: data.posterUrl || null,
        deskripsi: data.deskripsi,
      })
      .$returningId();

    await logActivity({
      userId: Number(session.user.id),
      action: "create",
      module: "lomba",
      recordId: inserted.id,
      detail: JSON.stringify({ namaLomba: data.namaLomba }),
    });

    const [created] = await db
      .select()
      .from(lomba)
      .where(isNull(lomba.deletedAt))
      .limit(1);

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/kemahasiswaan/lomba]", error);
    return NextResponse.json({ error: "Gagal menambahkan lomba" }, { status: 500 });
  }
}
