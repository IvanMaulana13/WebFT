import type { Metadata } from "next";
import { fetchPublicProsedur } from "@/lib/public-api";
import ProsedurCard from "@/components/public/prosedur-card";
import { ClipboardList, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Prosedur Akademik",
  description: "Standar Operasional Prosedur (SOP) Akademik Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

export default async function ProsedurAkademikPage() {
  const prosedurList = await fetchPublicProsedur();
  const prosedurs = prosedurList ?? [];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#002347] font-sans uppercase">
          Prosedur Akademik
        </h2>
        <div className="h-1 w-20 bg-[#E5B80B] rounded-full" />
      </div>

      <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-5 text-justify">
        <p>
          Prosedur Akademik Fakultas Teknik Universitas Wijaya Kusuma Surabaya adalah serangkaian langkah yang harus diikuti oleh mahasiswa, dosen, dan tenaga kependidikan dalam menjalankan kegiatan akademik, mulai dari pendaftaran mata kuliah hingga kelulusan. Semua prosedur ini dimuat dalam Standar Operasional Prosedur (SOP) yang memastikan kelancaran, konsistensi, dan transparansi dalam pelaksanaan kegiatan akademik, serta mendukung pencapaian kualitas pendidikan yang tinggi di fakultas.
        </p>
      </div>

      {/* Dynamic List of SOP Items */}
      <div className="space-y-4 pt-2">
        {prosedurs.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
            <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">
              Belum ada prosedur akademik yang dipublikasikan.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Silakan periksa kembali di lain waktu.
            </p>
          </div>
        ) : (
          prosedurs.map((item) => <ProsedurCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
