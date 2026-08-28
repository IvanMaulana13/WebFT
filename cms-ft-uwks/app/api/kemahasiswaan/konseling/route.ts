import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { konselingLayanan } from "@/lib/db/schema";
import { konselingLayananSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

export async function GET(_request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let [data] = await db
    .select()
    .from(konselingLayanan)
    .where(eq(konselingLayanan.id, 1))
    .limit(1);

  // Fallback to empty if not seeded yet
  if (!data) {
    data = {
      id: 1,
      narasi: null,
      offlineAktif: false,
      lokasi: null,
      jamLayananOffline: null,
      onlineAktif: false,
      kontakPenanggungJawab: null,
      updatedBy: null,
      updatedAt: new Date(),
    };
  }

  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = konselingLayananSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const {
      narasi,
      offlineAktif,
      lokasi,
      jamLayananOffline,
      onlineAktif,
      kontakPenanggungJawab,
    } = parsed.data;

    // Check if it exists
    const [existing] = await db.select().from(konselingLayanan).where(eq(konselingLayanan.id, 1)).limit(1);

    if (existing) {
      await db
        .update(konselingLayanan)
        .set({
          narasi: narasi || null,
          offlineAktif,
          lokasi: lokasi || null,
          jamLayananOffline: jamLayananOffline || null,
          onlineAktif,
          kontakPenanggungJawab: kontakPenanggungJawab || null,
          updatedBy: Number(session.user.id),
        })
        .where(eq(konselingLayanan.id, 1));
    } else {
       await db.insert(konselingLayanan).values({
         id: 1,
         narasi: narasi || null,
         offlineAktif,
         lokasi: lokasi || null,
         jamLayananOffline: jamLayananOffline || null,
         onlineAktif,
         kontakPenanggungJawab: kontakPenanggungJawab || null,
         updatedBy: Number(session.user.id),
       });
    }

    await logActivity({
      userId: Number(session.user.id),
      action: "update",
      module: "konseling_layanan",
      recordId: 1,
      detail: JSON.stringify({ offlineAktif, onlineAktif }),
    });

    const [updated] = await db
      .select()
      .from(konselingLayanan)
      .where(eq(konselingLayanan.id, 1))
      .limit(1);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/kemahasiswaan/konseling]", error);
    return NextResponse.json({ error: "Gagal mengupdate info layanan konseling" }, { status: 500 });
  }
}
