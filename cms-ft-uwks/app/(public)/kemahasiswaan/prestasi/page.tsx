import type { Metadata } from "next";
import { fetchPublicData } from "@/lib/public-api";
import type { Prestasi } from "@/lib/db/schema";
import PrestasiClient from "@/components/public/kemahasiswaan/prestasi-client";

export const metadata: Metadata = {
  title: "Prestasi Mahasiswa",
  description: "Daftar Prestasi Mahasiswa Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

export const revalidate = 60;

export default async function PrestasiPage() {
  const prestasiList = (await fetchPublicData<Prestasi[]>("/api/prestasi")) || [];

  return (
    <div className="space-y-8">
      {/* ── Title & Decorative Bar ── */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#002347] font-sans uppercase tracking-tight">
          Prestasi Mahasiswa
        </h2>
        <div className="h-1 w-20 bg-[#E5B80B] rounded-full" />
      </div>

      <p className="text-slate-600 text-sm md:text-base leading-relaxed text-justify">
        Fakultas Teknik Universitas Wijaya Kusuma Surabaya senantiasa mendorong dan mengapresiasi pencapaian prestasi mahasiswa di tingkat regional, nasional, hingga internasional baik di bidang akademik maupun non-akademik.
      </p>

      {/* ── Client component with filters ── */}
      <PrestasiClient initialData={prestasiList} />
    </div>
  );
}
