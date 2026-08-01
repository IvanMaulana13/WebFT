import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { strukturOrganisasi, activityLogs } from "@/lib/db/schema";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { sql } from "drizzle-orm";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

// Pastikan selalu ada setidaknya 1 baris (seed guard)
async function ensureRow() {
  const [existing] = await db
    .select({ id: strukturOrganisasi.id })
    .from(strukturOrganisasi)
    .limit(1);

  if (!existing) {
    await db
      .insert(strukturOrganisasi)
      .values({ imageUrl: null, updatedBy: null });
  }
}

// ─────────────────────────────────────────────
// GET /api/struktur-organisasi
// ─────────────────────────────────────────────
export async function GET() {
  try {
    await ensureRow();
    const [row] = await db.select().from(strukturOrganisasi).limit(1);
    return NextResponse.json({ data: row ?? null });
  } catch (error) {
    console.error("[GET /api/struktur-organisasi]", error);
    return NextResponse.json(
      { error: "Gagal mengambil data struktur organisasi" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// POST /api/struktur-organisasi — Upload/Replace gambar
// Selalu UPDATE baris yang sudah ada, tidak INSERT baru.
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    // Validasi tipe
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP." },
        { status: 400 }
      );
    }

    // Validasi ukuran 5MB
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Ukuran file melebihi 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext =
      file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
    const uniqueName = `struktur-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, uniqueName), buffer);

    const imageUrl = `/uploads/${uniqueName}`;

    await ensureRow();

    // Selalu UPDATE semua baris (single-record table — hanya ada 1 baris)
    await db
      .update(strukturOrganisasi)
      .set({ imageUrl, updatedBy: null })
      .where(sql`1 = 1`);

    await db.insert(activityLogs).values({
      action: "update",
      module: "struktur_organisasi",
      recordId: 1,
      detail: `Mengganti gambar struktur organisasi: ${imageUrl}`,
    });

    const [updated] = await db.select().from(strukturOrganisasi).limit(1);
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[POST /api/struktur-organisasi]", error);
    return NextResponse.json(
      { error: "Gagal mengunggah gambar struktur organisasi" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// DELETE /api/struktur-organisasi — Kosongkan image_url
// ─────────────────────────────────────────────
export async function DELETE() {
  try {
    await ensureRow();

    await db
      .update(strukturOrganisasi)
      .set({ imageUrl: null, updatedBy: null })
      .where(sql`1 = 1`);

    await db.insert(activityLogs).values({
      action: "delete",
      module: "struktur_organisasi",
      recordId: 1,
      detail: "Menghapus gambar struktur organisasi",
    });

    return NextResponse.json({ message: "Gambar berhasil dihapus" });
  } catch (error) {
    console.error("[DELETE /api/struktur-organisasi]", error);
    return NextResponse.json(
      { error: "Gagal menghapus gambar" },
      { status: 500 }
    );
  }
}
