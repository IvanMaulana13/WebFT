"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { CalendarDays, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import type { Berita } from "@/lib/db/schema";
import { useTranslations, useLocale } from "next-intl";

interface KegiatanClientProps {
  initialData: Berita[];
}

const ITEMS_PER_PAGE = 8;

export default function KegiatanClient({ initialData }: KegiatanClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const t = useTranslations("kemahasiswaan.kegiatan");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const totalPages = Math.ceil(initialData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = initialData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatDate = (dateVal: Date | string | null | undefined) => {
    if (!dateVal) return "";
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

  const getExcerpt = (content: string | null | undefined) => {
    if (!content) return "";
    const stripped = content.replace(/<[^>]+>/g, "").replace(/[#*`_~]/g, "");
    return stripped.length > 130 ? `${stripped.substring(0, 127)}...` : stripped;
  };

  if (initialData.length === 0) {
    return (
      <div className="bg-[#F8F9FA] rounded-xl p-12 text-center border border-slate-200">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <CalendarDays className="w-8 h-8" />
        </div>
        <p className="text-slate-500 font-medium">
          {t("empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentItems.map((item) => (
          <Link
            key={item.id}
            href={`/berita/${item.slug}`}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#002347]/30 transition-all duration-300 flex flex-col transform hover:-translate-y-1"
          >
            {/* Thumbnail */}
            <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
              {item.thumbnailUrl ? (
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2 bg-gradient-to-br from-slate-50 to-slate-100">
                  <CalendarDays className="w-10 h-10 text-[#002347]/20" />
                  <span className="text-[10px] font-semibold uppercase text-slate-400">
                    FT UWKS
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#E5B80B]" />
                <span>{formatDate(item.publishedAt || item.createdAt)}</span>
              </div>

              <h3 className="font-bold text-[#002347] text-base group-hover:text-[#002C5F] transition-colors line-clamp-2 leading-snug mb-2">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
                {getExcerpt(item.content)}
              </p>

              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#002347] group-hover:text-[#E5B80B] transition-colors">
                <span>{tCommon("bacaSelengkapnya")}</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-slate-600 px-3">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
