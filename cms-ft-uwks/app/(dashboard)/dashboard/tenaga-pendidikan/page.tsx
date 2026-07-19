"use client";

import * as React from "react";

// Metadata diset via document.title karena ini client component
// Untuk SSR metadata: buat wrapper server component jika diperlukan
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

import { tenagaPendidikanSchema, type TenagaPendidikanInput } from "@/lib/validations";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface TenagaPendidikanRecord {
  id: number;
  photoUrl: string | null;
  nuptk: string | null;
  name: string;
  jabatan: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface ApiListResponse {
  data: TenagaPendidikanRecord[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ─────────────────────────────────────────────
// API helpers
// ─────────────────────────────────────────────
async function fetchList(search: string, page: number): Promise<ApiListResponse> {
  const params = new URLSearchParams({ search, page: String(page), limit: "10" });
  const res = await fetch(`/api/tenaga-pendidikan?${params}`);
  if (!res.ok) throw new Error("Gagal mengambil data");
  return res.json();
}

async function createRecord(data: TenagaPendidikanInput) {
  const res = await fetch("/api/tenaga-pendidikan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Gagal menyimpan data");
  return json;
}

async function updateRecord(id: number, data: TenagaPendidikanInput) {
  const res = await fetch(`/api/tenaga-pendidikan/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Gagal memperbarui data");
  return json;
}

async function deleteRecord(id: number) {
  const res = await fetch(`/api/tenaga-pendidikan/${id}`, { method: "DELETE" });
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
  defaultValues?: Partial<TenagaPendidikanInput & { id: number }>;
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
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TenagaPendidikanInput>({
    resolver: zodResolver(tenagaPendidikanSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      jabatan: defaultValues?.jabatan ?? "",
      email: defaultValues?.email ?? "",
      nuptk: defaultValues?.nuptk ?? "",
      photoUrl: defaultValues?.photoUrl ?? "",
    },
  });

  // Reset form setiap kali dialog dibuka dengan data baru
  React.useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name ?? "",
        jabatan: defaultValues?.jabatan ?? "",
        email: defaultValues?.email ?? "",
        nuptk: defaultValues?.nuptk ?? "",
        photoUrl: defaultValues?.photoUrl ?? "",
      });
      setPreviewUrl(defaultValues?.photoUrl ?? "");
    }
  }, [open, defaultValues, reset]);

  const createMutation = useMutation({
    mutationFn: createRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenaga-pendidikan"] });
      toast.success("Tenaga pendidikan berhasil ditambahkan");
      onClose();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: (data: TenagaPendidikanInput) =>
      updateRecord(defaultValues!.id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenaga-pendidikan"] });
      toast.success("Tenaga pendidikan berhasil diperbarui");
      onClose();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi sisi client sebelum upload
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file melebihi 2MB.");
      return;
    }

    // Preview lokal
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

  const onSubmit = (data: TenagaPendidikanInput) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isBusy = isSubmitting || uploading || createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Tenaga Pendidikan" : "Tambah Tenaga Pendidikan"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Foto Upload */}
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
              htmlFor="photo-upload"
              className="cursor-pointer flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Upload className="w-4 h-4" />
              {previewUrl ? "Ganti Foto" : "Unggah Foto"}
            </Label>
            <input
              id="photo-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <p className="text-xs text-gray-400">JPG, PNG, WebP • Maks 2MB</p>
          </div>

          {/* NUPTK */}
          <div className="space-y-1">
            <Label htmlFor="nuptk">NUPTK</Label>
            <Input
              id="nuptk"
              placeholder="Contoh: 1234567890123456"
              {...register("nuptk")}
            />
            {errors.nuptk && (
              <p className="text-xs text-red-500">{errors.nuptk.message}</p>
            )}
          </div>

          {/* Nama */}
          <div className="space-y-1">
            <Label htmlFor="name">
              Nama <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Nama lengkap"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Jabatan */}
          <div className="space-y-1">
            <Label htmlFor="jabatan">
              Jabatan <span className="text-red-500">*</span>
            </Label>
            <Input
              id="jabatan"
              placeholder="Contoh: Staf Administrasi"
              {...register("jabatan")}
            />
            {errors.jabatan && (
              <p className="text-xs text-red-500">{errors.jabatan.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="contoh@uwks.ac.id"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isBusy}>
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
// Main Page Component
// ─────────────────────────────────────────────
export default function TenagaPendidikanPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<
    (Partial<TenagaPendidikanInput> & { id: number }) | undefined
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
    queryKey: ["tenaga-pendidikan", debouncedSearch, page],
    queryFn: () => fetchList(debouncedSearch, page),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteRecord(deleteTarget!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenaga-pendidikan"] });
      toast.success(`${deleteTarget?.name} berhasil dihapus`);
      setDeleteTarget(null);
    },
    onError: (err: Error) => {
      toast.error(err.message);
      setDeleteTarget(null);
    },
  });

  const columns: ColumnDef<TenagaPendidikanRecord>[] = [
    {
      accessorKey: "photoUrl",
      header: "Foto",
      cell: ({ row }) => {
        const url = row.original.photoUrl;
        return (
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
            {url ? (
              <Image
                src={url}
                alt={row.original.name}
                width={36}
                height={36}
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
      accessorKey: "nuptk",
      header: "NUPTK",
      cell: ({ row }) => (
        <span className="text-sm font-mono text-gray-600">
          {row.original.nuptk ?? <span className="text-gray-300">—</span>}
        </span>
      ),
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
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">{row.original.jabatan}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">{row.original.email}</span>
      ),
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
                  jabatan: record.jabatan,
                  email: record.email,
                  nuptk: record.nuptk ?? "",
                  photoUrl: record.photoUrl ?? "",
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
              onClick={() => setDeleteTarget({ id: record.id, name: record.name })}
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
          <h1 className="text-2xl font-bold text-gray-900">Tenaga Pendidikan</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola data tenaga kependidikan Fakultas Teknik UWKS
          </p>
        </div>
        <Button
          onClick={() => {
            setEditTarget(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Cari nama atau NUPTK..."
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
                <TableCell colSpan={columns.length} className="h-32 text-center text-red-500">
                  Gagal memuat data. Coba lagi.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-gray-400">
                  Tidak ada data tenaga pendidikan.
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
            ? `Menampilkan ${data.data.length} dari ${data.meta.total} data • Halaman ${page} dari ${data.meta.totalPages}`
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

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tenaga Pendidikan?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menghapus{" "}
              <span className="font-semibold text-gray-900">{deleteTarget?.name}</span>.
              Data tidak akan tampil di daftar, namun tetap tersimpan di database
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
