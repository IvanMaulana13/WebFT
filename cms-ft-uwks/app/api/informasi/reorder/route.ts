import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { informasi } from "@/lib/db/schema";
import { reorderSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/activity-log";

// ─────────────────────────────────────────────
// PATCH /api/informasi/reorder
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
          .update(informasi)
          .set({ orderIndex })
          .where(eq(informasi.id, id))
      )
    );

    await logActivity({
      userId: Number(session.user.id),
      action: "reorder",
      module: "informasi",
      detail: JSON.stringify({ count: items.length }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PATCH /api/informasi/reorder]", error);
    return NextResponse.json({ error: "Gagal mengubah urutan informasi" }, { status: 500 });
  }
}
