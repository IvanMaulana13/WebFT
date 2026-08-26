import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";

// PDF dan image diizinkan untuk dokumen akademik
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
        { error: "Tipe file tidak didukung. Gunakan PDF, JPG, atau PNG." },
        { status: 400 }
      );
    }

    // Validasi ukuran
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Ukuran file melebihi 10MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tentukan ekstensi
    let ext = "pdf";
    if (file.type === "image/jpeg") ext = "jpg";
    else if (file.type === "image/png") ext = "png";

    // Nama file unik dengan prefix 'doc-' untuk membedakan dari gambar biasa
    const uniqueName = `doc-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Pastikan folder uploads ada
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${uniqueName}`;

    return NextResponse.json({ url, fileName: file.name }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/upload/document]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengunggah file" },
      { status: 500 }
    );
  }
}
