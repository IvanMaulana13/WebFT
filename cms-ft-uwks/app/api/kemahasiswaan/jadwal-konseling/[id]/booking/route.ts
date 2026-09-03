import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jadwalKonseling } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

const bookingSchema = z.object({
  nama_pemesan: z.string().min(1, "Nama pemesan wajib diisi").max(255),
  nim_pemesan: z.string().min(1, "NIM wajib diisi").max(50),
  keperluan: z.string().min(1, "Keperluan wajib diisi").max(1000),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const jadwalId = parseInt(id, 10);
  if (isNaN(jadwalId)) {
    return NextResponse.json({ error: "ID jadwal tidak valid" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    // Check if slot exists and is available
    const [existing] = await db
      .select()
      .from(jadwalKonseling)
      .where(
        and(
          eq(jadwalKonseling.id, jadwalId),
          eq(jadwalKonseling.status, "tersedia"),
          isNull(jadwalKonseling.deletedAt)
        )
      )
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Slot jadwal sudah terisi atau tidak ditemukan" },
        { status: 400 }
      );
    }

    // Update status to 'terisi'
    await db
      .update(jadwalKonseling)
      .set({
        status: "terisi",
      })
      .where(eq(jadwalKonseling.id, jadwalId));

    return NextResponse.json({
      success: true,
      message: "Permintaan janji temu berhasil dikirim, silakan konfirmasi ulang ke kontak penanggung jawab.",
    });
  } catch (error) {
    console.error("[POST /api/kemahasiswaan/jadwal-konseling/[id]/booking]", error);
    return NextResponse.json(
      { error: "Gagal memproses booking jadwal konseling" },
      { status: 500 }
    );
  }
}
