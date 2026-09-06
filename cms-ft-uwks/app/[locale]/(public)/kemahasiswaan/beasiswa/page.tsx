import type { Metadata } from "next";
import { fetchPublicBeritaByCategory } from "@/lib/public-api";
import BeasiswaClient from "@/components/public/kemahasiswaan/beasiswa-client";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("kemahasiswaan.beasiswa");
  return {
    title: t("title"),
    description: t("narasi"),
  };
}

export const revalidate = 60;

export default async function BeasiswaPage() {
  const [beasiswaList, t] = await Promise.all([
    fetchPublicBeritaByCategory("beasiswa").then((res) => res || []),
    getTranslations("kemahasiswaan.beasiswa"),
  ]);

  return (
    <div className="space-y-8">
      {/* ── Title & Decorative Bar ── */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#002347] font-sans uppercase tracking-tight">
          {t("title")}
        </h2>
        <div className="h-1 w-20 bg-[#E5B80B] rounded-full" />
      </div>

      <p className="text-slate-600 text-sm md:text-base leading-relaxed text-justify">
        {t("narasi")}
      </p>

      {/* ── Beasiswa Client Cards ── */}
      <BeasiswaClient initialData={beasiswaList} />
    </div>
  );
}
