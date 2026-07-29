/**
 * Reset password super_admin
 *
 * Jalankan dengan:
 *   bun run lib/db/reset-admin.ts
 *
 * Script ini membaca SEED_ADMIN_EMAIL dan SEED_ADMIN_PASSWORD dari .env,
 * lalu meng-update password_hash di tabel users.
 */

import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function resetAdmin() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("❌ SEED_ADMIN_EMAIL dan SEED_ADMIN_PASSWORD harus diset di .env");
    process.exit(1);
  }

  if (adminPassword.length < 6) {
    console.error(`❌ Password terlalu pendek (${adminPassword.length} karakter). Minimal 6 karakter.`);
    process.exit(1);
  }

  console.log(`🔑 Reset password untuk: ${adminEmail}`);

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, adminEmail))
    .limit(1);

  if (!user) {
    console.error(`❌ User ${adminEmail} tidak ditemukan. Jalankan 'bun run db:seed' terlebih dahulu.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await db
    .update(users)
    .set({ passwordHash, isActive: true })
    .where(eq(users.email, adminEmail));

  console.log(`✅ Password berhasil diperbarui untuk: ${adminEmail}`);
  console.log(`   Password baru: ${adminPassword}`);
  process.exit(0);
}

resetAdmin().catch((err) => {
  console.error("❌ Reset gagal:", err);
  process.exit(1);
});
