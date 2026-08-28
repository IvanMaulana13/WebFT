"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Plus, Pencil, Trash2, Loader2, FileText, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
interface ProgramStudi {
  id: number;
  nama: string;
  kode: string;
}

interface AkreditasiRow {
  id: number;
  prodiId: number;
  prodiNama: string | null;
  peringkat: string;
  noSk: string;
  tanggalBerlaku: string;
  fileSertifikat: string;
  createdAt: string;
  updatedAt: string;
}

interface FormState {
  prodiId: string;
  peringkat: string;
  noSk: string;
  tanggalBerlaku: string;
  fileSertifikat: string;
}

const EMPTY_FORM: FormState = {
  prodiId: "", peringkat: "", noSk: "", tanggalBerlaku: "", fileSertifikat: "",
};

// Badge warna berdasarkan peringkat
const peringkatBadge: Record<string, string> = {
  "Unggul": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Baik Sekali": "bg-blue-100 text-blue-700 border-blue-200",
  "Baik": "bg-sky-100 text-sky-700 border-sky-200",
  "A": "bg-purple-100 text-purple-700 border-purple-200",
  "B": "bg-amber-100 text-amber-700 border-amber-200",
  "C": "bg-orange-100 text-orange-700 border-orange-200",
};

const PERINGKAT_OPTIONS = ["Unggul", "Baik Sekali", "Baik", "A", "B", "C"];

const columnHelper = createColumnHelper<AkreditasiRow>();

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export function AkreditasiTable() {
  const queryClient = useQueryClient();
  const [prodiFilter, setProdiFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AkreditasiRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AkreditasiRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  // ─── Queries ───────────────────────────────
  const { data: prodiData } = useQuery<{ data: ProgramStudi[] }>({
    queryKey: ["akademik", "program-studi"],
    queryFn: async () => {
      const res = await fetch("/api/akademik/program-studi");
      if (!res.ok) throw new Error("Gagal mengambil prodi");
      return res.json();
    },
  });

  const prodiList = prodiData?.data ?? [];

  const params = new URLSearchParams();
  if (prodiFilter !== "all") params.set("prodi_id", prodiFilter);

  const { data, isLoading } = useQuery<{ data: AkreditasiRow[] }>({
    queryKey: ["akademik", "akreditasi", prodiFilter],
    queryFn: async () => {
      const res = await fetch(`/api/akademik/akreditasi?${params}`);
      if (!res.ok) throw new Error("Gagal mengambil data");
      return res.json();
    },
  });

  const rows = data?.data ?? [];

  // ─── Mutations ─────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        prodiId: parseInt(form.prodiId),
        peringkat: form.peringkat,
        noSk: form.noSk,
        tanggalBerlaku: form.tanggalBerlaku,
        fileSertifikat: form.fileSertifikat,
      };
      const url = editTarget ? `/api/akademik/akreditasi/${editTarget.id}` : "/api/akademik/akreditasi";
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
      queryClient.invalidateQueries({ queryKey: ["akademik", "akreditasi"] });
      setDialogOpen(false);
      toast.success(editTarget ? "Akreditasi berhasil diperbarui" : "Akreditasi berhasil ditambahkan");
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/akademik/akreditasi/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Gagal menghapus");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["akademik", "akreditasi"] });
      setDeleteTarget(null);
      toast.success("Akreditasi berhasil dihapus");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ─── Columns ───────────────────────────────
  const columns = [
    columnHelper.accessor("prodiNama", {
      header: "Program Studi",
      cell: (info) => <span className="font-medium text-gray-900">{info.getValue() ?? "—"}</span>,
    }),
    columnHelper.accessor("peringkat", {
      header: "Peringkat",
      cell: (info) => {
        const p = info.getValue();
        const cls = peringkatBadge[p] ?? "bg-gray-100 text-gray-700 border-gray-200";
        return <Badge className={`${cls} hover:${cls}`}>{p}</Badge>;
      },
    }),
    columnHelper.accessor("noSk", {
      header: "No. SK",
      cell: (info) => <span className="text-sm text-gray-600 font-mono">{info.getValue()}</span>,
    }),
    columnHelper.accessor("tanggalBerlaku", {
      header: "Tanggal Berlaku",
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
    columnHelper.accessor("fileSertifikat", {
      header: "Sertifikat",
      cell: (info) => (
        <a
          href={info.getValue()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <FileText className="w-3.5 h-3.5" />
          Lihat
        </a>
      ),
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
              setEditTarget(row.original);
              setForm({
                prodiId: String(row.original.prodiId),
                peringkat: row.original.peringkat,
                noSk: row.original.noSk,
                tanggalBerlaku: row.original.tanggalBerlaku?.split("T")[0] ?? "",
                fileSertifikat: row.original.fileSertifikat,
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
        <Select value={prodiFilter} onValueChange={(v) => setProdiFilter(v ?? "all")}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Semua Prodi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Prodi</SelectItem>
            {prodiList.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>{p.nama}</SelectItem>
            ))}
          </SelectContent>
        </Select>

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
            Tambah Akreditasi
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
            <Award className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Belum ada data akreditasi</p>
            <p className="text-gray-400 text-sm mt-1">Klik "Tambah Akreditasi" untuk mulai.</p>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Akreditasi" : "Tambah Akreditasi"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Program Studi</Label>
              <Select value={form.prodiId} onValueChange={(v) => setForm((f) => ({ ...f, prodiId: v ?? "" }))}>
                <SelectTrigger><SelectValue placeholder="Pilih program studi..." /></SelectTrigger>
                <SelectContent>
                  {prodiList.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Peringkat</Label>
              <Select value={form.peringkat} onValueChange={(v) => setForm((f) => ({ ...f, peringkat: v ?? "" }))}>
                <SelectTrigger><SelectValue placeholder="Pilih peringkat..." /></SelectTrigger>
                <SelectContent>
                  {PERINGKAT_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="no-sk">Nomor SK</Label>
              <Input
                id="no-sk"
                placeholder="cth. 1234/SK/BAN-PT/Ak-PPJ/S/VII/2024"
                value={form.noSk}
                onChange={(e) => setForm((f) => ({ ...f, noSk: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal-berlaku">Tanggal Berlaku</Label>
              <Input
                id="tanggal-berlaku"
                type="date"
                value={form.tanggalBerlaku}
                onChange={(e) => setForm((f) => ({ ...f, tanggalBerlaku: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Sertifikat (PDF / JPG / PNG)</Label>
              <DocumentUpload
                value={form.fileSertifikat}
                onChange={(url) => setForm((f) => ({ ...f, fileSertifikat: url }))}
                onClear={() => setForm((f) => ({ ...f, fileSertifikat: "" }))}
                accept=".pdf,.jpg,.jpeg,.png"
                label="Klik untuk upload sertifikat"
              />
            </div>

            {formError && <p className="text-sm text-red-500">{formError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={
                !form.prodiId || !form.peringkat || !form.noSk ||
                !form.tanggalBerlaku || !form.fileSertifikat || saveMutation.isPending
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
            <AlertDialogTitle>Hapus Data Akreditasi?</AlertDialogTitle>
            <AlertDialogDescription>
              Akreditasi {deleteTarget?.prodiNama} ({deleteTarget?.peringkat}) akan dihapus.
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
