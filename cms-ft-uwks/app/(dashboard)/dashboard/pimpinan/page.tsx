"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Upload,
  UserRound,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { pimpinanSchema, JABATAN_DEKAN, type PimpinanInput } from "@/lib/validations";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface PimpinanRecord {
  id: number;
  name: string;
  photoUrl: string | null;
  jabatan: string;
  periodeMulai: string | null;
  periodeSelesai: string | null;
  sambutan: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface ApiListResponse {
  data: PimpinanRecord[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ─────────────────────────────────────────────
// API helpers
// ─────────────────────────────────────────────
async function fetchList(search: string, page: number): Promise<ApiListResponse> {
  const params = new URLSearchParams({ search, page: String(page), limit: "10" });
  const res = await fetch(`/api/pimpinan?${params}`);
  if (!res.ok) throw new Error("Gagal mengambil data");
  return res.json();
}

async function createRecord(data: PimpinanInput) {
  const res = await fetch("/api/pimpinan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Gagal menyimpan data");
  return json;
}

async function updateRecord(id: number, data: PimpinanInput) {
  const res = await fetch(`/api/pimpinan/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Gagal memperbarui data");
  return json;
}

async function deleteRecord(id: number) {
  const res = await fetch(`/api/pimpinan/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Gagal menghapus data");
  return json;
}

async function uploadPhoto(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Gagal mengunggah foto");
  return json.url as string;
}

// ─────────────────────────────────────────────
// Form Dialog
// ─────────────────────────────────────────────
interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  defaultValues?: Partial<PimpinanInput & { id: number }>;
}

function FormDialog({ open, onClose, defaultValues }: FormDialogProps) {
  const isEdit = !!defaultValues?.id;
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = React.useState<string>(
    defaultValues?.photoUrl ?? ""
  );
  const [uploading, setUploading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PimpinanInput>({
    resolver: zodResolver(pimpinanSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      photoUrl: defaultValues?.photoUrl ?? "",
      jabatan: defaultValues?.jabatan ?? "",
      periodeMulai: defaultValues?.periodeMulai ?? "",
      periodeSelesai: defaultValues?.periodeSelesai ?? "",
      sambutan: defaultValues?.sambutan ?? "",
    },
  });

  const jabatanValue = watch("jabatan");
  const isDekan = jabatanValue?.trim() === JABATAN_DEKAN;

  React.useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name ?? "",
        photoUrl: defaultValues?.photoUrl ?? "",
        jabatan: defaultValues?.jabatan ?? "",
        periodeMulai: defaultValues?.periodeMulai ?? "",
        periodeSelesai: defaultValues?.periodeSelesai ?? "",
        sambutan: defaultValues?.sambutan ?? "",
      });
      setPreviewUrl(defaultValues?.photoUrl ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues?.id]);

  const createMutation = useMutation({
    mutationFn: createRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pimpinan"] });
      toast.success("Pimpinan berhasil ditambahkan");
      onClose();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: (data: PimpinanInput) => updateRecord(defaultValues!.id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pimpinan"] });
      toast.success("Pimpinan berhasil diperbarui");
      onClose();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file melebihi 2MB.");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    try {
      setUploading(true);
      const url = await uploadPhoto(file);
      setValue("photoUrl", url);
      setPreviewUrl(url);
      toast.success("Foto berhasil diunggah");
    } catch (err) {
      toast.error((err as Error).message);
      setPreviewUrl(defaultValues?.photoUrl ?? "");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: PimpinanInput) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isBusy =
    isSubmitting || uploading || createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Pimpinan Fakultas" : "Tambah Pimpinan Fakultas"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
          {/* ── Foto Upload ── */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview foto"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <UserRound className="w-10 h-10 text-gray-400" />
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <Label
              htmlFor="pimpinan-photo-upload"
              className="cursor-pointer flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Upload className="w-4 h-4" />
              {previewUrl ? "Ganti Foto" : "Unggah Foto"}
            </Label>
            <input
              id="pimpinan-photo-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <p className="text-xs text-gray-400">JPG, PNG, WebP • Maks 2MB</p>
          </div>

          {/* ── Nama ── */}
          <div className="space-y-1">
            <Label htmlFor="pimpinan-name">
              Nama <span className="text-red-500">*</span>
            </Label>
            <Input
              id="pimpinan-name"
              placeholder="Nama lengkap beserta gelar"
              {...register("name")}
              className={errors.name ? "border-red-400" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* ── Jabatan ── */}
          <div className="space-y-1">
            <Label htmlFor="pimpinan-jabatan">
              Jabatan <span className="text-red-500">*</span>
            </Label>
            <Input
              id="pimpinan-jabatan"
              placeholder='Contoh: Dekan, Wakil Dekan I'
              {...register("jabatan")}
              className={errors.jabatan ? "border-red-400" : ""}
            />
            {errors.jabatan && (
              <p className="text-xs text-red-500">{errors.jabatan.message}</p>
            )}
            {isDekan && (
              <p className="text-xs text-blue-600 font-medium">
                ℹ️ Jabatan Dekan — field Sambutan akan tersedia di bawah.
              </p>
            )}
          </div>

          {/* ── Periode Mulai ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="pimpinan-mulai">Periode Mulai</Label>
              <Input
                id="pimpinan-mulai"
                type="date"
                {...register("periodeMulai")}
                className={errors.periodeMulai ? "border-red-400" : ""}
              />
              {errors.periodeMulai && (
                <p className="text-xs text-red-500">
                  {errors.periodeMulai.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="pimpinan-selesai">Periode Selesai</Label>
              <Input
                id="pimpinan-selesai"
                type="date"
                {...register("periodeSelesai")}
                className={errors.periodeSelesai ? "border-red-400" : ""}
              />
              {errors.periodeSelesai && (
                <p className="text-xs text-red-500">
                  {errors.periodeSelesai.message}
                </p>
              )}
            </div>
          </div>

          {/* ── Sambutan (hanya tampil jika jabatan = Dekan) ── */}
          {isDekan && (
            <div className="space-y-1">
              <Label htmlFor="pimpinan-sambutan">
                Sambutan Dekan
              </Label>
              <textarea
                id="pimpinan-sambutan"
                rows={5}
                placeholder="Tulis sambutan dari Dekan..."
                {...register("sambutan")}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
              {errors.sambutan && (
                <p className="text-xs text-red-500">{errors.sambutan.message}</p>
              )}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isBusy}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isBusy}>
              {isBusy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatPeriode(mulai: string | null, selesai: string | null) {
  if (!mulai && !selesai) return <span className="text-gray-300">—</span>;
  const fmt = (d: string | null) => {
    if (!d) return "...";
    // YYYY-MM-DD → tahun saja untuk ringkas
    return d.slice(0, 4);
  };
  return (
    <span className="text-sm text-gray-600">
      {fmt(mulai)} – {fmt(selesai)}
    </span>
  );
}

// ─────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────
export default function PimpinanPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<
    (Partial<PimpinanInput> & { id: number }) | undefined
  >(undefined);
  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: number;
    name: string;
  } | null>(null);

  // Debounce search
  React.useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pimpinan", debouncedSearch, page],
    queryFn: () => fetchList(debouncedSearch, page),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteRecord(deleteTarget!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pimpinan"] });
      toast.success(`${deleteTarget?.name} berhasil dihapus`);
      setDeleteTarget(null);
    },
    onError: (err: Error) => {
      toast.error(err.message);
      setDeleteTarget(null);
    },
  });

  const columns: ColumnDef<PimpinanRecord>[] = [
    {
      accessorKey: "photoUrl",
      header: "Foto",
      cell: ({ row }) => {
        const url = row.original.photoUrl;
        return (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
            {url ? (
              <Image
                src={url}
                alt={row.original.name}
                width={40}
                height={40}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <UserRound className="w-5 h-5 text-gray-400" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "jabatan",
      header: "Jabatan",
      cell: ({ row }) => {
        const isDekan = row.original.jabatan === JABATAN_DEKAN;
        return (
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
              isDekan
                ? "bg-amber-50 text-amber-700 ring-amber-600/20"
                : "bg-gray-50 text-gray-700 ring-gray-600/20"
            }`}
          >
            {row.original.jabatan}
          </span>
        );
      },
    },
    {
      id: "periode",
      header: "Periode",
      cell: ({ row }) =>
        formatPeriode(row.original.periodeMulai, row.original.periodeSelesai),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditTarget({
                  id: record.id,
                  name: record.name,
                  photoUrl: record.photoUrl ?? "",
                  jabatan: record.jabatan,
                  periodeMulai: record.periodeMulai ?? "",
                  periodeSelesai: record.periodeSelesai ?? "",
                  sambutan: record.sambutan ?? "",
                });
                setDialogOpen(true);
              }}
            >
              <Pencil className="w-3.5 h-3.5 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={() =>
                setDeleteTarget({ id: record.id, name: record.name })
              }
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Hapus
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.meta.totalPages ?? 1,
    state: { pagination: { pageIndex: page - 1, pageSize: 10 } },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pimpinan Fakultas</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola data pimpinan Fakultas Teknik UWKS
          </p>
        </div>
        <Button
          onClick={() => {
            setEditTarget(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pimpinan
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          id="pimpinan-search"
          placeholder="Cari nama atau jabatan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-gray-50 hover:bg-gray-50">
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold text-gray-700">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-red-500"
                >
                  Gagal memuat data. Coba lagi.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-gray-400"
                >
                  {debouncedSearch
                    ? "Tidak ada pimpinan yang sesuai pencarian."
                    : 'Belum ada data. Klik "Tambah Pimpinan" untuk memulai.'}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {data
            ? `Menampilkan ${data.data.length} dari ${data.meta.total} data • Halaman ${page} dari ${Math.max(1, data.meta.totalPages)}`
            : "Memuat..."}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!data || page >= data.meta.totalPages}
          >
            Berikutnya
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Form Dialog */}
      <FormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditTarget(undefined);
        }}
        defaultValues={editTarget}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pimpinan?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menghapus{" "}
              <span className="font-semibold text-gray-900">
                {deleteTarget?.name}
              </span>
              . Data tidak akan tampil di daftar, namun tetap tersimpan di database
              (soft delete).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
