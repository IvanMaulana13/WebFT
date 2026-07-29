/**
 * Seed script
 *
 * Jalankan setelah migration berhasil:
 *   bun run db:seed
 *
 * Yang di-seed:
 * 1. Super admin user (dari SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD di .env)
 * 2. Baris awal tabel struktur_organisasi (single-record)
 */

import { db } from "./index";
import { users, strukturOrganisasi } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Memulai proses seeding...\n");

  // ── 1. Super Admin ────────────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error(
      "❌ SEED_ADMIN_EMAIL dan SEED_ADMIN_PASSWORD harus diset di .env"
    );
    process.exit(1);
  }

  console.log(`👤 Seeding super_admin: ${adminEmail}`);

  const [existingAdmin] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, adminEmail))
    .limit(1);

  if (existingAdmin) {
    console.log(`✅ Super admin sudah ada (id = ${existingAdmin.id}). Skip.\n`);
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    await db.insert(users).values({
      name: "Super Admin",
      email: adminEmail,
      passwordHash,
      role: "super_admin",
      isActive: true,
    });

    console.log(`✅ Super admin berhasil dibuat: ${adminEmail}\n`);
  }

  // ── 2. Struktur Organisasi ────────────────────────────────────────────
  console.log("🏢 Seeding struktur_organisasi...");

  const existing = await db.select().from(strukturOrganisasi).limit(1);

  if (existing.length > 0) {
    console.log(
      `✅ Baris awal sudah ada (id = ${existing[0].id}). Skip.\n`
    );
  } else {
    await db.insert(strukturOrganisasi).values({
      imageUrl: null,
      updatedBy: null,
    });
    console.log("✅ Seed selesai: 1 baris awal tersedia di tabel struktur_organisasi.\n");
  }

  console.log("🎉 Seeding selesai!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed gagal:", err);
  process.exit(1);
});
