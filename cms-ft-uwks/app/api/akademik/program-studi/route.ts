import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { programStudi } from "@/lib/db/schema";
import { programStudiSchema } from "@/lib/validations";
import { eq, sql } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// GET /api/akademik/program-studi — Public (dropdown)
// ─────────────────────────────────────────────
export async function GET() {
  // Urutan custom: Teknik Sipil → Informatika → Teknologi Industri Pertanian
  const data = await db
    .select()
    .from(programStudi)
    .orderBy(
      sql`FIELD(${programStudi.kode}, 'TS', 'IF', 'TIP')`
    );

  return NextResponse.json({ data });
}


// ─────────────────────────────────────────────
// POST /api/akademik/program-studi — Super Admin only
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = programStudiSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { nama, kode } = parsed.data;

    // Cek kode unik
    const [existing] = await db
      .select({ id: programStudi.id })
      .from(programStudi)
      .where(eq(programStudi.kode, kode))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "Kode program studi sudah digunakan" },
        { status: 409 }
      );
    }

    const [inserted] = await db.insert(programStudi).values({ nama, kode }).$returningId();

    await logActivity({
      userId: Number(session.user.id),
      action: "create",
      module: "program_studi",
      recordId: inserted.id,
      detail: JSON.stringify({ nama, kode }),
    });

    const [newRecord] = await db
      .select()
      .from(programStudi)
      .where(eq(programStudi.id, inserted.id))
      .limit(1);

    return NextResponse.json({ data: newRecord }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/akademik/program-studi]", error);
    return NextResponse.json({ error: "Gagal membuat program studi" }, { status: 500 });
  }
}
