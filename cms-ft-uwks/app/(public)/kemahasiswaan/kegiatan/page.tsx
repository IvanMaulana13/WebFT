import type { Metadata } from "next";
import { fetchPublicBeritaByCategory } from "@/lib/public-api";
import KegiatanClient from "@/components/public/kemahasiswaan/kegiatan-client";

export const metadata: Metadata = {
  title: "Kegiatan Kemahasiswaan",
  description: "Dokumentasi dan Informasi Kegiatan Kemahasiswaan Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

export const revalidate = 60;

export default async function KegiatanPage() {
  const kegiatanList = (await fetchPublicBeritaByCategory("kegiatan")) || [];

  return (
    <div className="space-y-8">
      {/* ── Title & Decorative Bar ── */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#002347] font-sans uppercase tracking-tight">
          Kegiatan Kemahasiswaan
        </h2>
        <div className="h-1 w-20 bg-[#E5B80B] rounded-full" />
      </div>

      <p className="text-slate-600 text-sm md:text-base leading-relaxed text-justify">
        Informasi seputar kegiatan seminar, pelatihan, bakti sosial, workshop, dan agenda aktivitas kemahasiswaan di lingkungan Fakultas Teknik Universitas Wijaya Kusuma Surabaya.
      </p>

      {/* ── Kegiatan Client Cards ── */}
      <KegiatanClient initialData={kegiatanList} />
    </div>
  );
}
