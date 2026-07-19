/**
 * Seed script: struktur_organisasi
 *
 * Jalankan setelah migration berhasil:
 *   bun run db:seed
 *
 * Tabel struktur_organisasi dirancang sebagai single-record:
 * - Selalu ada tepat 1 baris (id = 1)
 * - Admin hanya UPDATE baris ini, tidak INSERT baru
 * - image_url boleh null/placeholder sampai admin upload via dashboard
 */

import { db } from "./index";
import { strukturOrganisasi } from "./schema";

async function seed() {
  console.log("🌱 Seeding struktur_organisasi...");

  // Cek apakah sudah ada baris
  const existing = await db.select().from(strukturOrganisasi).limit(1);

  if (existing.length > 0) {
    console.log("✅ Baris awal sudah ada (id =", existing[0].id, "). Skip seed.");
    process.exit(0);
  }

  // Insert 1 baris awal
  await db.insert(strukturOrganisasi).values({
    imageUrl: null, // placeholder — admin upload via dashboard
    updatedBy: null,
  });

  console.log("✅ Seed selesai: 1 baris awal tersedia di tabel struktur_organisasi.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed gagal:", err);
  process.exit(1);
});
