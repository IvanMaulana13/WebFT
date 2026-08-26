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
import {
  users,
  strukturOrganisasi,
  siteSettings,
  programStudi,
  kalenderAkademik,
  pedomanAkademik,
} from "./schema";
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

  // ── 3. Site Settings ──────────────────────────────────────────────────
  console.log("⚙️  Seeding site_settings...");

  const existingSettings = await db.select().from(siteSettings).limit(1);

  if (existingSettings.length > 0) {
    console.log(
      `✅ Baris awal site_settings sudah ada (id = ${existingSettings[0].id}). Skip.\n`
    );
  } else {
    await db.insert(siteSettings).values({
      heroVideoUrl: null,
      heroPosterUrl: null,
      waNumber: null,
      waDefaultMessage: null,
      socialInstagram: null,
      socialFacebook: null,
      socialYoutube: null,
      socialTwitter: null,
      socialLinkedin: null,
      updatedBy: null,
    });
    console.log("✅ Seed selesai: 1 baris awal tersedia di tabel site_settings.\n");
  }

  // ── 4. Program Studi ──────────────────────────────────────────────────
  console.log("🎓 Seeding program_studi (3 prodi generik FT)...");

  const prodiSeed = [
    { nama: "Teknik Informatika", kode: "TI" },
    { nama: "Teknik Sipil", kode: "TS" },
    { nama: "Teknik Elektro", kode: "TE" },
  ];

  for (const prodi of prodiSeed) {
    const [existing] = await db
      .select({ id: programStudi.id })
      .from(programStudi)
      .where(eq(programStudi.kode, prodi.kode))
      .limit(1);

    if (existing) {
      console.log(`  ✅ ${prodi.nama} (${prodi.kode}) sudah ada. Skip.`);
    } else {
      await db.insert(programStudi).values(prodi);
      console.log(`  ➕ ${prodi.nama} (${prodi.kode}) ditambahkan.`);
    }
  }
  console.log();

  // ── 5. Kalender Akademik (single-record placeholder) ─────────────────
  console.log("📅 Seeding kalender_akademik...");

  const existingKalender = await db.select().from(kalenderAkademik).limit(1);
  if (existingKalender.length > 0) {
    console.log(`✅ Baris kalender_akademik sudah ada. Skip.\n`);
  } else {
    await db.insert(kalenderAkademik).values({ fileUrl: null, tahunAjaran: null, updatedBy: null });
    console.log("✅ Baris placeholder kalender_akademik dibuat.\n");
  }

  // ── 6. Pedoman Akademik (single-record placeholder) ──────────────────
  console.log("📘 Seeding pedoman_akademik...");

  const existingPedoman = await db.select().from(pedomanAkademik).limit(1);
  if (existingPedoman.length > 0) {
    console.log(`✅ Baris pedoman_akademik sudah ada. Skip.\n`);
  } else {
    await db.insert(pedomanAkademik).values({ fileUrl: null, updatedBy: null });
    console.log("✅ Baris placeholder pedoman_akademik dibuat.\n");
  }

  console.log("🎉 Seeding selesai!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed gagal:", err);
  process.exit(1);
});
