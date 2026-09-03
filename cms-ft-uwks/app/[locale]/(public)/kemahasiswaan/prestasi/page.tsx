import type { Metadata } from "next";
import { fetchPublicData } from "@/lib/public-api";
import type { Prestasi } from "@/lib/db/schema";
import PrestasiClient from "@/components/public/kemahasiswaan/prestasi-client";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("kemahasiswaan.prestasi");
  return {
    title: t("title"),
    description: t("narasi"),
  };
}

export const revalidate = 60;

export default async function PrestasiPage() {
  const [prestasiList, t] = await Promise.all([
    fetchPublicData<Prestasi[]>("/api/prestasi").then((res) => res || []),
    getTranslations("kemahasiswaan.prestasi"),
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

      {/* ── Client component with filters ── */}
      <PrestasiClient initialData={prestasiList} />
    </div>
  );
}
