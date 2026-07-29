"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  type ColumnFiltersState,
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
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import type { Informasi } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SortableRow } from "./sortable-row";
import { InformasiFormDialog } from "./informasi-form-dialog";
import { DeleteAlertDialog } from "./delete-alert-dialog";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface InformasiApiResponse {
  data: Informasi[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ─────────────────────────────────────────────
// Column helper
// ─────────────────────────────────────────────
const columnHelper = createColumnHelper<Informasi>();

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export function InformasiTable() {
  const queryClient = useQueryClient();

  // Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Informasi | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Informasi | null>(null);

  // Local data state for optimistic reorder
  const [localData, setLocalData] = useState<Informasi[]>([]);

  // ─── Query ───────────────────────────────────
  const { data, isLoading, isError } = useQuery<InformasiApiResponse>({
    queryKey: ["informasi", search, statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/informasi?${params}`);
      if (!res.ok) throw new Error("Gagal mengambil data");
      return res.json();
    },
    staleTime: 0,
  });

  // Sync localData with server data
  const rows = data?.data ?? [];
  const displayRows = localData.length > 0 && localData.length === rows.length
    ? localData
    : rows;

  // ─── Reorder mutation ────────────────────────
  const reorderMutation = useMutation({
    mutationFn: async (items: { id: number; orderIndex: number }[]) => {
      const res = await fetch("/api/informasi/reorder", {
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
      queryClient.invalidateQueries({ queryKey: ["informasi"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
      // Rollback to server data
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

      // Kirim urutan baru ke server
      const items = reordered.map((item, idx) => ({
        id: item.id,
        orderIndex: idx,
      }));
      reorderMutation.mutate(items);
    },
    [displayRows, reorderMutation]
  );

  // ─── Table columns ────────────────────────────
  const columns = [
    columnHelper.accessor("orderIndex", {
      header: "#",
      cell: (info) => (
        <span className="text-xs font-mono text-gray-400">
          {info.row.index + 1 + (page - 1) * limit}
        </span>
      ),
      size: 50,
    }),
    columnHelper.accessor("title", {
      header: "Judul",
      cell: (info) => (
        <div className="max-w-xs">
          <p className="font-medium text-gray-900 truncate">{info.getValue()}</p>
        </div>
      ),
    }),
    columnHelper.accessor("category", {
      header: "Kategori",
      cell: (info) => (
        <span className="text-gray-500 text-sm">
          {info.getValue() ?? <span className="italic text-gray-300">—</span>}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) =>
        info.getValue() === "published" ? (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
            Published
          </Badge>
        ) : (
          <Badge variant="outline" className="text-gray-500 border-gray-300">
            Draft
          </Badge>
        ),
    }),
    columnHelper.accessor("content", {
      header: "Konten",
      cell: (info) => (
        <p className="text-gray-400 text-xs max-w-xs truncate">{info.getValue()}</p>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-gray-500 hover:text-blue-600"
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
            onClick={() => setDeleteTarget(row.original)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    }),
  ];

  // ─── TanStack Table instance ──────────────────
  const [columnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data: displayRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { columnFilters },
    manualPagination: true,
    pageCount: data?.meta.totalPages ?? 1,
  });

  const meta = data?.meta;

  // ─── Render ───────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari judul atau kategori..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                setLocalData([]);
              }}
            />
          </div>

          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v ?? "all");
              setPage(1);
              setLocalData([]);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add button */}
        <Button
          onClick={() => {
            setEditTarget(undefined);
            setFormOpen(true);
          }}
          className="shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Informasi
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
            <div className="text-4xl mb-3">📄</div>
            <p className="text-gray-500 font-medium">Belum ada informasi</p>
            <p className="text-gray-400 text-sm mt-1">
              Klik &quot;Tambah Informasi&quot; untuk membuat entri baru.
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
                  {/* Drag handle column header */}
                  <th className="w-10 px-3 py-3" />
                  {table.getFlatHeaders().map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : typeof header.column.columnDef.header === "string"
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
                    <SortableRow key={row.original.id} row={row} />
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
            {meta.total} entri
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
      <InformasiFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditTarget(undefined);
        }}
        informasi={editTarget}
      />
      <DeleteAlertDialog
        informasi={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      />
    </div>
  );
}
