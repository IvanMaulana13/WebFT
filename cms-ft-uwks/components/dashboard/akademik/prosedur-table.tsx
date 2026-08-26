"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { Plus, Pencil, Trash2, Loader2, Search, FileText, Link, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DocumentUpload } from "./document-upload";
import { toast } from "sonner";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface ProsedurRow {
  id: number;
  judulSop: string;
  narasi: string;
  fileUrl: string | null;
  linkUrl: string | null;
  penanggungJawab: string;
  createdAt: string;
  updatedAt: string;
}

type TipeSource = "file" | "link";

interface FormState {
  judulSop: string;
  narasi: string;
  penanggungJawab: string;
  tipe: TipeSource;
  fileUrl: string;
  linkUrl: string;
}

const EMPTY_FORM: FormState = {
  judulSop: "", narasi: "", penanggungJawab: "",
  tipe: "file", fileUrl: "", linkUrl: "",
};

const columnHelper = createColumnHelper<ProsedurRow>();

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export function ProsedurTable() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProsedurRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProsedurRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  // ─── Query ─────────────────────────────────
  const params = new URLSearchParams();
  if (search) params.set("search", search);

  const { data, isLoading } = useQuery<{ data: ProsedurRow[] }>({
    queryKey: ["akademik", "prosedur", search],
    queryFn: async () => {
      const res = await fetch(`/api/akademik/prosedur?${params}`);
      if (!res.ok) throw new Error("Gagal mengambil data");
      return res.json();
    },
  });

  const rows = data?.data ?? [];

  // ─── Mutations ─────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        judulSop: form.judulSop,
        narasi: form.narasi,
        penanggungJawab: form.penanggungJawab,
        fileUrl: form.tipe === "file" ? form.fileUrl : "",
        linkUrl: form.tipe === "link" ? form.linkUrl : "",
      };
      const url = editTarget ? `/api/akademik/prosedur/${editTarget.id}` : "/api/akademik/prosedur";
      const method = editTarget ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Gagal menyimpan");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["akademik", "prosedur"] });
      setDialogOpen(false);
      toast.success(editTarget ? "Prosedur berhasil diperbarui" : "Prosedur berhasil ditambahkan");
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/akademik/prosedur/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Gagal menghapus");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["akademik", "prosedur"] });
      setDeleteTarget(null);
      toast.success("Prosedur berhasil dihapus");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ─── Columns ───────────────────────────────
  const columns = [
    columnHelper.accessor("judulSop", {
      header: "Judul SOP",
      cell: (info) => (
        <div className="max-w-[260px]">
          <p className="font-medium text-gray-900 truncate">{info.getValue()}</p>
          <p className="text-xs text-gray-400 truncate mt-0.5">{info.row.original.narasi}</p>
        </div>
      ),
    }),
    columnHelper.accessor("penanggungJawab", {
      header: "Penanggung Jawab",
      cell: (info) => <span className="text-sm text-gray-600">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: "tipe",
      header: "Tipe",
      cell: ({ row }) => {
        const isFile = !!row.original.fileUrl;
        return (
          <Badge className={isFile
            ? "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100"
            : "bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100"
          }>
            {isFile ? (
              <><FileText className="w-3 h-3 mr-1" />File</>
            ) : (
              <><Link className="w-3 h-3 mr-1" />Link</>
            )}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "source",
      header: "Sumber",
      cell: ({ row }) => {
        const src = row.original.fileUrl ?? row.original.linkUrl;
        if (!src) return <span className="text-gray-300 text-xs">—</span>;
        return (
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline max-w-[160px] truncate"
          >
            {row.original.fileUrl ? (
              <><FileText className="w-3.5 h-3.5 shrink-0" />{src.split("/").pop()}</>
            ) : (
              <><Link className="w-3.5 h-3.5 shrink-0" />{src}</>
            )}
          </a>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost" size="sm"
            className="h-8 px-2 text-gray-500 hover:text-amber-600"
            onClick={() => {
              const r = row.original;
              setEditTarget(r);
              setForm({
                judulSop: r.judulSop,
                narasi: r.narasi,
                penanggungJawab: r.penanggungJawab,
                tipe: r.fileUrl ? "file" : "link",
                fileUrl: r.fileUrl ?? "",
                linkUrl: r.linkUrl ?? "",
              });
              setFormError(null);
              setDialogOpen(true);
            }}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost" size="sm"
            className="h-8 px-2 text-gray-500 hover:text-red-600"
            onClick={() => setDeleteTarget(row.original)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });

  // ─── Render ────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari judul atau penanggung jawab..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="ml-auto">
          <Button
            onClick={() => {
              setEditTarget(null);
              setForm(EMPTY_FORM);
              setFormError(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Prosedur
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /><span>Memuat data...</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-20">
            <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Belum ada prosedur akademik</p>
            <p className="text-gray-400 text-sm mt-1">Klik "Tambah Prosedur" untuk mulai.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {table.getFlatHeaders().map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {typeof header.column.columnDef.header === "string" ? header.column.columnDef.header : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
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

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditTarget(null); }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Prosedur Akademik" : "Tambah Prosedur Akademik"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="judul-sop">Judul SOP</Label>
              <Input
                id="judul-sop"
                placeholder="Judul prosedur/SOP..."
                value={form.judulSop}
                onChange={(e) => setForm((f) => ({ ...f, judulSop: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="narasi">Narasi / Deskripsi</Label>
              <Textarea
                id="narasi"
                placeholder="Deskripsi singkat prosedur..."
                rows={3}
                value={form.narasi}
                onChange={(e) => setForm((f) => ({ ...f, narasi: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="penanggung-jawab">Penanggung Jawab</Label>
              <Input
                id="penanggung-jawab"
                placeholder="Nama/jabatan penanggung jawab..."
                value={form.penanggungJawab}
                onChange={(e) => setForm((f) => ({ ...f, penanggungJawab: e.target.value }))}
              />
            </div>

            {/* Toggle File / Link */}
            <div className="space-y-3">
              <Label>Sumber Dokumen</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={form.tipe === "file" ? "default" : "outline"}
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setForm((f) => ({ ...f, tipe: "file", linkUrl: "" }))}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Upload File
                </Button>
                <Button
                  type="button"
                  variant={form.tipe === "link" ? "default" : "outline"}
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setForm((f) => ({ ...f, tipe: "link", fileUrl: "" }))}
                >
                  <Link className="w-3.5 h-3.5" />
                  Link Eksternal
                </Button>
              </div>

              {form.tipe === "file" ? (
                <DocumentUpload
                  value={form.fileUrl}
                  onChange={(url) => setForm((f) => ({ ...f, fileUrl: url }))}
                  onClear={() => setForm((f) => ({ ...f, fileUrl: "" }))}
                  label="Klik untuk upload dokumen SOP (PDF)"
                />
              ) : (
                <div className="space-y-1">
                  <Input
                    placeholder="https://..."
                    value={form.linkUrl}
                    onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
                  />
                  <p className="text-xs text-gray-400">Masukkan URL dokumen SOP eksternal</p>
                </div>
              )}
            </div>

            {formError && <p className="text-sm text-red-500">{formError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={
                !form.judulSop || !form.narasi || !form.penanggungJawab ||
                (form.tipe === "file" && !form.fileUrl) ||
                (form.tipe === "link" && !form.linkUrl) ||
                saveMutation.isPending
              }
            >
              {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editTarget ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Prosedur Akademik?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.judulSop}&rdquo; akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
