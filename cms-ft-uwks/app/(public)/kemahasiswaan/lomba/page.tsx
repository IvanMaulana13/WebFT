import type { Metadata } from "next";
import { fetchPublicLomba } from "@/lib/public-api";
import LombaClient from "@/components/public/kemahasiswaan/lomba-client";

export const metadata: Metadata = {
  title: "Informasi Lomba Mahasiswa",
  description: "Informasi Kompetisi dan Perlombaan Mahasiswa Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

export const revalidate = 60;

export default async function LombaPage() {
  const lombaList = (await fetchPublicLomba()) || [];

  return (
    <div className="space-y-8">
      {/* ── Title & Decorative Bar ── */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#002347] font-sans uppercase tracking-tight">
          Informasi Lomba Mahasiswa
        </h2>
        <div className="h-1 w-20 bg-[#E5B80B] rounded-full" />
      </div>

      <p className="text-slate-600 text-sm md:text-base leading-relaxed text-justify">
        Informasi kompetisi ilmiah, olimpiade, desain keteknikan, karya inovasi, dan perlombaan bergengsi tingkat nasional maupun internasional yang dapat diikuti oleh mahasiswa Fakultas Teknik Universitas Wijaya Kusuma Surabaya.
      </p>

      {/* ── Lomba Client ── */}
      <LombaClient initialData={lombaList} />
    </div>
  );
}
