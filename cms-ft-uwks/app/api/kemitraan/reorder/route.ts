import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { kemitraan } from "@/lib/db/schema";
import { reorderSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// PATCH /api/kemitraan/reorder
// Body: { items: [{id, orderIndex}] }
// ─────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = reorderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { items } = parsed.data;

    // Update semua order_index secara batch
    await Promise.all(
      items.map(({ id, orderIndex }) =>
        db
          .update(kemitraan)
          .set({ orderIndex })
          .where(eq(kemitraan.id, id))
      )
    );

    await logActivity({
      userId: Number(session.user.id),
      action: "reorder",
      module: "kemitraan",
      detail: JSON.stringify({ count: items.length }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PATCH /api/kemitraan/reorder]", error);
    return NextResponse.json({ error: "Gagal mengubah urutan kemitraan" }, { status: 500 });
  }
}
