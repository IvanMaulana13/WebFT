import type { Metadata } from "next";
import { fetchPublicProsedur } from "@/lib/public-api";
import ProsedurCard from "@/components/public/prosedur-card";
import { ClipboardList } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("akademik.prosedur");
  return {
    title: t("title"),
    description: `Standar Operasional Prosedur ${t("title")} Fakultas Teknik UWKS`,
  };
}

export default async function ProsedurAkademikPage() {
  const [prosedurList, t] = await Promise.all([
    fetchPublicProsedur(),
    getTranslations("akademik.prosedur"),
  ]);
  const prosedurs = prosedurList ?? [];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#002347] font-sans uppercase">
          {t("title")}
        </h2>
        <div className="h-1 w-20 bg-[#E5B80B] rounded-full" />
      </div>

      <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-5 text-justify">
        <p>{t("narasi")}</p>
      </div>

      {/* Dynamic List of SOP Items */}
      <div className="space-y-4 pt-2">
        {prosedurs.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
            <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">
              {t("emptyTitle")}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {t("emptyDesc")}
            </p>
          </div>
        ) : (
          prosedurs.map((item) => <ProsedurCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
