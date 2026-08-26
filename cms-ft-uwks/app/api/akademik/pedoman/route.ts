import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { pedomanAkademik, users } from "@/lib/db/schema";
import { pedomanAkademikSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// GET /api/akademik/pedoman — Get the active single record
// ─────────────────────────────────────────────
export async function GET() {
  const [record] = await db
    .select({
      id: pedomanAkademik.id,
      fileUrl: pedomanAkademik.fileUrl,
      updatedAt: pedomanAkademik.updatedAt,
      updatedBy: pedomanAkademik.updatedBy,
      updatedByName: users.name,
    })
    .from(pedomanAkademik)
    .leftJoin(users, eq(pedomanAkademik.updatedBy, users.id))
    .limit(1);

  return NextResponse.json({ data: record ?? null });
}

// ─────────────────────────────────────────────
// POST /api/akademik/pedoman — Upsert (replace single record)
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = pedomanAkademikSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { fileUrl } = parsed.data;
    const userId = Number(session.user.id);

    const [existing] = await db.select({ id: pedomanAkademik.id }).from(pedomanAkademik).limit(1);

    if (existing) {
      await db
        .update(pedomanAkademik)
        .set({ fileUrl, updatedBy: userId })
        .where(eq(pedomanAkademik.id, existing.id));

      await logActivity({
        userId,
        action: "update",
        module: "pedoman_akademik",
        recordId: existing.id,
        detail: "File pedoman akademik diganti",
      });
    } else {
      await db.insert(pedomanAkademik).values({ fileUrl, updatedBy: userId });

      await logActivity({
        userId,
        action: "create",
        module: "pedoman_akademik",
        detail: "File pedoman akademik ditambahkan",
      });
    }

    const [updated] = await db
      .select({
        id: pedomanAkademik.id,
        fileUrl: pedomanAkademik.fileUrl,
        updatedAt: pedomanAkademik.updatedAt,
        updatedBy: pedomanAkademik.updatedBy,
        updatedByName: users.name,
      })
      .from(pedomanAkademik)
      .leftJoin(users, eq(pedomanAkademik.updatedBy, users.id))
      .limit(1);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[POST /api/akademik/pedoman]", error);
    return NextResponse.json({ error: "Gagal menyimpan pedoman akademik" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// DELETE /api/akademik/pedoman — Clear file (set null)
// ─────────────────────────────────────────────
export async function DELETE(_request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [existing] = await db.select({ id: pedomanAkademik.id }).from(pedomanAkademik).limit(1);
  if (!existing) {
    return NextResponse.json({ error: "Tidak ada data pedoman akademik" }, { status: 404 });
  }

  await db
    .update(pedomanAkademik)
    .set({ fileUrl: null, updatedBy: Number(session.user.id) })
    .where(eq(pedomanAkademik.id, existing.id));

  await logActivity({
    userId: Number(session.user.id),
    action: "delete",
    module: "pedoman_akademik",
    recordId: existing.id,
    detail: "File pedoman akademik dihapus",
  });

  return NextResponse.json({ success: true });
}
