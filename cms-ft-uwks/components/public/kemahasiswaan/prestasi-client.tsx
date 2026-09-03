"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Medal, User, Calendar, Award, ChevronRight } from "lucide-react";
import type { Prestasi } from "@/lib/db/schema";

interface PrestasiClientProps {
  initialData: Prestasi[];
}

export default function PrestasiClient({ initialData }: PrestasiClientProps) {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

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
              Tahun:
            </span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002C5F] shadow-2xs"
            >
              <option value="all">Semua Tahun</option>
              {availableYears.map((year) => (
                <option key={year} value={year.toString()}>
                  Tahun {year}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Tingkat */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#002347] uppercase whitespace-nowrap">
              Tingkat:
            </span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002C5F] shadow-2xs"
            >
              <option value="all">Semua Tingkat</option>
              <option value="nasional">Nasional</option>
              <option value="internasional">Internasional</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-medium text-slate-500 self-end sm:self-center">
          Menampilkan <span className="font-bold text-[#002347]">{filteredData.length}</span> prestasi
        </div>
      </div>

      {/* ── Prestasi Grid ── */}
      {filteredData.length === 0 ? (
        <div className="bg-[#F8F9FA] rounded-xl p-12 text-center border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8" />
          </div>
          <p className="text-slate-600 font-semibold mb-1">
            Tidak ada prestasi untuk tahun/tingkat yang dipilih.
          </p>
          <p className="text-xs text-slate-400">
            Coba ubah opsi filter di atas untuk melihat data prestasi lainnya.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredData.map((item) => (
            <Link
              key={item.id}
              href={`/prestasi/${item.id}`}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#002347]/30 transition-all duration-300 flex flex-col transform hover:-translate-y-1"
            >
              {/* Image / Banner */}
              <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-50 via-slate-50 to-orange-50 flex items-center justify-center text-[#E5B80B]">
                    <Medal className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-[#002347] text-[#E5B80B] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Tingkat {item.level}
                  </span>
                  <span className="bg-white/90 backdrop-blur-xs text-[#002347] text-[10px] font-bold px-2 py-1 rounded-full border border-slate-200 shadow-sm">
                    {item.year}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-[#002347] text-base mb-2 group-hover:text-[#002C5F] line-clamp-2 transition-colors">
                  {item.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-600 mb-4">
                  <User className="w-3.5 h-3.5 text-[#E5B80B] shrink-0" />
                  <span className="font-medium truncate">{item.achieverName}</span>
                </div>

                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#002347] group-hover:text-[#E5B80B] transition-colors">
                  <span>Lihat Detail Prestasi</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
