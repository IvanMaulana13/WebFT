"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { Plus, Pencil, Trash2, Loader2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";

interface ProgramStudiRow {
  id: number;
  nama: string;
  kode: string;
}

interface FormState {
  nama: string;
  kode: string;
}

const EMPTY_FORM: FormState = { nama: "", kode: "" };

const columnHelper = createColumnHelper<ProgramStudiRow>();

export function ProgramStudiTable() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProgramStudiRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProgramStudiRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const { data, isLoading } = useQuery<{ data: ProgramStudiRow[] }>({
    queryKey: ["akademik", "program-studi"],
    queryFn: async () => {
      const res = await fetch("/api/akademik/program-studi");
      if (!res.ok) throw new Error("Gagal mengambil data");
      return res.json();
    },
  });

  const rows = data?.data ?? [];

  const saveMutation = useMutation({
    mutationFn: async () => {
      const url = editTarget
        ? `/api/akademik/program-studi/${editTarget.id}`
        : "/api/akademik/program-studi";
      const method = editTarget ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Gagal menyimpan");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["akademik", "program-studi"] });
      setDialogOpen(false);
      toast.success(editTarget ? "Program studi berhasil diperbarui" : "Program studi berhasil ditambahkan");
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/akademik/program-studi/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Gagal menghapus");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["akademik", "program-studi"] });
      setDeleteTarget(null);
      toast.success("Program studi berhasil dihapus");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const columns = [
    columnHelper.display({
      id: "no",
      header: "No.",
      cell: ({ row }) => <span className="text-gray-500">{row.index + 1}</span>,
    }),
    columnHelper.accessor("nama", {
      header: "Nama Program Studi",
      cell: (info) => <span className="font-medium text-gray-900">{info.getValue()}</span>,
    }),
    columnHelper.accessor("kode", {
      header: "Kode",
      cell: (info) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">
          {info.getValue()}
        </span>
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
              setForm({ nama: row.original.nama, kode: row.original.kode });
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

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditTarget(null);
            setForm(EMPTY_FORM);
            setFormError(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Program Studi
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /><span>Memuat data...</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16">
            <Database className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Belum ada program studi</p>
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
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Program Studi" : "Tambah Program Studi"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="nama-prodi">Nama Program Studi</Label>
              <Input
                id="nama-prodi"
                placeholder="cth. Teknik Informatika"
                value={form.nama}
                onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kode-prodi">Kode (singkatan unik)</Label>
              <Input
                id="kode-prodi"
                placeholder="cth. TI"
                value={form.kode}
                onChange={(e) => setForm((f) => ({ ...f, kode: e.target.value.toUpperCase() }))}
              />
              <p className="text-xs text-gray-400">Hanya huruf dan angka, maks. 20 karakter</p>
            </div>
            {formError && <p className="text-sm text-red-500">{formError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={!form.nama || !form.kode || saveMutation.isPending}
            >
              {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editTarget ? "Simpan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Program Studi?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.nama}</strong> ({deleteTarget?.kode}) akan dihapus. Program studi tidak dapat
              dihapus jika masih ada data jadwal atau akreditasi yang terkait.
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
