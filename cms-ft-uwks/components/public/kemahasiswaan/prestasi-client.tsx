"use client";

import { useState, useMemo } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Trophy, Medal, User, Calendar, Award, ChevronRight } from "lucide-react";
import type { Prestasi } from "@/lib/db/schema";
import { useTranslations, useLocale } from "next-intl";

interface PrestasiClientProps {
  initialData: Prestasi[];
}

export default function PrestasiClient({ initialData }: PrestasiClientProps) {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const t = useTranslations("kemahasiswaan.prestasi");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  // Get unique years sorted descending
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(initialData.map((item) => item.year))).filter(Boolean);
    return years.sort((a, b) => b - a);
  }, [initialData]);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      const matchYear = selectedYear === "all" || item.year === parseInt(selectedYear, 10);
      const matchLevel = selectedLevel === "all" || item.level.toLowerCase() === selectedLevel.toLowerCase();
      return matchYear && matchLevel;
    });
  }, [initialData, selectedYear, selectedLevel]);

  return (
    <div className="space-y-8">
      {/* ── Filters Bar ── */}
      <div className="bg-[#F8F9FA] rounded-xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Filter Tahun */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#002347] uppercase whitespace-nowrap">
              {tCommon("tahun")}:
            </span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002C5F] shadow-2xs"
            >
              <option value="all">{tCommon("semuaTahun")}</option>
              {availableYears.map((year) => (
                <option key={year} value={year.toString()}>
                  {tCommon("tahun")} {year}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Tingkat */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#002347] uppercase whitespace-nowrap">
              {tCommon("tingkat")}:
            </span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002C5F] shadow-2xs"
            >
              <option value="all">{tCommon("semuaTingkat")}</option>
              <option value="nasional">{locale === "en" ? "National" : "Nasional"}</option>
              <option value="internasional">{locale === "en" ? "International" : "Internasional"}</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-medium text-slate-500 self-end sm:self-center">
          Total: <span className="font-bold text-[#002347]">{filteredData.length}</span> {locale === "en" ? "achievements" : "prestasi"}
        </div>
      </div>

      {/* ── Empty State ── */}
      {filteredData.length === 0 && (
        <div className="bg-[#F8F9FA] rounded-xl p-12 text-center border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8" />
          </div>
          <p className="text-slate-600 font-semibold mb-1">
            {t("empty")}
          </p>
          <p className="text-xs text-slate-400">
            {t("emptyDesc")}
          </p>
        </div>
      )}

      {/* ── Prestasi Grid ── */}
      {filteredData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <Link
              key={item.id}
              href={`/prestasi/${item.id}`}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#002347]/30 transition-all duration-300 flex flex-col transform hover:-translate-y-1"
            >
              {/* Image Preview */}
              <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2 bg-gradient-to-br from-slate-50 to-slate-100">
                    <Trophy className="w-10 h-10 text-[#002347]/20" />
                    <span className="text-[10px] font-semibold uppercase text-slate-400">
                      FT UWKS
                    </span>
                  </div>
                )}
                {/* Level Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider backdrop-blur-md ${
                      item.level.toLowerCase() === "internasional"
                        ? "bg-purple-600/90 text-white"
                        : "bg-[#002C5F]/90 text-white"
                    }`}
                  >
                    {item.level}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#E5B80B] mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{tCommon("tahun")} {item.year}</span>
                </div>

                <h3 className="font-bold text-[#002347] text-base group-hover:text-[#002C5F] transition-colors line-clamp-2 leading-snug mb-2">
                  {item.title}
                </h3>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 min-w-0 pr-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-medium">{item.achieverName}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#E5B80B] group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
