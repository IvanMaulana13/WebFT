import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tenagaPendidikan, activityLogs } from "@/lib/db/schema";
import { tenagaPendidikanUpdateSchema } from "@/lib/validations";
import { and, eq, isNull, ne } from "drizzle-orm";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// ─────────────────────────────────────────────
// PUT /api/tenaga-pendidikan/[id]
// ─────────────────────────────────────────────
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id: idStr } = await context.params;
    const id = parseInt(idStr, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    // Pastikan record ada dan tidak soft-deleted
    const [existing] = await db
      .select()
      .from(tenagaPendidikan)
      .where(and(eq(tenagaPendidikan.id, id), isNull(tenagaPendidikan.deletedAt)))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Tenaga pendidikan tidak ditemukan" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validasi Zod
    const parsed = tenagaPendidikanUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, jabatan, email, nuptk, photoUrl } = parsed.data;

    // Cek NUPTK unik jika diisi (exclude current record)
    if (nuptk && nuptk.trim() !== "") {
      const duplicate = await db
        .select({ id: tenagaPendidikan.id })
        .from(tenagaPendidikan)
        .where(
          and(
            eq(tenagaPendidikan.nuptk, nuptk),
            isNull(tenagaPendidikan.deletedAt),
            ne(tenagaPendidikan.id, id)
          )
        )
        .limit(1);

      if (duplicate.length > 0) {
        return NextResponse.json(
          { error: "NUPTK sudah digunakan oleh tenaga pendidikan lain" },
          { status: 400 }
        );
      }
    }

    await db
      .update(tenagaPendidikan)
      .set({
        name,
        jabatan,
        email,
        nuptk: nuptk && nuptk.trim() !== "" ? nuptk : null,
        photoUrl: photoUrl && photoUrl.trim() !== "" ? photoUrl : null,
      })
      .where(eq(tenagaPendidikan.id, id));

    // Catat activity log
    await db.insert(activityLogs).values({
      action: "update",
      module: "tenaga_pendidikan",
      recordId: id,
      detail: `Memperbarui tenaga pendidikan: ${name}`,
    });

    const [updated] = await db
      .select()
      .from(tenagaPendidikan)
      .where(eq(tenagaPendidikan.id, id))
      .limit(1);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/tenaga-pendidikan/[id]]", error);
    return NextResponse.json(
      { error: "Gagal memperbarui tenaga pendidikan" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// DELETE /api/tenaga-pendidikan/[id] — Soft Delete
// ─────────────────────────────────────────────
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id: idStr } = await context.params;
    const id = parseInt(idStr, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    // Pastikan record ada dan belum soft-deleted
    const [existing] = await db
      .select()
      .from(tenagaPendidikan)
      .where(and(eq(tenagaPendidikan.id, id), isNull(tenagaPendidikan.deletedAt)))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Tenaga pendidikan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Soft delete: set deleted_at = now()
    await db
      .update(tenagaPendidikan)
      .set({ deletedAt: new Date() })
      .where(eq(tenagaPendidikan.id, id));

    // Catat activity log
    await db.insert(activityLogs).values({
      action: "delete",
      module: "tenaga_pendidikan",
      recordId: id,
      detail: `Menghapus tenaga pendidikan: ${existing.name}`,
    });

    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.error("[DELETE /api/tenaga-pendidikan/[id]]", error);
    return NextResponse.json(
      { error: "Gagal menghapus tenaga pendidikan" },
      { status: 500 }
    );
  }
}
