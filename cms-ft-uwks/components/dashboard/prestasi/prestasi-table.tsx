"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import Image from "next/image";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from "lucide-react";
import type { Prestasi } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrestasiFormDialog } from "./prestasi-form-dialog";
import { PrestasiDeleteDialog } from "./prestasi-delete-dialog";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface PrestasiApiResponse {
  data: Prestasi[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ─────────────────────────────────────────────
// Level badge config
// ─────────────────────────────────────────────
const levelConfig = {
  nasional: {
    label: "Nasional",
    className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
  },
  internasional: {
    label: "Internasional",
    className: "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100",
  },
};

const columnHelper = createColumnHelper<Prestasi>();

// Build year options: current year down to 10 years ago
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - i);

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export function PrestasiTable() {
  // Filter state
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Prestasi | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Prestasi | null>(null);

  // ─── Query ──────────────────────────────────
  const { data, isLoading, isError } = useQuery<PrestasiApiResponse>({
    queryKey: ["prestasi", search, levelFilter, yearFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (search) params.set("search", search);
      if (levelFilter !== "all") params.set("level", levelFilter);
      if (yearFilter !== "all") params.set("year", yearFilter);
      const res = await fetch(`/api/prestasi?${params}`);
      if (!res.ok) throw new Error("Gagal mengambil data");
      return res.json();
    },
    staleTime: 0,
  });

  const rows = data?.data ?? [];
  const meta = data?.meta;

  const resetPage = () => setPage(1);

  // ─── Columns ─────────────────────────────────
  const columns = [
    // Thumbnail
    columnHelper.accessor("imageUrl", {
      header: "Foto",
      cell: (info) => {
        const url = info.getValue();
        return url ? (
          <div className="relative w-12 h-12 rounded-md overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
            <Image
              src={url}
              alt="Foto prestasi"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-md border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-300">
            <Trophy className="w-5 h-5" />
          </div>
        );
      },
    }),

    // Title
    columnHelper.accessor("title", {
      header: "Judul Prestasi",
      cell: (info) => (
        <div className="max-w-[240px]">
          <p className="font-medium text-gray-900 truncate">{info.getValue()}</p>
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {info.row.original.achieverName}
          </p>
        </div>
      ),
    }),

    // Achiever Name
    columnHelper.accessor("achieverName", {
      header: "Nama Peraih",
      cell: (info) => (
        <span className="text-sm text-gray-700">{info.getValue()}</span>
      ),
    }),

    // Level
    columnHelper.accessor("level", {
      header: "Tingkat",
      cell: (info) => {
        const cfg = levelConfig[info.getValue()];
        return <Badge className={cfg.className}>{cfg.label}</Badge>;
      },
    }),

    // Year
    columnHelper.accessor("year", {
      header: "Tahun",
      cell: (info) => (
        <span className="text-sm font-semibold text-gray-700">{info.getValue()}</span>
      ),
    }),

    // Actions
    columnHelper.display({
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-gray-500 hover:text-amber-600"
            title="Edit"
            onClick={() => {
              setEditTarget(row.original);
              setFormOpen(true);
            }}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-gray-500 hover:text-red-600"
            title="Hapus"
            onClick={() => setDeleteTarget(row.original)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: meta?.totalPages ?? 1,
  });

  // ─── Render ──────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Filter toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="prestasi-search"
            placeholder="Cari judul atau nama peraih..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
          />
        </div>

        {/* Level filter */}
        <Select value={levelFilter} onValueChange={(v) => { setLevelFilter(v ?? "all"); resetPage(); }}>
          <SelectTrigger className="w-40" id="prestasi-level-filter">
            <SelectValue placeholder="Semua Tingkat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tingkat</SelectItem>
            <SelectItem value="nasional">Nasional</SelectItem>
            <SelectItem value="internasional">Internasional</SelectItem>
          </SelectContent>
        </Select>

        {/* Year filter */}
        <Select value={yearFilter} onValueChange={(v) => { setYearFilter(v ?? "all"); resetPage(); }}>
          <SelectTrigger className="w-32" id="prestasi-year-filter">
            <SelectValue placeholder="Semua Tahun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tahun</SelectItem>
            {YEAR_OPTIONS.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto">
          <Button
            id="prestasi-add-btn"
            onClick={() => {
              setEditTarget(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Prestasi
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Memuat data...</span>
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-500">
            Gagal memuat data. Coba refresh halaman.
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Belum ada data prestasi</p>
            <p className="text-gray-400 text-sm mt-1">
              Klik &quot;Tambah Prestasi&quot; untuk menambahkan prestasi pertama.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {table.getFlatHeaders().map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {typeof header.column.columnDef.header === "string"
                      ? header.column.columnDef.header
                      : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm text-gray-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Menampilkan {(page - 1) * limit + 1}–{Math.min(page * limit, meta.total)} dari{" "}
            {meta.total} prestasi
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 py-1 border rounded-md bg-white">
              {page} / {meta.totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <PrestasiFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditTarget(undefined);
        }}
        prestasi={editTarget}
      />
      <PrestasiDeleteDialog
        prestasi={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      />
    </div>
  );
}
