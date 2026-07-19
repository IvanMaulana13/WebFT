/**
 * Verify script: cek semua tabel berhasil dibuat
 * Jalankan setelah db:migrate dan db:seed:
 *   bun run lib/db/verify.ts
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

async function verify() {
  console.log("\n🔍 Verifikasi database ft_uwks_cms...\n");

  // SHOW TABLES
  const [tablesResult] = await db.execute(sql`SHOW TABLES`);
  console.log("📋 Tabel yang ada:");
  (tablesResult as unknown as Array<Record<string, string>>).forEach((row) => {
    const tableName = Object.values(row)[0];
    console.log(`   ✅ ${tableName}`);
  });

  // Cek struktur_organisasi memiliki 1 baris
  const { strukturOrganisasi } = await import("./schema");
  const rows = await db.select().from(strukturOrganisasi);
  console.log(`\n📌 struktur_organisasi: ${rows.length} baris`);
  if (rows.length >= 1) {
    console.log("   ✅ Seed baris awal tersedia");
    console.log("   id        :", rows[0].id);
    console.log("   image_url :", rows[0].imageUrl ?? "(null/placeholder)");
    console.log("   updated_at:", rows[0].updatedAt);
  } else {
    console.log("   ⚠️  Baris seed belum ada — jalankan: bun run db:seed");
  }

  console.log("\n✅ Verifikasi selesai.\n");
  process.exit(0);
}

verify().catch((err) => {
  console.error("❌ Gagal:", err.message);
  process.exit(1);
});
