/**
 * SEED SCRIPT: Kemitraan Dummy Data (Placeholder)
 * 
 * Catatan: Data di bawah ini HANYA untuk keperluan verifikasi tampilan/layout
 * (Universitas Mitra bergerak ke kanan, Lembaga Mitra bergerak ke kiri).
 * Data dummy ini sebaiknya dihapus atau diganti data mitra asli oleh admin sebelum go-live.
 * 
 * Jalankan dengan:
 *   npx tsx lib/db/seed-kemitraan.ts
 *   atau
 *   bun run lib/db/seed-kemitraan.ts
 */

import { db } from "./index";
import { kemitraan } from "./schema";
import { isNull } from "drizzle-orm";

async function seedKemitraan() {
  console.log("🌱 Menjalankan seed kemitraan dummy data (placeholder)...");

  // Cek apakah sudah ada data kemitraan
  const existing = await db
    .select()
    .from(kemitraan)
    .where(isNull(kemitraan.deletedAt));

  console.log(`ℹ️  Jumlah data kemitraan aktif saat ini: ${existing.length}`);

  // Data 6 Universitas Mitra
  const dummyUniversitas = [
    {
      partnerName: "University Partner 1",
      kategoriMitra: "universitas" as const,
      logoUrl: "https://placehold.co/200x100?text=University+Partner+1",
      partnershipType: "Pertukaran Mahasiswa",
      websiteUrl: "https://example.com/univ1",
      orderIndex: 0,
    },
    {
      partnerName: "University Partner 2",
      kategoriMitra: "universitas" as const,
      logoUrl: "https://placehold.co/200x100?text=University+Partner+2",
      partnershipType: "Riset Bersama",
      websiteUrl: "https://example.com/univ2",
      orderIndex: 1,
    },
    {
      partnerName: "University Partner 3",
      kategoriMitra: "universitas" as const,
      logoUrl: "https://placehold.co/200x100?text=University+Partner+3",
      partnershipType: "Program Dual Degree",
      websiteUrl: "https://example.com/univ3",
      orderIndex: 2,
    },
    {
      partnerName: "University Partner 4",
      kategoriMitra: "universitas" as const,
      logoUrl: "https://placehold.co/200x100?text=University+Partner+4",
      partnershipType: "Joint Conference",
      websiteUrl: "https://example.com/univ4",
      orderIndex: 3,
    },
    {
      partnerName: "University Partner 5",
      kategoriMitra: "universitas" as const,
      logoUrl: "https://placehold.co/200x100?text=University+Partner+5",
      partnershipType: "Visiting Professor",
      websiteUrl: "https://example.com/univ5",
      orderIndex: 4,
    },
    {
      partnerName: "University Partner 6",
      kategoriMitra: "universitas" as const,
      logoUrl: "https://placehold.co/200x100?text=University+Partner+6",
      partnershipType: "Kerjasama Akademik",
      websiteUrl: "https://example.com/univ6",
      orderIndex: 5,
    },
  ];

  // Data 6 Lembaga Mitra
  const dummyLembaga = [
    {
      partnerName: "Institution Partner A",
      kategoriMitra: "lembaga" as const,
      logoUrl: "https://placehold.co/200x100?text=Institution+Partner+A",
      partnershipType: "Magang Industri",
      websiteUrl: "https://example.com/instA",
      orderIndex: 0,
    },
    {
      partnerName: "Institution Partner B",
      kategoriMitra: "lembaga" as const,
      logoUrl: "https://placehold.co/200x100?text=Institution+Partner+B",
      partnershipType: "Sertifikasi Kompetensi",
      websiteUrl: "https://example.com/instB",
      orderIndex: 1,
    },
    {
      partnerName: "Institution Partner C",
      kategoriMitra: "lembaga" as const,
      logoUrl: "https://placehold.co/200x100?text=Institution+Partner+C",
      partnershipType: "Pengembangan Kurikulum",
      websiteUrl: "https://example.com/instC",
      orderIndex: 2,
    },
    {
      partnerName: "Institution Partner D",
      kategoriMitra: "lembaga" as const,
      logoUrl: "https://placehold.co/200x100?text=Institution+Partner+D",
      partnershipType: "Penyaluran Lulusan",
      websiteUrl: "https://example.com/instD",
      orderIndex: 3,
    },
    {
      partnerName: "Institution Partner E",
      kategoriMitra: "lembaga" as const,
      logoUrl: "https://placehold.co/200x100?text=Institution+Partner+E",
      partnershipType: "Praktik Kerja Lapangan",
      websiteUrl: "https://example.com/instE",
      orderIndex: 4,
    },
    {
      partnerName: "Institution Partner F",
      kategoriMitra: "lembaga" as const,
      logoUrl: "https://placehold.co/200x100?text=Institution+Partner+F",
      partnershipType: "Beasiswa Industri",
      websiteUrl: "https://example.com/instF",
      orderIndex: 5,
    },
  ];

  // Sisipkan jika belum ada data universitas
  const univCount = existing.filter((k) => k.kategoriMitra === "universitas").length;
  if (univCount === 0) {
    console.log("➕ Menyisipkan 6 data dummy Universitas Mitra...");
    for (const item of dummyUniversitas) {
      await db.insert(kemitraan).values(item);
    }
  } else {
    console.log(`✅ Data Universitas Mitra sudah ada (${univCount} data).`);
  }

  // Sisipkan jika belum ada data lembaga
  const lembagaCount = existing.filter((k) => k.kategoriMitra === "lembaga").length;
  if (lembagaCount === 0) {
    console.log("➕ Menyisipkan 6 data dummy Lembaga Mitra...");
    for (const item of dummyLembaga) {
      await db.insert(kemitraan).values(item);
    }
  } else {
    console.log(`✅ Data Lembaga Mitra sudah ada (${lembagaCount} data).`);
  }

  console.log("🎉 Seed kemitraan selesai!");
  process.exit(0);
}

seedKemitraan().catch((err) => {
  console.error("❌ Seed kemitraan gagal:", err);
  process.exit(1);
});
