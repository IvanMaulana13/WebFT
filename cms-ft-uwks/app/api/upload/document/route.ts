import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";

// PDF dan image diizinkan untuk dokumen akademik
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/x-pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "webp"];
const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

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

    const fileType = (file.type || "").toLowerCase();
    const rawExt = path.extname(file.name || "").toLowerCase().replace(/^\./, "");

    // Validasi tipe file via MIME atau ekstensi nama file
    const isValidType =
      ALLOWED_MIME_TYPES.includes(fileType) ||
      ALLOWED_EXTENSIONS.includes(rawExt);

    if (!isValidType) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung. Gunakan file PDF, JPG, PNG, atau WebP." },
        { status: 400 }
      );
    }

    // Validasi ukuran
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Ukuran file melebihi batas 15MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tentukan ekstensi yang konsisten
    let ext = rawExt || "pdf";
    if (fileType === "application/pdf" || fileType === "application/x-pdf") {
      ext = "pdf";
    } else if (fileType === "image/jpeg" || ext === "jpeg") {
      ext = "jpg";
    } else if (fileType === "image/png") {
      ext = "png";
    } else if (fileType === "image/webp") {
      ext = "webp";
    }

    // Nama file unik dengan prefix 'doc-' untuk membedakan dari upload umum
    const uniqueName = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

    // Pastikan folder uploads ada
    const uploadDir = path.resolve(process.cwd(), "public", "uploads");
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
