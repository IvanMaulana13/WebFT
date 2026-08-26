import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { prosedurAkademik } from "@/lib/db/schema";
import { prosedurAkademikUpdateSchema } from "@/lib/validations";
import { and, eq, isNull } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// PUT /api/akademik/prosedur/[id] — Update
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
  const prosedurId = parseInt(id, 10);
  if (isNaN(prosedurId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: prosedurAkademik.id })
    .from(prosedurAkademik)
    .where(and(eq(prosedurAkademik.id, prosedurId), isNull(prosedurAkademik.deletedAt)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Prosedur akademik tidak ditemukan" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const parsed = prosedurAkademikUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { judulSop, narasi, penanggungJawab, fileUrl, linkUrl } = parsed.data;

    await db
      .update(prosedurAkademik)
      .set({
        judulSop,
        narasi,
        penanggungJawab,
        fileUrl: fileUrl && fileUrl.trim() !== "" ? fileUrl : null,
        linkUrl: linkUrl && linkUrl.trim() !== "" ? linkUrl : null,
      })
      .where(eq(prosedurAkademik.id, prosedurId));

    await logActivity({
      userId: Number(session.user.id),
      action: "update",
      module: "prosedur_akademik",
      recordId: prosedurId,
      detail: JSON.stringify({ judulSop, penanggungJawab }),
    });

    const [updated] = await db
      .select()
      .from(prosedurAkademik)
      .where(eq(prosedurAkademik.id, prosedurId))
      .limit(1);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/akademik/prosedur/[id]]", error);
    return NextResponse.json({ error: "Gagal mengupdate prosedur akademik" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// DELETE /api/akademik/prosedur/[id] — Soft delete
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
  const prosedurId = parseInt(id, 10);
  if (isNaN(prosedurId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: prosedurAkademik.id, judulSop: prosedurAkademik.judulSop })
    .from(prosedurAkademik)
    .where(and(eq(prosedurAkademik.id, prosedurId), isNull(prosedurAkademik.deletedAt)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Prosedur akademik tidak ditemukan" }, { status: 404 });
  }

  await db
    .update(prosedurAkademik)
    .set({ deletedAt: new Date() })
    .where(eq(prosedurAkademik.id, prosedurId));

  await logActivity({
    userId: Number(session.user.id),
    action: "delete",
    module: "prosedur_akademik",
    recordId: prosedurId,
    detail: JSON.stringify({ judulSop: existing.judulSop }),
  });

  return NextResponse.json({ success: true });
}
