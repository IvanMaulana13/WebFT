import type { Metadata } from "next";
import { fetchPublicProgramStudi, fetchPublicJadwal } from "@/lib/public-api";
import { Download, CalendarDays, FileText, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Jadwal Perkuliahan",
  description: "Jadwal Perkuliahan Program Studi Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

export default async function JadwalPerkuliahanPage() {
  const [prodiList, jadwalList] = await Promise.all([
    fetchPublicProgramStudi(),
    fetchPublicJadwal(),
  ]);

  const prodis = prodiList ?? [];
  const jadwals = jadwalList ?? [];

  // Group jadwal by prodiId, taking the latest one for each prodi
  const latestJadwalByProdi = new Map<number, (typeof jadwals)[0]>();
  for (const j of jadwals) {
    if (!latestJadwalByProdi.has(j.prodiId)) {
      latestJadwalByProdi.set(j.prodiId, j);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#002347] font-sans uppercase">
          Jadwal Perkuliahan
        </h2>
        <div className="h-1 w-20 bg-[#E5B80B] rounded-full" />
      </div>

      <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-5 text-justify">
        <p>
          Jadwal Perkuliahan Fakultas Teknik Universitas Wijaya Kusuma Surabaya mencakup rincian waktu dan mata kuliah untuk seluruh program studi, yaitu Program Studi Teknik Sipil, Program Studi Informatika, dan Program Studi Teknologi Industri Pertanian. Jadwal ini berfungsi sebagai panduan bagi mahasiswa dan dosen dalam mengikuti perkuliahan yang terstruktur dan sesuai waktu yang telah ditetapkan. Dengan adanya jadwal yang jelas, diharapkan proses belajar mengajar dapat berlangsung dengan lancar dan efisien.
        </p>
        <p className="font-medium text-slate-800">
          Untuk memudahkan akses, salinan Jadwal Perkuliahan ini dapat diunduh melalui link berikut:
        </p>
      </div>

      {/* Dynamic List of Schedules per Program Studi */}
      <div className="space-y-4 pt-2">
        {prodis.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-medium">Belum ada data program studi.</p>
          </div>
        ) : (
          prodis.map((prodi) => {
            const jadwal = latestJadwalByProdi.get(prodi.id);

            return (
              <div
                key={prodi.id}
                className="bg-[#F8F9FA] rounded-xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#002347] text-[#E5B80B] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#002347] text-sm sm:text-base leading-snug">
                      Jadwal Perkuliahan Program Studi {prodi.nama}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {jadwal ? (
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                          <span className="capitalize">
                            Semester {jadwal.semester}
                          </span>
                          <span>•</span>
                          <span>Tahun Akademik {jadwal.tahunAjaran}</span>
                        </span>
                      ) : (
                        <span className="italic text-slate-400">Jadwal belum tersedia</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="self-end sm:self-center">
                  {jadwal?.fileUrl ? (
                    <a
                      href={jadwal.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5B80B] hover:bg-[#d4a800] text-[#002347] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>UNDUH DISINI</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-200 text-slate-500 font-medium text-xs rounded-lg cursor-not-allowed whitespace-nowrap">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Belum tersedia</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
