import type { Metadata } from "next";
import { fetchPublicPedoman } from "@/lib/public-api";
import { Download, BookOpen, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Pedoman Akademik",
  description: "Buku Pedoman Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

export default async function PedomanAkademikPage() {
  const pedoman = await fetchPublicPedoman();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#002347] font-sans uppercase">
          Pedoman Akademik
        </h2>
        <div className="h-1 w-20 bg-[#E5B80B] rounded-full" />
      </div>

      <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-5 text-justify">
        <p>
          Buku Pedoman Fakultas Teknik Universitas Wijaya Kusuma Surabaya adalah dokumen resmi yang menjadi acuan utama dalam penyelenggaraan kegiatan akademik di lingkungan Fakultas Teknik. Buku ini dirancang untuk memberikan panduan yang jelas dan terstruktur bagi mahasiswa, dosen, serta tenaga kependidikan dalam menjalankan proses pendidikan, penelitian, dan pengabdian kepada masyarakat. Dengan diterbitkannya Buku Pedoman ini, diharapkan seluruh sivitas akademika di Fakultas Teknik Universitas Wijaya Kusuma Surabaya dapat memahami dan mengikuti ketentuan yang telah ditetapkan. Hal ini bertujuan untuk menciptakan sistem akademik yang terorganisir, efisien, dan berkelanjutan, serta mendukung upaya Fakultas Teknik dalam mewujudkan pendidikan yang berkualitas dan berdaya saing di tingkat nasional maupun internasional.
        </p>
        <p>
          Buku Pedoman Fakultas Teknik yang telah disahkan oleh Keputusan Dekan Fakultas Teknik Universitas Wijaya Kusuma Surabaya Nomor: Kep. 15 Tahun 2015 tentang Buku Pedoman Fakultas Teknik Universitas Wijaya Kusuma Surabaya Tahun Akademik 2025/2026 dapat diunduh melalui tombol di bawah ini.
        </p>
      </div>

      {/* Download Action Card */}
      <div className="bg-[#F8F9FA] rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#002347] text-[#E5B80B] flex items-center justify-center shrink-0 shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#002347] text-base sm:text-lg">
              Buku Pedoman Fakultas Teknik
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Dokumen Resmi Penyelenggaraan Akademik FT UWKS
            </p>
          </div>
        </div>

        <div>
          {pedoman?.fileUrl ? (
            <a
              href={pedoman.fileUrl}
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
