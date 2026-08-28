"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Newspaper,
} from "lucide-react";
import type { Berita } from "@/lib/db/schema";
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
import { BeritaFormSheet } from "./berita-form-sheet";
import { BeritaPreviewDialog } from "./berita-preview-dialog";
import { BeritaDeleteDialog } from "./berita-delete-dialog";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface BeritaApiResponse {
  data: Berita[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ─────────────────────────────────────────────
// Status & Kategori badge config
// ─────────────────────────────────────────────
const statusConfig = {
  published: { label: "Published", className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" },
  draft: { label: "Draft", className: "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-100" },
  archived: { label: "Archived", className: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100" },
};

const kategoriConfig: Record<string, { label: string; className: string }> = {
  berita:   { label: "Berita",   className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100" },
  kegiatan: { label: "Kegiatan", className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" },
  beasiswa: { label: "Beasiswa", className: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100" },
};

const columnHelper = createColumnHelper<Berita>();

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export function BeritaTable() {
  // Filter state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Berita | undefined>(undefined);
  const [previewTarget, setPreviewTarget] = useState<Berita | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Berita | null>(null);

  // ─── Query ──────────────────────────────────
  const { data, isLoading, isError } = useQuery<BeritaApiResponse>({
    queryKey: ["berita", search, categoryFilter, statusFilter, dateFrom, dateTo, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (search) params.set("search", search);
      if (categoryFilter) params.set("category", categoryFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      const res = await fetch(`/api/berita?${params}`);
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
    columnHelper.accessor("title", {
      header: "Judul",
      cell: (info) => (
        <div className="max-w-[260px]">
          <p className="font-medium text-gray-900 truncate">{info.getValue()}</p>
          <p className="text-xs text-gray-400 font-mono truncate mt-0.5">/{info.row.original.slug}</p>
        </div>
      ),
    }),
    columnHelper.accessor("category", {
      header: "Kategori",
      cell: (info) => {
        const val = info.getValue();
        const cfg = val ? (kategoriConfig[val] ?? { label: val, className: "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100" }) : null;
        return cfg
          ? <Badge className={cfg.className}>{cfg.label}</Badge>
          : <span className="italic text-gray-300 text-xs">—</span>;
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const cfg = statusConfig[info.getValue()];
        return (
          <Badge className={cfg.className}>{cfg.label}</Badge>
        );
      },
    }),
    columnHelper.accessor("publishedAt", {
      header: "Tanggal Terbit",
      cell: (info) => {
        const v = info.getValue();
        if (!v) return <span className="text-gray-300 text-xs">—</span>;
        return (
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {format(new Date(v), "d MMM yyyy", { locale: idLocale })}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-gray-500 hover:text-blue-600"
            title="Preview"
            onClick={() => setPreviewTarget(row.original)}
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>
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
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari judul atau slug..."
              className="pl-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            />
          </div>

          {/* Category */}
          <Select value={categoryFilter || "all"} onValueChange={(v) => { setCategoryFilter((v ?? "all") === "all" ? "" : (v ?? "")); resetPage(); }}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="berita">Berita</SelectItem>
              <SelectItem value="kegiatan">Kegiatan</SelectItem>
              <SelectItem value="beasiswa">Beasiswa</SelectItem>
            </SelectContent>
          </Select>

          {/* Status */}
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v ?? "all"); resetPage(); }}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          {/* Date range */}
          <Input
            type="date"
            className="w-38"
            title="Tanggal dari"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); resetPage(); }}
          />
          <Input
            type="date"
            className="w-38"
            title="Tanggal sampai"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); resetPage(); }}
          />

          <div className="ml-auto">
            <Button
              onClick={() => {
                setEditTarget(undefined);
                setFormOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Berita
            </Button>
          </div>
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
            <Newspaper className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Belum ada berita</p>
            <p className="text-gray-400 text-sm mt-1">
              Klik &quot;Tambah Berita&quot; untuk membuat berita pertama.
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
            {meta.total} berita
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

      {/* Dialogs & Sheet */}
      <BeritaFormSheet
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditTarget(undefined);
        }}
        berita={editTarget}
      />
      <BeritaPreviewDialog
        berita={previewTarget}
        onOpenChange={(open) => !open && setPreviewTarget(null)}
      />
      <BeritaDeleteDialog
        berita={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      />
    </div>
  );
}
