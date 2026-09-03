"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Search,
  X,
  Loader2,
  Newspaper,
  Trophy,
  User,
  Users2,
  Medal,
  FileText,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface SearchResultItem {
  type: "berita" | "prestasi" | "dosen" | "ormawa" | "lomba" | "prosedur";
  // Berita
  title?: string;
  slug?: string;
  thumbnail_url?: string | null;
  category?: string;
  // Prestasi
  id?: number;
  image_url?: string | null;
  // Dosen
  name?: string;
  photo_url?: string | null;
  prodi?: string;
  // Ormawa
  nama_organisasi?: string;
  logo_url?: string | null;
  link_website?: string | null;
  // Lomba
  nama_lomba?: string;
  // Prosedur
  judul_sop?: string;
}

interface SearchResponse {
  query: string;
  data: {
    berita: SearchResultItem[];
    prestasi: SearchResultItem[];
    dosen: SearchResultItem[];
    ormawa: SearchResultItem[];
    lomba: SearchResultItem[];
    prosedur: SearchResultItem[];
  };
  counts: {
    berita: number;
    prestasi: number;
    dosen: number;
    ormawa: number;
    lomba: number;
    prosedur: number;
    total: number;
  };
}

interface GlobalSearchProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function GlobalSearch({ isMobile = false, onClose }: GlobalSearchProps) {
  const t = useTranslations("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount if mobile
  useEffect(() => {
    if (isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobile]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation & escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Debounced search (400ms)
  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data: SearchResponse = await res.json();
          setResults(data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Search fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setResults(null);
    setIsOpen(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleItemClick = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const totalResults = results?.counts.total ?? 0;
  const hasResults = totalResults > 0;
  const showEmptyMessage =
    !isLoading && query.trim().length >= 2 && results && totalResults === 0;

  return (
    <div
      ref={containerRef}
      className={`relative ${isMobile ? "w-full" : "w-64 lg:w-72"}`}
    >
      {/* ── Search Input Field ── */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          onFocus={() => {
            if (query.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          placeholder={isMobile ? t("mobilePlaceholder") : t("placeholder")}
          className={`w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002347] focus:bg-white transition-all shadow-2xs ${
            isOpen ? "ring-2 ring-[#002347] bg-white" : ""
          }`}
        />

        {/* Left Icon: Search or Loading Spinner */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#002347]" />
          ) : (
            <Search className="w-3.5 h-3.5" />
          )}
        </div>

        {/* Right Icon: Clear button */}
        {query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
            title="Clear"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Floating Dropdown Panel ── */}
      {isOpen && (
        <div
          className={`absolute ${
            isMobile
              ? "left-0 right-0 top-full mt-2 w-full"
              : "right-0 top-full mt-2 w-[420px] max-w-[90vw]"
          } bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col max-h-[460px] animate-in fade-in-50 slide-in-from-top-2 duration-150`}
        >
          {/* Top Info Bar */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span>
              {isLoading
                ? t("searching")
                : hasResults
                ? t("totalFound", { total: totalResults })
                : query.trim().length < 2
                ? t("minChars")
                : t("noResults", { query })}
            </span>
            {hasResults && (
              <span className="text-[10px] text-[#002347] font-bold bg-[#E5B80B]/20 border border-[#E5B80B]/40 px-2 py-0.5 rounded-full">
                {totalResults}
              </span>
            )}
          </div>

          {/* Results Scroll Area */}
          <div className="overflow-y-auto p-2 space-y-4 divide-y divide-slate-100 flex-1">
            {/* 1. Berita & Kegiatan */}
            {results?.data.berita && results.data.berita.length > 0 && (
              <div className="pt-2 first:pt-0">
                <div className="px-2 py-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#002347]">
                  <Newspaper className="w-3.5 h-3.5 text-[#E5B80B]" />
                  <span>{t("categories.berita")}</span>
                  <span className="ml-auto text-[10px] text-slate-400 font-normal">
                    {results.data.berita.length} / {results.counts.berita}
                  </span>
                </div>
                <div className="space-y-1 mt-1">
                  {results.data.berita.map((item) => (
                    <Link
                      key={`berita-${item.slug}`}
                      href={`/berita/${item.slug}`}
                      onClick={handleItemClick}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-md bg-slate-100 shrink-0 overflow-hidden relative border border-slate-200">
                        {item.thumbnail_url ? (
                          <Image
                            src={item.thumbnail_url}
                            alt={item.title || ""}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Newspaper className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#002347] truncate leading-tight">
                          {item.title}
                        </h4>
                        {item.category && (
                          <span className="text-[10px] text-slate-400 uppercase font-medium">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#E5B80B] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Prestasi Mahasiswa */}
            {results?.data.prestasi && results.data.prestasi.length > 0 && (
              <div className="pt-2 first:pt-0">
                <div className="px-2 py-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#002347]">
                  <Trophy className="w-3.5 h-3.5 text-[#E5B80B]" />
                  <span>{t("categories.prestasi")}</span>
                  <span className="ml-auto text-[10px] text-slate-400 font-normal">
                    {results.data.prestasi.length} / {results.counts.prestasi}
                  </span>
                </div>
                <div className="space-y-1 mt-1">
                  {results.data.prestasi.map((item) => (
                    <Link
                      key={`prestasi-${item.id}`}
                      href={`/prestasi/${item.id}`}
                      onClick={handleItemClick}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-md bg-amber-50 text-[#E5B80B] shrink-0 flex items-center justify-center border border-amber-200">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#002347] truncate leading-tight">
                          {item.title}
                        </h4>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#E5B80B] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Dosen Pengajar */}
            {results?.data.dosen && results.data.dosen.length > 0 && (
              <div className="pt-2 first:pt-0">
                <div className="px-2 py-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#002347]">
                  <User className="w-3.5 h-3.5 text-[#E5B80B]" />
                  <span>{t("categories.dosen")}</span>
                  <span className="ml-auto text-[10px] text-slate-400 font-normal">
                    {results.data.dosen.length} / {results.counts.dosen}
                  </span>
                </div>
                <div className="space-y-1 mt-1">
                  {results.data.dosen.map((item) => (
                    <Link
                      key={`dosen-${item.id}`}
                      href="/dosen"
                      onClick={handleItemClick}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 shrink-0 flex items-center justify-center border border-slate-200 overflow-hidden relative">
                        {item.photo_url ? (
                          <Image
                            src={item.photo_url}
                            alt={item.name || ""}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#002347] truncate leading-tight">
                          {item.name}
                        </h4>
                        {item.prodi && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            {item.prodi}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#E5B80B] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Organisasi Kemahasiswaan */}
            {results?.data.ormawa && results.data.ormawa.length > 0 && (
              <div className="pt-2 first:pt-0">
                <div className="px-2 py-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#002347]">
                  <Users2 className="w-3.5 h-3.5 text-[#E5B80B]" />
                  <span>{t("categories.ormawa")}</span>
                  <span className="ml-auto text-[10px] text-slate-400 font-normal">
                    {results.data.ormawa.length} / {results.counts.ormawa}
                  </span>
                </div>
                <div className="space-y-1 mt-1">
                  {results.data.ormawa.map((item) => (
                    <Link
                      key={`ormawa-${item.id}`}
                      href="/kemahasiswaan/ormawa"
                      onClick={handleItemClick}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#002C5F] shrink-0 flex items-center justify-center border border-blue-100 overflow-hidden relative">
                        {item.logo_url ? (
                          <Image
                            src={item.logo_url}
                            alt={item.nama_organisasi || ""}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <Users2 className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#002347] truncate leading-tight">
                          {item.nama_organisasi}
                        </h4>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#E5B80B] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Informasi Lomba */}
            {results?.data.lomba && results.data.lomba.length > 0 && (
              <div className="pt-2 first:pt-0">
                <div className="px-2 py-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#002347]">
                  <Medal className="w-3.5 h-3.5 text-[#E5B80B]" />
                  <span>{t("categories.lomba")}</span>
                  <span className="ml-auto text-[10px] text-slate-400 font-normal">
                    {results.data.lomba.length} / {results.counts.lomba}
                  </span>
                </div>
                <div className="space-y-1 mt-1">
                  {results.data.lomba.map((item) => (
                    <Link
                      key={`lomba-${item.id}`}
                      href="/kemahasiswaan/lomba"
                      onClick={handleItemClick}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 text-[#002347] shrink-0 flex items-center justify-center border border-indigo-100">
                        <Medal className="w-5 h-5 text-[#E5B80B]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#002347] truncate leading-tight">
                          {item.nama_lomba}
                        </h4>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#E5B80B] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Prosedur Akademik */}
            {results?.data.prosedur && results.data.prosedur.length > 0 && (
              <div className="pt-2 first:pt-0">
                <div className="px-2 py-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#002347]">
                  <FileText className="w-3.5 h-3.5 text-[#E5B80B]" />
                  <span>{t("categories.prosedur")}</span>
                  <span className="ml-auto text-[10px] text-slate-400 font-normal">
                    {results.data.prosedur.length} / {results.counts.prosedur}
                  </span>
                </div>
                <div className="space-y-1 mt-1">
                  {results.data.prosedur.map((item) => (
                    <Link
                      key={`prosedur-${item.id}`}
                      href="/akademik/prosedur"
                      onClick={handleItemClick}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 shrink-0 flex items-center justify-center border border-emerald-200">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#002347] truncate leading-tight">
                          {item.judul_sop}
                        </h4>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#E5B80B] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {showEmptyMessage && (
              <div className="py-8 text-center px-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                  <Search className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-700">
                  {t("noResults", { query })}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Coba kata kunci lain seperti &quot;teknik&quot;, &quot;skripsi&quot;, &quot;robot&quot;, atau nama dosen.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
