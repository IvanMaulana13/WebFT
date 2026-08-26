"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { Plus, Pencil, Trash2, Loader2, FileText, CalendarDays } from "lucide-react";
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

interface JadwalRow {
  id: number;
  prodiId: number;
  prodiNama: string | null;
  fileUrl: string;
  semester: "ganjil" | "genap";
  tahunAjaran: string;
  createdAt: string;
  updatedAt: string;
}

interface FormState {
  prodiId: string;
  fileUrl: string;
  semester: string;
  tahunAjaran: string;
}

const EMPTY_FORM: FormState = { prodiId: "", fileUrl: "", semester: "", tahunAjaran: "" };

const columnHelper = createColumnHelper<JadwalRow>();

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export function JadwalTable() {
  const queryClient = useQueryClient();
  const [prodiFilter, setProdiFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [tahunFilter, setTahunFilter] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<JadwalRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JadwalRow | null>(null);
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
  if (semesterFilter !== "all") params.set("semester", semesterFilter);
  if (tahunFilter) params.set("tahun_ajaran", tahunFilter);

  const { data, isLoading } = useQuery<{ data: JadwalRow[] }>({
    queryKey: ["akademik", "jadwal", prodiFilter, semesterFilter, tahunFilter],
    queryFn: async () => {
      const res = await fetch(`/api/akademik/jadwal?${params}`);
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
        fileUrl: form.fileUrl,
        semester: form.semester,
        tahunAjaran: form.tahunAjaran,
      };
      const url = editTarget ? `/api/akademik/jadwal/${editTarget.id}` : "/api/akademik/jadwal";
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
      queryClient.invalidateQueries({ queryKey: ["akademik", "jadwal"] });
      setDialogOpen(false);
      toast.success(editTarget ? "Jadwal berhasil diperbarui" : "Jadwal berhasil ditambahkan");
    },
    onError: (err: Error) => {
      setFormError(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/akademik/jadwal/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Gagal menghapus");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["akademik", "jadwal"] });
      setDeleteTarget(null);
      toast.success("Jadwal berhasil dihapus");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ─── Table columns ─────────────────────────
  const columns = [
    columnHelper.accessor("prodiNama", {
      header: "Program Studi",
      cell: (info) => (
        <span className="font-medium text-gray-900">{info.getValue() ?? "—"}</span>
      ),
    }),
    columnHelper.accessor("semester", {
      header: "Semester",
      cell: (info) => (
        <span className={`capitalize inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          info.getValue() === "ganjil" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
        }`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("tahunAjaran", {
      header: "Tahun Ajaran",
      cell: (info) => <span className="text-sm text-gray-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor("fileUrl", {
      header: "File",
      cell: (info) => (
        <a
          href={info.getValue()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <FileText className="w-3.5 h-3.5" />
          {info.getValue().split("/").pop()}
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
                fileUrl: row.original.fileUrl,
                semester: row.original.semester,
                tahunAjaran: row.original.tahunAjaran,
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

        <Select value={semesterFilter} onValueChange={(v) => setSemesterFilter(v ?? "all")}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Semua Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Semester</SelectItem>
            <SelectItem value="ganjil">Ganjil</SelectItem>
            <SelectItem value="genap">Genap</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Cari tahun ajaran..."
          className="w-44"
          value={tahunFilter}
          onChange={(e) => setTahunFilter(e.target.value)}
        />

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
            Tambah Jadwal
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
        ) : rows.length === 0 ? (
          <div className="text-center py-20">
            <CalendarDays className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Belum ada data jadwal</p>
            <p className="text-gray-400 text-sm mt-1">Klik "Tambah Jadwal" untuk mulai.</p>
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
            <DialogTitle>{editTarget ? "Edit Jadwal Perkuliahan" : "Tambah Jadwal Perkuliahan"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Program Studi</Label>
              <Select value={form.prodiId} onValueChange={(v) => setForm((f) => ({ ...f, prodiId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih program studi..." />
                </SelectTrigger>
                <SelectContent>
                  {prodiList.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={form.semester} onValueChange={(v) => setForm((f) => ({ ...f, semester: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih semester..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ganjil">Ganjil</SelectItem>
                  <SelectItem value="genap">Genap</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tahun-ajaran-jadwal">Tahun Ajaran</Label>
              <Input
                id="tahun-ajaran-jadwal"
                placeholder="cth. 2026/2027"
                value={form.tahunAjaran}
                onChange={(e) => setForm((f) => ({ ...f, tahunAjaran: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>File Jadwal (PDF)</Label>
              <DocumentUpload
                value={form.fileUrl}
                onChange={(url) => setForm((f) => ({ ...f, fileUrl: url }))}
                onClear={() => setForm((f) => ({ ...f, fileUrl: "" }))}
                label="Klik untuk upload file jadwal"
              />
            </div>

            {formError && <p className="text-sm text-red-500">{formError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={!form.prodiId || !form.fileUrl || !form.semester || !form.tahunAjaran || saveMutation.isPending}
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
            <AlertDialogTitle>Hapus Jadwal Ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Jadwal {deleteTarget?.prodiNama} — {deleteTarget?.semester} {deleteTarget?.tahunAjaran} akan dihapus.
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
