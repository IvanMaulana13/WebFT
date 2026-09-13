import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "svg"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

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

    // Validasi tipe
    const isValid =
      ALLOWED_MIME_TYPES.includes(fileType) ||
      ALLOWED_EXTENSIONS.includes(rawExt);

    if (!isValid) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung. Gunakan JPG, PNG, WebP, GIF, atau SVG." },
        { status: 400 }
      );
    }

    // Validasi ukuran
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Ukuran file melebihi batas 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat ekstensi konsisten
    let ext = rawExt || "jpg";
    if (fileType === "image/jpeg" || ext === "jpeg") ext = "jpg";
    else if (fileType === "image/png") ext = "png";
    else if (fileType === "image/webp") ext = "webp";
    else if (fileType === "image/gif") ext = "gif";
    else if (fileType === "image/svg+xml") ext = "svg";

    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

    // Pastikan folder uploads ada
    const uploadDir = path.resolve(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${uniqueName}`;

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/upload]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengunggah file" },
      { status: 500 }
    );
  }
}
