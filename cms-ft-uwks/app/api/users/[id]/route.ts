import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { updateUserSchema } from "@/lib/validations";
import { logActivity } from "@/lib/activity-log";

/**
 * PATCH /api/users/[id]
 * Update user (nama, email, role, is_active) — hanya super_admin
 * Nonaktifkan user: set is_active = false (bukan hapus permanen)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "super_admin") {
    return NextResponse.json(
      { error: "Forbidden: hanya super_admin yang dapat mengubah user." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validasi gagal.", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // Cek apakah user ada
  const [existingUser] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!existingUser) {
    return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });
  }

  // Jika ganti email, cek duplikat
  if (parsed.data.email && parsed.data.email !== existingUser.email) {
    const [emailTaken] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, parsed.data.email))
      .limit(1);

    if (emailTaken) {
      return NextResponse.json(
        { error: "Email sudah digunakan oleh user lain." },
        { status: 409 }
      );
    }
  }

  // Build update payload (hanya field yang dikirim)
  const updateData: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
  if (parsed.data.email !== undefined) updateData.email = parsed.data.email;
  if (parsed.data.role !== undefined) updateData.role = parsed.data.role;
  if (parsed.data.isActive !== undefined) updateData.isActive = parsed.data.isActive;

  await db.update(users).set(updateData).where(eq(users.id, userId));

  // Log activity
  const action = parsed.data.isActive === false ? "deactivate" : "update";
  await logActivity({
    userId: Number(session.user.id),
    action,
    module: "users",
    recordId: userId,
    detail: JSON.stringify(parsed.data),
  });

  return NextResponse.json({ success: true });
}
