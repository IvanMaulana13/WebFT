"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2 } from "lucide-react";

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

const TABS = [
  { value: "semua",   label: "Semua" },
  { value: "berita",  label: "Berita" },
  { value: "kegiatan",label: "Kegiatan" },
  { value: "beasiswa",label: "Beasiswa" },
];

const kategoriBadge: Record<string, string> = {
  berita:   "bg-blue-100 text-blue-700 border border-blue-200",
  kegiatan: "bg-green-100 text-green-700 border border-green-200",
  beasiswa: "bg-amber-100 text-amber-700 border border-amber-200",
};

interface Props {
  items: BeritaItem[];
}

export function BeritaSection({ items }: Props) {
  const [activeTab, setActiveTab] = useState("semua");

  const filtered = activeTab === "semua"
    ? items
    : items.filter((b) => b.category === activeTab);

  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#002347] font-sans">
            Berita &amp; Kegiatan
          </h2>
          <div className="flex-grow h-px bg-slate-200" />
        </div>

        {/* Tab Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeTab === tab.value
                  ? "bg-[#002347] text-white border-[#002347]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#002347] hover:text-[#002347]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Berita Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const badgeCls = item.category ? (kategoriBadge[item.category] ?? "bg-slate-100 text-slate-600 border border-slate-200") : null;
              return (
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
                        {new Date(item.publishedAt || item.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      {badgeCls && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto capitalize ${badgeCls}`}>
                          {item.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-[#002347] group-hover:text-[#E5B80B] transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-sm">
            Belum ada berita dalam kategori ini.
          </div>
        )}
      </div>
    </section>
  );
}
