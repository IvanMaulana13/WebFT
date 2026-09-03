import type { Metadata } from "next";
import Image from "next/image";
import { fetchPublicOrmawa } from "@/lib/public-api";
import { Users2, ExternalLink, Globe } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("kemahasiswaan.ormawa");
  return {
    title: t("title"),
    description: t("narasi"),
  };
}

export const revalidate = 60;

export default async function OrmawaPage() {
  const [ormawaList, t, tCommon] = await Promise.all([
    fetchPublicOrmawa(),
    getTranslations("kemahasiswaan.ormawa"),
    getTranslations("common"),
  ]);

  const items = ormawaList || [];

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

      {/* ── Ormawa Grid ── */}
      {items.length === 0 ? (
        <div className="bg-[#F8F9FA] rounded-xl p-12 text-center border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Users2 className="w-8 h-8" />
          </div>
          <p className="text-slate-500 font-medium">
            {t("empty")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const redirectUrl = item.websiteUrl || item.instagramUrl || "#";
            const isClickable = redirectUrl !== "#";

            return (
              <a
                key={item.id}
                href={redirectUrl}
                target={isClickable ? "_blank" : undefined}
                rel={isClickable ? "noopener noreferrer" : undefined}
                className="group bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-xs hover:shadow-xl hover:border-[#002347]/30 transition-all duration-300 transform hover:-translate-y-1 relative"
              >
                {/* External link indicator */}
                {isClickable && (
                  <div className="absolute top-4 right-4 text-slate-300 group-hover:text-[#002347] transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                )}

                {/* Logo */}
                <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3 mb-5 group-hover:bg-[#002347]/5 transition-colors overflow-hidden shadow-inner">
                  {item.logoUrl ? (
                    <Image
                      src={item.logoUrl}
                      alt={item.nama}
                      width={96}
                      height={96}
                      className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Users2 className="w-10 h-10 text-slate-300 group-hover:text-[#002347] transition-colors" />
                  )}
                </div>

                {/* Name */}
                <h3 className="font-bold text-[#002347] text-base md:text-lg mb-2 group-hover:text-[#002C5F] line-clamp-2">
                  {item.nama}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4 flex-1">
                  {item.deskripsi}
                </p>

                {/* Footer Link Label */}
                {isClickable && (
                  <div className="mt-auto pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[#002347] group-hover:text-[#E5B80B] transition-colors">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{tCommon("kunjungiProfil")}</span>
                  </div>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
