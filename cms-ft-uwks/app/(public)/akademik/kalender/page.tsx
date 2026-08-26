import type { Metadata } from "next";
import { fetchPublicKalender } from "@/lib/public-api";
import { Download, Calendar, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Kalender Akademik",
  description: "Kalender Akademik Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

export default async function KalenderAkademikPage() {
  const kalender = await fetchPublicKalender();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#002347] font-sans uppercase">
          Kalender Akademik
        </h2>
        <div className="h-1 w-20 bg-[#E5B80B] rounded-full" />
      </div>

      <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-5 text-justify">
        <p>
          Kalender Akademik Universitas Wijaya Kusuma Surabaya adalah panduan resmi yang memuat jadwal kegiatan akademik, yang bertujuan sebagai acuan bagi sivitas akademika dalam melaksanakan kegiatan akademik secara tertib dan terorganisir untuk mencapai tujuan pendidikan yang berkualitas. Salinan Keputusan Rektor Universitas Wijaya Kusuma Surabaya Nomor 109 Tahun 2025 tentang Kalender Akademik Tahun Akademik {kalender?.tahunAjaran || "2025/2026"} Universitas Wijaya Kusuma Surabaya telah diterbitkan dapat diunduh melalui tombol di bawah ini.
        </p>
      </div>

      {/* Download Action Card */}
      <div className="bg-[#F8F9FA] rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#002347] text-[#E5B80B] flex items-center justify-center shrink-0 shadow-sm">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#002347] text-base sm:text-lg">
              Dokumen Kalender Akademik
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {kalender?.tahunAjaran
                ? `Tahun Akademik ${kalender.tahunAjaran}`
                : "Tahun Akademik Aktif"}
            </p>
          </div>
        </div>

        <div>
          {kalender?.fileUrl ? (
            <a
              href={kalender.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#E5B80B] hover:bg-[#d4a800] text-[#002347] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>UNDUH DISINI</span>
            </a>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-200 text-slate-500 font-semibold text-xs sm:text-sm rounded-lg cursor-not-allowed whitespace-nowrap"
            >
              <FileText className="w-4 h-4" />
              <span>File belum tersedia</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
