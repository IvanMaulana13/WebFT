import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { prosedurAkademik } from "@/lib/db/schema";
import { prosedurAkademikSchema } from "@/lib/validations";
import { and, isNull, like, or } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// GET /api/akademik/prosedur
// Query params: search (judul_sop / penanggung_jawab)
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  const conditions = [isNull(prosedurAkademik.deletedAt)];

  if (search) {
    conditions.push(
      or(
        like(prosedurAkademik.judulSop, `%${search}%`),
        like(prosedurAkademik.penanggungJawab, `%${search}%`)
      )!
    );
  }

  const data = await db
    .select()
    .from(prosedurAkademik)
    .where(and(...conditions))
    .orderBy(prosedurAkademik.createdAt);

  return NextResponse.json({ data });
}

// ─────────────────────────────────────────────
// POST /api/akademik/prosedur — Create
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = prosedurAkademikSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { judulSop, narasi, penanggungJawab, fileUrl, linkUrl } = parsed.data;

    const [inserted] = await db
      .insert(prosedurAkademik)
      .values({
        judulSop,
        narasi,
        penanggungJawab,
        fileUrl: fileUrl && fileUrl.trim() !== "" ? fileUrl : null,
        linkUrl: linkUrl && linkUrl.trim() !== "" ? linkUrl : null,
      })
      .$returningId();

    await logActivity({
      userId: Number(session.user.id),
      action: "create",
      module: "prosedur_akademik",
      recordId: inserted.id,
      detail: JSON.stringify({ judulSop, penanggungJawab }),
    });

    const [newRecord] = await db
      .select()
      .from(prosedurAkademik)
      .where(and(isNull(prosedurAkademik.deletedAt)))
      .limit(1);

    return NextResponse.json({ data: newRecord }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/akademik/prosedur]", error);
    return NextResponse.json({ error: "Gagal membuat prosedur akademik" }, { status: 500 });
  }
}
