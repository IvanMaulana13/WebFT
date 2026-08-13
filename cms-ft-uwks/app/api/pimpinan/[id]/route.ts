import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pimpinanFakultas, activityLogs } from "@/lib/db/schema";
import { pimpinanUpdateSchema } from "@/lib/validations";
import { and, eq, isNull } from "drizzle-orm";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// ─────────────────────────────────────────────
// GET /api/pimpinan/[id]
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
      .from(pimpinanFakultas)
      .where(and(eq(pimpinanFakultas.id, id), isNull(pimpinanFakultas.deletedAt)))
      .limit(1);

    if (!record) {
      return NextResponse.json(
        { error: "Pimpinan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: record });
  } catch (error) {
    console.error("[GET /api/pimpinan/[id]]", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pimpinan" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// PUT /api/pimpinan/[id]
// ─────────────────────────────────────────────
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id: idStr } = await context.params;
    const id = parseInt(idStr, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(pimpinanFakultas)
      .where(and(eq(pimpinanFakultas.id, id), isNull(pimpinanFakultas.deletedAt)))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Pimpinan tidak ditemukan" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const parsed = pimpinanUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, photoUrl, jabatan, periodeMulai, periodeSelesai, sambutan } =
      parsed.data;

    await db
      .update(pimpinanFakultas)
      .set({
        name,
        photoUrl: photoUrl?.trim() || null,
        jabatan,
        periodeMulai: periodeMulai?.trim()
          ? new Date(periodeMulai.trim())
          : null,
        periodeSelesai: periodeSelesai?.trim()
          ? new Date(periodeSelesai.trim())
          : null,
        sambutan:
          jabatan === "Dekan" && sambutan?.trim()
            ? sambutan.trim()
            : null,
      })
      .where(eq(pimpinanFakultas.id, id));

    await db.insert(activityLogs).values({
      action: "update",
      module: "pimpinan_fakultas",
      recordId: id,
      detail: `Memperbarui pimpinan: ${name} (${jabatan})`,
    });

    const [updated] = await db
      .select()
      .from(pimpinanFakultas)
      .where(eq(pimpinanFakultas.id, id))
      .limit(1);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/pimpinan/[id]]", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data pimpinan" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// DELETE /api/pimpinan/[id] — Soft Delete
// ─────────────────────────────────────────────
export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id: idStr } = await context.params;
    const id = parseInt(idStr, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(pimpinanFakultas)
      .where(and(eq(pimpinanFakultas.id, id), isNull(pimpinanFakultas.deletedAt)))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Pimpinan tidak ditemukan" },
        { status: 404 }
      );
    }

    await db
      .update(pimpinanFakultas)
      .set({ deletedAt: new Date() })
      .where(eq(pimpinanFakultas.id, id));

    await db.insert(activityLogs).values({
      action: "delete",
      module: "pimpinan_fakultas",
      recordId: id,
      detail: `Menghapus pimpinan: ${existing.name} (${existing.jabatan})`,
    });

    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.error("[DELETE /api/pimpinan/[id]]", error);
    return NextResponse.json(
      { error: "Gagal menghapus data pimpinan" },
      { status: 500 }
    );
  }
}
