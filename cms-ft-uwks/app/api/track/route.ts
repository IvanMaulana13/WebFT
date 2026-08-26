import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitorLogs } from "@/lib/db/schema";

// UUID v4 regex - server-side validation sebelum INSERT
const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * POST /api/track
 *
 * Menerima visitor_id (UUID dari cookie) dan path halaman yang dikunjungi.
 * Hanya menyimpan data anonim - tidak ada IP, nama, atau data pribadi.
 *
 * Body: { visitorId: string, path: string }
 */
export async function POST(request: NextRequest) {
  try {
    let body: { visitorId?: unknown; path?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { visitorId, path } = body;

    // Validasi visitorId: harus UUID v4 yang valid
    if (
      typeof visitorId !== "string" ||
      !UUID_V4_REGEX.test(visitorId)
    ) {
      return NextResponse.json(
        { error: "Invalid visitor_id" },
        { status: 400 }
      );
    }

    // Validasi path: harus string, panjang wajar
    if (
      typeof path !== "string" ||
      path.length === 0 ||
      path.length > 500
    ) {
      return NextResponse.json(
        { error: "Invalid path" },
        { status: 400 }
      );
    }

    // Normalisasi path: pastikan dimulai dengan "/"
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    // Insert satu baris visitor log - efisien, tidak ada SELECT sebelumnya.
    // Unique visitor dihitung via COUNT(DISTINCT visitor_id) di stats query.
    await db.insert(visitorLogs).values({
      visitorId,
      path: normalizedPath,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/track]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
