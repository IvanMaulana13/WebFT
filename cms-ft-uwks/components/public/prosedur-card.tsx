"use client";

import { useState } from "react";
import { FileText, ExternalLink, Download, UserCheck, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProsedurItem {
  id: number;
  judulSop: string;
  narasi: string;
  fileUrl: string | null;
  linkUrl: string | null;
  penanggungJawab: string;
}

export default function ProsedurCard({ item }: { item: ProsedurItem }) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("akademik.prosedur");
  const tCommon = useTranslations("common");

  const isLong = item.narasi.length > 220;
  const displayNarasi = !isLong || expanded ? item.narasi : `${item.narasi.slice(0, 220)}...`;

  const targetUrl = item.fileUrl || item.linkUrl || "#";
  const isFile = Boolean(item.fileUrl);

  return (
    <div className="bg-[#F8F9FA] rounded-xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#002347] text-[#E5B80B] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            {isFile ? <FileText className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-[#002347] text-base leading-snug">
              {item.judulSop}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <UserCheck className="w-3.5 h-3.5 text-[#E5B80B]" />
              <span>
                {t("penanggungJawab")}:{" "}
                <strong className="text-slate-700">{item.penanggungJawab}</strong>
              </span>
            </div>
          </div>
        </div>

        <span
          className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
            isFile ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
          }`}
        >
          {isFile ? t("dokumenPdf") : t("tautanEksternal")}
        </span>
      </div>

      <div className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
        <p>{displayNarasi}</p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-[#002347] hover:text-[#E5B80B] font-semibold mt-1 inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{expanded ? t("sembunyikan") : tCommon("bacaSelengkapnya")}</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
        <span
          className={`sm:hidden inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
            isFile ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
          }`}
        >
          {isFile ? t("dokumenPdf") : t("tautanEksternal")}
        </span>

        {targetUrl !== "#" ? (
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5B80B] hover:bg-[#d4a800] text-[#002347] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            {isFile ? <Download className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
            <span>{isFile ? t("unduhSop") : t("bukaSop")}</span>
          </a>
        ) : (
          <span className="ml-auto text-xs text-slate-400 italic">
            {t("dokumenBelumTersedia")}
          </span>
        )}
      </div>
    </div>
  );
}
