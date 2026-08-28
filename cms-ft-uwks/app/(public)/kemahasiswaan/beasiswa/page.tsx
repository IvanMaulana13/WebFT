import type { Metadata } from "next";
import { fetchPublicBeritaByCategory } from "@/lib/public-api";
import BeasiswaClient from "@/components/public/kemahasiswaan/beasiswa-client";

export const metadata: Metadata = {
  title: "Informasi Beasiswa",
  description: "Informasi Beasiswa untuk Mahasiswa Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

export const revalidate = 60;

export default async function BeasiswaPage() {
  const beasiswaList = (await fetchPublicBeritaByCategory("beasiswa")) || [];

  return (
    <div className="space-y-8">
      {/* ── Title & Decorative Bar ── */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#002347] font-sans uppercase tracking-tight">
          Informasi Beasiswa
        </h2>
        <div className="h-1 w-20 bg-[#E5B80B] rounded-full" />
      </div>

      <p className="text-slate-600 text-sm md:text-base leading-relaxed text-justify">
        Temukan berbagai kesempatan beasiswa prestasi, bantuan biaya pendidikan, dan pendanaan riset yang tersedia bagi mahasiswa Fakultas Teknik Universitas Wijaya Kusuma Surabaya dari pemerintah, institusi mitra, maupun yayasan.
      </p>

      {/* ── Beasiswa Client Cards ── */}
      <BeasiswaClient initialData={beasiswaList} />
    </div>
  );
}
