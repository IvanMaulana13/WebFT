import type { Metadata } from "next";
import { fetchPublicBeritaByCategory } from "@/lib/public-api";
import KegiatanClient from "@/components/public/kemahasiswaan/kegiatan-client";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("kemahasiswaan.kegiatan");
  return {
    title: t("title"),
    description: t("narasi"),
  };
}

export const revalidate = 60;

export default async function KegiatanPage() {
  const [kegiatanList, t] = await Promise.all([
    fetchPublicBeritaByCategory("kegiatan").then((res) => res || []),
    getTranslations("kemahasiswaan.kegiatan"),
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

      {/* ── Kegiatan Client Cards ── */}
      <KegiatanClient initialData={kegiatanList} />
    </div>
  );
}
