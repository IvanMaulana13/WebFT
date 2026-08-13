import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { logActivity } from "@/lib/activity-log";
import { sql } from "drizzle-orm";

const ALLOWED_TYPES = ["video/mp4", "video/webm"];
const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

/**
 * POST /api/settings/upload-video
 * Upload video hero (mp4/webm, max 20MB).
 * Langsung update hero_video_url di baris site_settings yang ada.
 */
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

    // Validasi tipe file
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung. Gunakan MP4 atau WebM." },
        { status: 400 }
      );
    }

    // Validasi ukuran file
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Ukuran file video melebihi 20MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tentukan ekstensi
    const ext = file.type === "video/mp4" ? "mp4" : "webm";
    const uniqueName = `hero-video-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Simpan ke /public/uploads/videos/
    const uploadDir = path.join(process.cwd(), "public", "uploads", "videos");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, uniqueName), buffer);

    const url = `/uploads/videos/${uniqueName}`;

    // Update hero_video_url di site_settings
    const userId = session.user.id ? parseInt(session.user.id) : null;
    await db
      .update(siteSettings)
      .set({ heroVideoUrl: url, updatedBy: userId })
      .where(sql`1 = 1`);

    await logActivity({
      userId,
      action: "update",
      module: "site_settings",
      recordId: 1,
      detail: JSON.stringify({ field: "hero_video_url", url }),
    });

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/settings/upload-video]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengunggah video" },
      { status: 500 }
    );
  }
}
