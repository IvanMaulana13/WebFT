import type { Metadata } from "next";
import { fetchPublicLomba } from "@/lib/public-api";
import LombaClient from "@/components/public/kemahasiswaan/lomba-client";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("kemahasiswaan.lomba");
  return {
    title: t("title"),
    description: t("narasi"),
  };
}

export const revalidate = 60;

export default async function LombaPage() {
  const [lombaList, t] = await Promise.all([
    fetchPublicLomba().then((res) => res || []),
    getTranslations("kemahasiswaan.lomba"),
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

      {/* ── Lomba Client ── */}
      <LombaClient initialData={lombaList} />
    </div>
  );
}
