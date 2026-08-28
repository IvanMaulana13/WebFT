"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import type { Berita } from "@/lib/db/schema";

interface KegiatanClientProps {
  initialData: Berita[];
}

const ITEMS_PER_PAGE = 8;

export default function KegiatanClient({ initialData }: KegiatanClientProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(initialData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = initialData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatDate = (dateVal: Date | string | null | undefined) => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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
          Belum ada informasi kegiatan kemahasiswaan yang dipublikasikan.
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
                <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 flex items-center justify-center text-[#002C5F]">
                  <CalendarDays className="w-12 h-12 text-[#E5B80B]" />
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="bg-[#002347] text-[#E5B80B] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Kegiatan
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <Calendar className="w-3.5 h-3.5 text-[#E5B80B]" />
                <span>{formatDate(item.publishedAt || item.createdAt)}</span>
              </div>

              <h3 className="font-bold text-[#002347] text-base mb-2 group-hover:text-[#002C5F] line-clamp-2 transition-colors">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4 flex-1">
                {getExcerpt(item.content)}
              </p>

              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#002347] group-hover:text-[#E5B80B] transition-colors">
                <span>Baca Selengkapnya</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                currentPage === pageNum
                  ? "bg-[#002C5F] text-white shadow-xs"
                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Halaman selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
