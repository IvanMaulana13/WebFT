import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createUserSchema } from "@/lib/validations";
import { logActivity } from "@/lib/activity-log";

/**
 * GET /api/users
 * List semua users — hanya super_admin
 */
export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "super_admin") {
    return NextResponse.json(
      { error: "Forbidden: hanya super_admin yang dapat mengakses endpoint ini." },
      { status: 403 }
    );
  }

  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(users.createdAt);

  return NextResponse.json(allUsers);
}

/**
 * POST /api/users
 * Buat user baru — hanya super_admin
 */
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "super_admin") {
    return NextResponse.json(
      { error: "Forbidden: hanya super_admin yang dapat membuat user baru." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validasi gagal.", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { name, email, password, role } = parsed.data;

  // Cek email duplikat
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return NextResponse.json(
      { error: "Email sudah terdaftar." },
      { status: 409 }
    );
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Insert user baru
  await db.insert(users).values({
    name,
    email,
    passwordHash,
    role,
    isActive: true,
  });

  // Ambil user yang baru dibuat untuk response
  const [newUser] = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  // Log activity
  await logActivity({
    userId: Number(session.user.id),
    action: "create",
    module: "users",
    recordId: newUser?.id,
    detail: JSON.stringify({ name, email, role }),
  });

  return NextResponse.json(
    { success: true, user: newUser },
    { status: 201 }
  );
}
