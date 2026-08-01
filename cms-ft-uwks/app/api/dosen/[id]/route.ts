import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dosen, activityLogs } from "@/lib/db/schema";
import { dosenUpdateSchema } from "@/lib/validations";
import { and, eq, isNull, ne } from "drizzle-orm";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// ─────────────────────────────────────────────
// GET /api/dosen/[id] — Ambil detail satu dosen
// ─────────────────────────────────────────────
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id: idStr } = await context.params;
    const id = parseInt(idStr, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const [record] = await db
      .select()
      .from(dosen)
      .where(and(eq(dosen.id, id), isNull(dosen.deletedAt)))
      .limit(1);

    if (!record) {
      return NextResponse.json(
        { error: "Dosen tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: record });
  } catch (error) {
    console.error("[GET /api/dosen/[id]]", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dosen" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// PUT /api/dosen/[id] — Update data dosen
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
      .from(dosen)
      .where(and(eq(dosen.id, id), isNull(dosen.deletedAt)))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Dosen tidak ditemukan" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validasi Zod
    const parsed = dosenUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { photoUrl, nik, kodeDosen, nidn, name, prodi, email } = parsed.data;

    // Cek NIK unik (exclude current record)
    const duplicateNik = await db
      .select({ id: dosen.id })
      .from(dosen)
      .where(
        and(
          eq(dosen.nik, nik),
          isNull(dosen.deletedAt),
          ne(dosen.id, id)
        )
      )
      .limit(1);

    if (duplicateNik.length > 0) {
      return NextResponse.json(
        {
          error: "Validasi duplikat",
          details: { nik: ["NIK sudah digunakan oleh dosen lain"] },
        },
        { status: 409 }
      );
    }

    // Cek Kode Dosen unik (exclude current record)
    const duplicateKode = await db
      .select({ id: dosen.id })
      .from(dosen)
      .where(
        and(
          eq(dosen.kodeDosen, kodeDosen),
          isNull(dosen.deletedAt),
          ne(dosen.id, id)
        )
      )
      .limit(1);

    if (duplicateKode.length > 0) {
      return NextResponse.json(
        {
          error: "Validasi duplikat",
          details: { kodeDosen: ["Kode Dosen sudah digunakan oleh dosen lain"] },
        },
        { status: 409 }
      );
    }

    // Cek NIDN unik (exclude current record)
    const duplicateNidn = await db
      .select({ id: dosen.id })
      .from(dosen)
      .where(
        and(
          eq(dosen.nidn, nidn),
          isNull(dosen.deletedAt),
          ne(dosen.id, id)
        )
      )
      .limit(1);

    if (duplicateNidn.length > 0) {
      return NextResponse.json(
        {
          error: "Validasi duplikat",
          details: { nidn: ["NIDN sudah digunakan oleh dosen lain"] },
        },
        { status: 409 }
      );
    }

    await db
      .update(dosen)
      .set({
        photoUrl: photoUrl && photoUrl.trim() !== "" ? photoUrl : null,
        nik,
        kodeDosen,
        nidn,
        name,
        prodi,
        email,
      })
      .where(eq(dosen.id, id));

    // Catat activity log
    await db.insert(activityLogs).values({
      action: "update",
      module: "dosen",
      recordId: id,
      detail: `Memperbarui dosen: ${name} (NIK: ${nik})`,
    });

    const [updated] = await db
      .select()
      .from(dosen)
      .where(eq(dosen.id, id))
      .limit(1);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/dosen/[id]]", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data dosen" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// DELETE /api/dosen/[id] — Soft Delete
// ─────────────────────────────────────────────
export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id: idStr } = await context.params;
    const id = parseInt(idStr, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    // Pastikan record ada dan belum soft-deleted
    const [existing] = await db
      .select()
      .from(dosen)
      .where(and(eq(dosen.id, id), isNull(dosen.deletedAt)))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Dosen tidak ditemukan" },
        { status: 404 }
      );
    }

    // Soft delete: set deleted_at = now()
    await db
      .update(dosen)
      .set({ deletedAt: new Date() })
      .where(eq(dosen.id, id));

    // Catat activity log
    await db.insert(activityLogs).values({
      action: "delete",
      module: "dosen",
      recordId: id,
      detail: `Menghapus dosen: ${existing.name} (NIK: ${existing.nik})`,
    });

    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.error("[DELETE /api/dosen/[id]]", error);
    return NextResponse.json(
      { error: "Gagal menghapus data dosen" },
      { status: 500 }
    );
  }
}
