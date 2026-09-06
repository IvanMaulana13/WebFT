"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Filter, User } from "lucide-react";
import { useTranslations } from "next-intl";

export interface DosenItem {
  id: number;
  photoUrl?: string | null;
  nik: string;
  kodeDosen: string;
  nidn: string;
  name: string;
  prodi: string;
  email: string;
}

interface DosenContentProps {
  initialData: DosenItem[];
}

export default function DosenContent({ initialData }: DosenContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const t = useTranslations("profil.dosen");

  // Filter list by prodi and search term
  const filteredDosen = initialData.filter((item) => {
    const matchProdi =
      selectedProdi === "all" ||
      item.prodi.toLowerCase().includes(selectedProdi.toLowerCase());
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nidn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeDosen.toLowerCase().includes(searchTerm.toLowerCase());
    return matchProdi && matchSearch;
  });

  // Extract unique Prodi options
  const prodiOptions = Array.from(new Set(initialData.map((d) => d.prodi))).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* ── Search & Filter Controls Bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("cariDosen")}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#002347]"
          />
        </div>

        {/* Prodi Filter Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={selectedProdi}
            onChange={(e) => setSelectedProdi(e.target.value)}
            className="w-full sm:w-auto bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#002347]"
          >
            <option value="all">{t("filterProdi")}</option>
            {prodiOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Dosen Card Grid ── */}
      {filteredDosen.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredDosen.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col items-center text-center hover:border-[#E5B80B] hover:shadow-md transition-all"
            >
              <div className="w-36 h-44 relative rounded-lg overflow-hidden border border-slate-200 bg-slate-200 mb-4">
                {item.photoUrl ? (
                  <Image
                    src={item.photoUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
              <span className="text-[11px] font-bold text-[#002347] uppercase tracking-wider mb-1">
                {item.prodi}
              </span>
              <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">
                {item.name}
              </h3>
              {item.nidn && (
                <p className="text-[11px] text-slate-500 font-mono">
                  NIDN: {item.nidn}
                </p>
              )}
              {item.email && (
                <p className="text-[11px] text-[#002347] font-medium mt-1 truncate max-w-full">
                  {item.email}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 text-sm">
          {t("empty")}
        </div>
      )}
    </div>
  );
}
