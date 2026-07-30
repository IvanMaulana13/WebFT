"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Handshake,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import type { Kemitraan } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KemitraanSortableRow } from "./kemitraan-sortable-row";
import { KemitraanFormDialog } from "./kemitraan-form-dialog";
import { KemitraanDeleteDialog } from "./kemitraan-delete-dialog";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface KemitraanApiResponse {
  data: Kemitraan[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

const columnHelper = createColumnHelper<Kemitraan>();

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export function KemitraanTable() {
  const queryClient = useQueryClient();

  // Filter state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Kemitraan | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Kemitraan | null>(null);

  // Local data for optimistic reorder
  const [localData, setLocalData] = useState<Kemitraan[]>([]);

  // ─── Query ───────────────────────────────────
  const { data, isLoading, isError } = useQuery<KemitraanApiResponse>({
    queryKey: ["kemitraan", search, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (search) params.set("search", search);
      const res = await fetch(`/api/kemitraan?${params}`);
      if (!res.ok) throw new Error("Gagal mengambil data");
      return res.json();
    },
    staleTime: 0,
  });

  const rows = data?.data ?? [];
  const displayRows =
    localData.length > 0 && localData.length === rows.length ? localData : rows;

  // ─── Reorder mutation ────────────────────────
  const reorderMutation = useMutation({
    mutationFn: async (items: { id: number; orderIndex: number }[]) => {
      const res = await fetch("/api/kemitraan/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal menyimpan urutan");
      return json;
    },
    onSuccess: () => {
      toast.success("Urutan berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["kemitraan"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
      setLocalData(rows);
    },
  });

  // ─── DnD sensors ─────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const currentRows = displayRows;
      const oldIndex = currentRows.findIndex((r) => r.id === active.id);
      const newIndex = currentRows.findIndex((r) => r.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(currentRows, oldIndex, newIndex);
      setLocalData(reordered);

      const items = reordered.map((item, idx) => ({
        id: item.id,
        orderIndex: idx,
      }));
      reorderMutation.mutate(items);
    },
    [displayRows, reorderMutation]
  );

  // ─── Columns ──────────────────────────────────
  const columns = [
    // No. column
    columnHelper.display({
      id: "no",
      header: "#",
      cell: ({ row }) => (
        <span className="text-xs font-mono text-gray-400">
          {row.index + 1 + (page - 1) * limit}
        </span>
      ),
    }),

    // Logo
    columnHelper.accessor("logoUrl", {
      header: "Logo",
      cell: (info) => {
        const url = info.getValue();
        return url ? (
          <div className="relative w-12 h-10 rounded border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
            <Image
              src={url}
              alt="Logo mitra"
              fill
              className="object-contain p-1"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-12 h-10 rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-300">
            <Handshake className="w-5 h-5" />
          </div>
        );
      },
    }),

    // Partner name
    columnHelper.accessor("partnerName", {
      header: "Nama Mitra",
      cell: (info) => (
        <div className="max-w-[200px]">
          <p className="font-medium text-gray-900 truncate">{info.getValue()}</p>
          {info.row.original.partnershipType && (
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {info.row.original.partnershipType}
            </p>
          )}
        </div>
      ),
    }),

    // MoU Date
    columnHelper.accessor("mouDate", {
      header: "Tanggal MoU",
      cell: (info) => {
        const v = info.getValue();
        if (!v) return <span className="text-gray-300 text-xs">—</span>;
        try {
          const dateObj = v instanceof Date ? v : new Date(v);
          return (
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {format(dateObj, "d MMM yyyy", { locale: idLocale })}
            </span>
          );
        } catch {
          return <span className="text-gray-400 text-xs">{String(v)}</span>;
        }
      },
    }),

    // Website
    columnHelper.accessor("websiteUrl", {
      header: "Website",
      cell: (info) => {
        const url = info.getValue();
        if (!url) return <span className="text-gray-300 text-xs">—</span>;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="max-w-[120px] truncate">{url.replace(/^https?:\/\//, "")}</span>
          </a>
        );
      },
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
    data: displayRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.meta.totalPages ?? 1,
  });

  const meta = data?.meta;

  // ─── Render ───────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="kemitraan-search"
              placeholder="Cari nama mitra atau tipe..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                setLocalData([]);
              }}
            />
          </div>
        </div>

        <Button
          id="kemitraan-add-btn"
          onClick={() => {
            setEditTarget(undefined);
            setFormOpen(true);
          }}
          className="shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Mitra
        </Button>
      </div>

      {/* Reorder hint */}
      <p className="text-xs text-gray-400 flex items-center gap-1">
        <span>⇅</span> Drag baris untuk mengubah urutan tampil
        {reorderMutation.isPending && (
          <Loader2 className="w-3 h-3 animate-spin ml-1" />
        )}
      </p>

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
        ) : displayRows.length === 0 ? (
          <div className="text-center py-20">
            <Handshake className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Belum ada data kemitraan</p>
            <p className="text-gray-400 text-sm mt-1">
              Klik &quot;Tambah Mitra&quot; untuk menambahkan mitra pertama.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {/* Drag handle header */}
                  <th className="w-10 px-3 py-3" />
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
                <SortableContext
                  items={displayRows.map((r) => r.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <KemitraanSortableRow key={row.original.id} row={row} />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </DndContext>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Menampilkan {(page - 1) * limit + 1}–{Math.min(page * limit, meta.total)} dari{" "}
            {meta.total} mitra
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => { setPage((p) => p - 1); setLocalData([]); }}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 py-1 border rounded-md bg-white">
              {page} / {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => { setPage((p) => p + 1); setLocalData([]); }}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <KemitraanFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditTarget(undefined);
        }}
        kemitraan={editTarget}
      />
      <KemitraanDeleteDialog
        kemitraan={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      />
    </div>
  );
}
