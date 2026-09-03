import type { Metadata } from "next";
import { fetchPublicKonseling, fetchPublicJadwalKonseling } from "@/lib/public-api";
import KonselingClient from "@/components/public/kemahasiswaan/konseling-client";
import type { JadwalKonseling } from "@/lib/db/schema";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("kemahasiswaan.konseling");
  return {
    title: t("title"),
    description: t("narasi"),
  };
}

export const revalidate = 60;

export default async function KonselingPage() {
  const [layanan, initialJadwal, t] = await Promise.all([
    fetchPublicKonseling(),
    fetchPublicJadwalKonseling(),
    getTranslations("kemahasiswaan.konseling"),
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

      {/* ── Static Narrative Paragraph ── */}
      <div className="bg-gradient-to-r from-amber-50/70 via-slate-50 to-blue-50/70 p-5 sm:p-6 rounded-xl border border-amber-200/60 shadow-2xs">
        <p className="text-slate-700 text-sm md:text-base leading-relaxed text-justify font-medium">
          {t("narasi")}
        </p>
        {layanan?.narasi && (
          <p className="text-slate-600 text-xs sm:text-sm mt-3 pt-3 border-t border-slate-200/60 leading-relaxed whitespace-pre-line">
            {layanan.narasi}
          </p>
        )}
      </div>

      {/* ── Client Tabs & Booking ── */}
      <KonselingClient
        layanan={layanan}
        initialJadwal={(initialJadwal as JadwalKonseling[]) || []}
      />
    </div>
  );
}
