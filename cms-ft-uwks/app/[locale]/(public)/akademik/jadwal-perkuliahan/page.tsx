import type { Metadata } from "next";
import { fetchPublicProgramStudi, fetchPublicJadwal } from "@/lib/public-api";
import { Download, CalendarDays, FileText, AlertCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("akademik.jadwal");
  return {
    title: t("title"),
    description: `Jadwal perkuliahan resmi ${t("title")} Fakultas Teknik UWKS`,
  };
}

export default async function JadwalPerkuliahanPage() {
  const [prodiList, jadwalList, t, tCommon] = await Promise.all([
    fetchPublicProgramStudi(),
    fetchPublicJadwal(),
    getTranslations("akademik.jadwal"),
    getTranslations("common"),
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
          {t("title")}
        </h2>
        <div className="h-1 w-20 bg-[#E5B80B] rounded-full" />
      </div>

      <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-5 text-justify">
        <p>{t("narasi1")}</p>
        <p className="font-medium text-slate-800">{t("narasi2")}</p>
      </div>

      {/* Dynamic List of Schedules per Program Studi */}
      <div className="space-y-4 pt-2">
        {prodis.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-medium">{t("emptyProdi")}</p>
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
                      {t("cardTitle", { prodi: prodi.nama })}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {jadwal ? (
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                          <span className="capitalize">
                            {tCommon("semester")} {jadwal.semester}
                          </span>
                          <span>•</span>
                          <span>
                            {tCommon("tahunAkademik")} {jadwal.tahunAjaran}
                          </span>
                        </span>
                      ) : (
                        <span className="italic text-slate-400">
                          {t("jadwalBelumTersedia")}
                        </span>
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
                      <span>{tCommon("unduhDisini")}</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-200 text-slate-500 font-medium text-xs rounded-lg cursor-not-allowed whitespace-nowrap">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{tCommon("belumTersedia")}</span>
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
