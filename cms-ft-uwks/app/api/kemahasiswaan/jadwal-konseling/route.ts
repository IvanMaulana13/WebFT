import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jadwalKonseling } from "@/lib/db/schema";
import { jadwalKonselingSchema } from "@/lib/validations";
import { and, asc, isNull, eq } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status")?.trim();

  const conditions = [isNull(jadwalKonseling.deletedAt)];
  if (statusFilter && (statusFilter === "tersedia" || statusFilter === "terisi")) {
    conditions.push(eq(jadwalKonseling.status, statusFilter));
  }

  const rows = await db
    .select()
    .from(jadwalKonseling)
    .where(and(...conditions))
    .orderBy(asc(jadwalKonseling.tanggal), asc(jadwalKonseling.jam));

  return NextResponse.json({ data: rows });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const [inserted] = await db
      .insert(jadwalKonseling)
      .values({
        tanggal: new Date(tanggal),
        jam,
        status: status || "tersedia",
      })
      .$returningId();

    await logActivity({
      userId: Number(session.user.id),
      action: "create",
      module: "jadwal_konseling",
      recordId: inserted.id,
      detail: JSON.stringify({ tanggal, jam }),
    });

    const [created] = await db
      .select()
      .from(jadwalKonseling)
      .where(isNull(jadwalKonseling.deletedAt))
      .limit(1);

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/kemahasiswaan/jadwal-konseling]", error);
    return NextResponse.json({ error: "Gagal menambahkan jadwal" }, { status: 500 });
  }
}
