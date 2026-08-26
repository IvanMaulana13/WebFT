import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { kalenderAkademik, users } from "@/lib/db/schema";
import { kalenderAkademikSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// GET /api/akademik/kalender — Get the active single record
// ─────────────────────────────────────────────
export async function GET() {
  const [record] = await db
    .select({
      id: kalenderAkademik.id,
      fileUrl: kalenderAkademik.fileUrl,
      tahunAjaran: kalenderAkademik.tahunAjaran,
      updatedAt: kalenderAkademik.updatedAt,
      updatedBy: kalenderAkademik.updatedBy,
      updatedByName: users.name,
    })
    .from(kalenderAkademik)
    .leftJoin(users, eq(kalenderAkademik.updatedBy, users.id))
    .limit(1);

  return NextResponse.json({ data: record ?? null });
}

// ─────────────────────────────────────────────
// POST /api/akademik/kalender — Upsert (replace single record)
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = kalenderAkademikSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { fileUrl, tahunAjaran } = parsed.data;
    const userId = Number(session.user.id);

    // Cek apakah baris sudah ada
    const [existing] = await db.select({ id: kalenderAkademik.id }).from(kalenderAkademik).limit(1);

    if (existing) {
      // Update baris yang ada
      await db
        .update(kalenderAkademik)
        .set({ fileUrl, tahunAjaran, updatedBy: userId })
        .where(eq(kalenderAkademik.id, existing.id));

      await logActivity({
        userId,
        action: "update",
        module: "kalender_akademik",
        recordId: existing.id,
        detail: JSON.stringify({ tahunAjaran }),
      });
    } else {
      // Insert baris pertama
      await db.insert(kalenderAkademik).values({ fileUrl, tahunAjaran, updatedBy: userId });

      await logActivity({
        userId,
        action: "create",
        module: "kalender_akademik",
        detail: JSON.stringify({ tahunAjaran }),
      });
    }

    const [updated] = await db
      .select({
        id: kalenderAkademik.id,
        fileUrl: kalenderAkademik.fileUrl,
        tahunAjaran: kalenderAkademik.tahunAjaran,
        updatedAt: kalenderAkademik.updatedAt,
        updatedBy: kalenderAkademik.updatedBy,
        updatedByName: users.name,
      })
      .from(kalenderAkademik)
      .leftJoin(users, eq(kalenderAkademik.updatedBy, users.id))
      .limit(1);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[POST /api/akademik/kalender]", error);
    return NextResponse.json({ error: "Gagal menyimpan kalender akademik" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// DELETE /api/akademik/kalender — Clear file (set null)
// ─────────────────────────────────────────────
export async function DELETE(_request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [existing] = await db.select({ id: kalenderAkademik.id }).from(kalenderAkademik).limit(1);
  if (!existing) {
    return NextResponse.json({ error: "Tidak ada data kalender akademik" }, { status: 404 });
  }

  await db
    .update(kalenderAkademik)
    .set({ fileUrl: null, tahunAjaran: null, updatedBy: Number(session.user.id) })
    .where(eq(kalenderAkademik.id, existing.id));

  await logActivity({
    userId: Number(session.user.id),
    action: "delete",
    module: "kalender_akademik",
    recordId: existing.id,
    detail: "File kalender akademik dihapus",
  });

  return NextResponse.json({ success: true });
}
