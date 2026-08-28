import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ormawa } from "@/lib/db/schema";
import { ormawaSchema } from "@/lib/validations";
import { and, isNull, like } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const search = new URL(request.url).searchParams.get("search")?.trim() ?? "";
  const rows = await db
    .select()
    .from(ormawa)
    .where(and(isNull(ormawa.deletedAt), search ? like(ormawa.nama, `%${search}%`) : undefined))
    .orderBy(ormawa.createdAt);

  return NextResponse.json({ data: rows });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = ormawaSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Validasi gagal", details: parsed.error.flatten().fieldErrors }, { status: 422 });

    const { nama, logoUrl, deskripsi, websiteUrl, instagramUrl } = parsed.data;
    const [inserted] = await db.insert(ormawa).values({ nama, logoUrl: logoUrl || null, deskripsi, websiteUrl: websiteUrl || null, instagramUrl: instagramUrl || null }).$returningId();

    await logActivity({ userId: Number(session.user.id), action: "create", module: "ormawa", recordId: inserted.id, detail: JSON.stringify({ nama }) });

    const [created] = await db.select().from(ormawa).where(isNull(ormawa.deletedAt)).limit(1);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/kemahasiswaan/ormawa]", error);
    return NextResponse.json({ error: "Gagal menambahkan ormawa" }, { status: 500 });
  }
}
