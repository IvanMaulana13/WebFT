"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Filter, User } from "lucide-react";

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
            placeholder="Cari Dosen (Nama, NIDN, NIK)..."
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
            <option value="all">Semua Program Studi</option>
            {prodiOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Dosen Table (1:1 Stitch Design) ── */}
      {filteredDosen.length > 0 ? (
        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#002347] text-white">
                <th className="p-3.5 font-bold uppercase tracking-wider text-xs">Foto</th>
                <th className="p-3.5 font-bold uppercase tracking-wider text-xs">NIK</th>
                <th className="p-3.5 font-bold uppercase tracking-wider text-xs">Kode</th>
                <th className="p-3.5 font-bold uppercase tracking-wider text-xs">NIDN</th>
                <th className="p-3.5 font-bold uppercase tracking-wider text-xs">Nama Lengkap</th>
                <th className="p-3.5 font-bold uppercase tracking-wider text-xs">Prodi</th>
                <th className="p-3.5 font-bold uppercase tracking-wider text-xs">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredDosen.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                  }`}
                >
                  <td className="p-3.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 relative">
                      {item.photoUrl ? (
                        <Image
                          src={item.photoUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 font-medium text-slate-700">{item.nik}</td>
                  <td className="p-3.5 text-slate-600">{item.kodeDosen}</td>
                  <td className="p-3.5 text-slate-600">{item.nidn}</td>
                  <td className="p-3.5 font-bold text-[#002347]">{item.name}</td>
                  <td className="p-3.5 font-medium text-slate-700">{item.prodi}</td>
                  <td className="p-3.5">
                    <a
                      href={`mailto:${item.email}`}
                      className="text-[#002347] hover:text-[#E5B80B] underline transition-colors"
                    >
                      {item.email}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm">
          Tidak ada data dosen yang sesuai pencarian/filter.
        </div>
      )}
    </div>
  );
}
