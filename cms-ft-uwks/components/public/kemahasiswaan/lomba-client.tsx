"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Medal,
  Calendar,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Trophy,
} from "lucide-react";
import { isAfter, isSameDay } from "date-fns";
import type { Lomba } from "@/lib/db/schema";
import { useTranslations, useLocale } from "next-intl";

interface LombaClientProps {
  initialData: Lomba[];
}

export default function LombaClient({ initialData }: LombaClientProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const t = useTranslations("kemahasiswaan.lomba");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const formatDate = (dateVal: Date | string) => {
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

  const isLombaOpen = (endDateVal: Date | string) => {
    const end = new Date(endDateVal);
    end.setHours(0, 0, 0, 0);
    return isAfter(end, today) || isSameDay(end, today);
  };

  // Filter items
  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      const open = isLombaOpen(item.tanggalSelesaiPendaftaran);
      const matchLevel =
        selectedLevel === "all" ||
        item.tingkat.toLowerCase() === selectedLevel.toLowerCase();
      const matchStatus =
        selectedStatus === "all" ||
        (selectedStatus === "open" && open) ||
        (selectedStatus === "closed" && !open);

      return matchLevel && matchStatus;
    });
  }, [initialData, selectedLevel, selectedStatus, today]);

  // Group into Active and Closed
  const openLomba = useMemo(() => {
    return filteredData.filter((item) => isLombaOpen(item.tanggalSelesaiPendaftaran));
  }, [filteredData, today]);

  const closedLomba = useMemo(() => {
    return filteredData.filter((item) => !isLombaOpen(item.tanggalSelesaiPendaftaran));
  }, [filteredData, today]);

  const renderLombaCard = (item: Lomba, isOpen: boolean) => {
    return (
      <div
        key={item.id}
        className={`bg-white rounded-xl border p-5 sm:p-6 transition-all duration-300 flex flex-col md:flex-row gap-5 ${
          isOpen
            ? "border-slate-200 shadow-xs hover:shadow-lg hover:border-[#002347]/30"
            : "border-slate-200/80 bg-slate-50/50 opacity-80"
        }`}
      >
        {/* Poster / Thumbnail Image */}
        <div className="relative w-full md:w-56 h-64 md:h-auto shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
          {item.posterUrl ? (
            <Image
              src={item.posterUrl}
              alt={item.namaLomba}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 240px"
            />
          ) : (
            <div className="w-full h-full min-h-[160px] flex flex-col items-center justify-center text-slate-300 gap-2 p-4">
              <Medal className="w-12 h-12 opacity-40 text-[#002347]" />
              <span className="text-[10px] font-semibold uppercase text-slate-400">
                FT UWKS
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                item.tingkat.toLowerCase() === "internasional"
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              {tCommon("tingkat")}: {item.tingkat}
            </span>

            {isOpen ? (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                {tCommon("masihDibuka")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                <XCircle className="w-3 h-3" />
                {tCommon("sudahBerakhir")}
              </span>
            )}
          </div>

          <h3 className="font-bold text-[#002347] text-base sm:text-lg mb-2 leading-snug">
            {item.namaLomba}
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <Calendar className="w-4 h-4 text-[#E5B80B] shrink-0" />
            <span>
              <strong className="text-[#002347]">{t("periodePendaftaran")}:</strong>{" "}
              {formatDate(item.tanggalMulaiPendaftaran)} — {formatDate(item.tanggalSelesaiPendaftaran)}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 whitespace-pre-line line-clamp-3">
            {item.deskripsi}
          </p>

          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-end">
            {isOpen ? (
              <a
                href={item.linkPendaftaran}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#002C5F] hover:bg-[#002347] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <span>{t("daftarSekarang")}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                disabled
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 text-slate-400 font-semibold text-xs rounded-lg cursor-not-allowed uppercase"
              >
                <span>{t("pendaftaranDitutup")}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* ── Filters Bar ── */}
      <div className="bg-[#F8F9FA] rounded-xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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

          {/* Filter Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#002347] uppercase whitespace-nowrap">
              Status:
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002C5F] shadow-2xs"
            >
              <option value="all">{locale === "en" ? "All Status" : "Semua Status"}</option>
              <option value="open">{tCommon("masihDibuka")}</option>
              <option value="closed">{tCommon("sudahBerakhir")}</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-medium text-slate-500 self-end sm:self-center">
          Total: <span className="font-bold text-[#002347]">{filteredData.length}</span> {locale === "en" ? "competitions" : "lomba"}
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

      {/* ── Section: Masih Dibuka ── */}
      {openLomba.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-lg font-bold text-[#002347] uppercase tracking-tight flex items-center gap-2">
              <span>{t("pendaftaranMasihDibuka")}</span>
              <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                {openLomba.length}
              </span>
            </h3>
          </div>

          <div className="space-y-4">
            {openLomba.map((item) => renderLombaCard(item, true))}
          </div>
        </section>
      )}

      {/* ── Section: Sudah Berakhir ── */}
      {closedLomba.length > 0 && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <h3 className="text-lg font-bold text-slate-600 uppercase tracking-tight flex items-center gap-2">
              <span>{t("pendaftaranSudahBerakhir")}</span>
              <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full font-bold">
                {closedLomba.length}
              </span>
            </h3>
          </div>

          <div className="space-y-4">
            {closedLomba.map((item) => renderLombaCard(item, false))}
          </div>
        </section>
      )}
    </div>
  );
}
