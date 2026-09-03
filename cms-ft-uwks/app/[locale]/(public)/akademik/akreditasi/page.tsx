import type { Metadata } from "next";
import { fetchPublicProgramStudi, fetchPublicAkreditasi } from "@/lib/public-api";
import { Download } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("akademik.akreditasi");
  return {
    title: t("title"),
    description: `Status akreditasi resmi ${t("title")} Fakultas Teknik UWKS`,
  };
}

// Badge styling helper
function getPeringkatBadge(peringkat: string) {
  const p = peringkat.toLowerCase();
  if (p.includes("unggul") || p === "a") {
    return "bg-emerald-100 text-emerald-800 border-emerald-300";
  }
  if (p.includes("baik sekali") || p === "b") {
    return "bg-blue-100 text-blue-800 border-blue-300";
  }
  if (p.includes("baik") || p === "c") {
    return "bg-amber-100 text-amber-800 border-amber-300";
  }
  return "bg-slate-100 text-slate-800 border-slate-300";
}

export default async function AkreditasiPage() {
  const [prodiList, akreditasiList, t, tCommon, locale] = await Promise.all([
    fetchPublicProgramStudi(),
    fetchPublicAkreditasi(),
    getTranslations("akademik.akreditasi"),
    getTranslations("common"),
    getLocale(),
  ]);

  const prodis = prodiList ?? [];
  const akreditasis = akreditasiList ?? [];

  // Group latest accreditation per prodi
  const latestAkreditasiByProdi = new Map<number, (typeof akreditasis)[0]>();
  for (const a of akreditasis) {
    if (!latestAkreditasiByProdi.has(a.prodiId)) {
      latestAkreditasiByProdi.set(a.prodiId, a);
    }
  }

  const formatDate = (dateVal: string | Date | null | undefined) => {
    if (!dateVal) return "—";
    try {
      const d = new Date(dateVal);
      return d.toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return String(dateVal);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#002347] font-sans uppercase">
          {t("title")}
        </h2>
        <div className="h-1 w-20 bg-[#E5B80B] rounded-full" />
      </div>

      <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-5 text-justify">
        <p>{t("narasi")}</p>
      </div>

      {/* Desktop View: Clean Table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#002347] text-white text-xs uppercase tracking-wider font-semibold">
              <th className="py-3.5 px-4">{t("thProdi")}</th>
              <th className="py-3.5 px-4 text-center">{t("thPeringkat")}</th>
              <th className="py-3.5 px-4">{t("thNoSk")}</th>
              <th className="py-3.5 px-4">{t("thBerlaku")}</th>
              <th className="py-3.5 px-4 text-center">{t("thSertifikat")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {prodis.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  {t("empty")}
                </td>
              </tr>
            ) : (
              prodis.map((prodi) => {
                const akreditasi = latestAkreditasiByProdi.get(prodi.id);

                return (
                  <tr key={prodi.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#002347]">
                      {prodi.nama}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {akreditasi ? (
                        <span
                          className={`inline-block px-3 py-1 text-xs font-bold uppercase rounded-full border ${getPeringkatBadge(
                            akreditasi.peringkat
                          )}`}
                        >
                          {akreditasi.peringkat}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">{tCommon("belumTersedia")}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-600 text-xs font-mono">
                      {akreditasi?.noSk || "—"}
                    </td>
                    <td className="py-4 px-4 text-slate-600 text-xs whitespace-nowrap">
                      {formatDate(akreditasi?.tanggalBerlaku)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {akreditasi?.fileSertifikat ? (
                        <a
                          href={akreditasi.fileSertifikat}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#002347] bg-[#E5B80B] hover:bg-[#d4a800] rounded-md transition-colors shadow-xs"
                          title="Unduh / Lihat Sertifikat"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{t("unduhSertifikat")}</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Responsive Cards per Prodi */}
      <div className="md:hidden space-y-4">
        {prodis.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-400">
            {t("empty")}
          </div>
        ) : (
          prodis.map((prodi) => {
            const akreditasi = latestAkreditasiByProdi.get(prodi.id);

            return (
              <div
                key={prodi.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-[#002347] text-base">{prodi.nama}</h3>
                  {akreditasi ? (
                    <span
                      className={`px-2.5 py-0.5 text-xs font-bold uppercase rounded-full border ${getPeringkatBadge(
                        akreditasi.peringkat
                      )}`}
                    >
                      {akreditasi.peringkat}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 italic">{tCommon("belumTersedia")}</span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t("thNoSk")}:</span>
                    <span className="font-mono text-right font-medium">{akreditasi?.noSk || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t("thBerlaku")}:</span>
                    <span className="font-medium">
                      {formatDate(akreditasi?.tanggalBerlaku)}
                    </span>
                  </div>
                </div>

                {akreditasi?.fileSertifikat && (
                  <div className="pt-2 border-t border-slate-100">
                    <a
                      href={akreditasi.fileSertifikat}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-bold text-[#002347] bg-[#E5B80B] hover:bg-[#d4a800] rounded-lg transition-colors shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t("unduhSertifikat")}</span>
                    </a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
