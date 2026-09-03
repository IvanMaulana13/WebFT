"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface BeritaItem {
  id: number;
  title: string;
  slug: string;
  thumbnailUrl?: string | null;
  category?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  status: string;
}

interface Props {
  items: BeritaItem[];
}

export function BeritaSection({ items }: Props) {
  const t = useTranslations("beranda");
  const locale = useLocale();

  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#002347] font-sans">
            {t("beritaSectionTitle")}
          </h2>
          <div className="flex-grow h-px bg-slate-200" />
        </div>

        {/* Berita Grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/berita/${item.slug}`}
                className="flex flex-col gap-3 group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-[#E5B80B]/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                  {item.thumbnailUrl ? (
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Building2 className="w-12 h-12 opacity-40" />
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col gap-2 flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(item.publishedAt || item.createdAt).toLocaleDateString(
                        locale === "en" ? "en-US" : "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#002347] group-hover:text-[#E5B80B] transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-sm">
            {t("emptyBerita")}
          </div>
        )}
      </div>
    </section>
  );
}
