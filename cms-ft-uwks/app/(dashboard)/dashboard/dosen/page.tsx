"use client";

import * as React from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useForm, Controller } from "react-hook-form";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Filter,
  X,
} from "lucide-react";

import {
  dosenSchema,
  PRODI_LIST,
  type DosenInput,
} from "@/lib/validations";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface DosenRecord {
  id: number;
  photoUrl: string | null;
  nik: string;
  kodeDosen: string;
  nidn: string;
  name: string;
  prodi: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface ApiListResponse {
  data: DosenRecord[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ─────────────────────────────────────────────
// API helpers
// ─────────────────────────────────────────────
async function fetchList(
  search: string,
  prodi: string,
  page: number
): Promise<ApiListResponse> {
  const params = new URLSearchParams({
    search,
    prodi,
    page: String(page),
    limit: "10",
  });
  const res = await fetch(`/api/dosen?${params}`);
  if (!res.ok) throw new Error("Gagal mengambil data");
  return res.json();
}

interface CreateResult {
  data?: DosenRecord;
  error?: string;
  details?: Record<string, string[]>;
}

async function createRecord(data: DosenInput): Promise<CreateResult> {
  const res = await fetch("/api/dosen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    // Kembalikan details agar bisa ditangani field-by-field
    const err = new Error(json.error ?? "Gagal menyimpan data") as Error & {
      details?: Record<string, string[]>;
    };
    err.details = json.details;
    throw err;
  }
  return json;
}

async function updateRecord(id: number, data: DosenInput): Promise<CreateResult> {
  const res = await fetch(`/api/dosen/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.error ?? "Gagal memperbarui data") as Error & {
      details?: Record<string, string[]>;
    };
    err.details = json.details;
    throw err;
  }
  return json;
}

async function deleteRecord(id: number) {
  const res = await fetch(`/api/dosen/${id}`, { method: "DELETE" });
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
  defaultValues?: Partial<DosenInput & { id: number }>;
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
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DosenInput>({
    resolver: zodResolver(dosenSchema),
    defaultValues: {
      photoUrl: defaultValues?.photoUrl ?? "",
      nik: defaultValues?.nik ?? "",
      kodeDosen: defaultValues?.kodeDosen ?? "",
      nidn: defaultValues?.nidn ?? "",
      name: defaultValues?.name ?? "",
      prodi: defaultValues?.prodi ?? "",
      email: defaultValues?.email ?? "",
    },
  });

  // Reset form setiap kali dialog dibuka dengan data baru
  React.useEffect(() => {
    if (open) {
      reset({
        photoUrl: defaultValues?.photoUrl ?? "",
        nik: defaultValues?.nik ?? "",
        kodeDosen: defaultValues?.kodeDosen ?? "",
        nidn: defaultValues?.nidn ?? "",
        name: defaultValues?.name ?? "",
        prodi: defaultValues?.prodi ?? "",
        email: defaultValues?.email ?? "",
      });
      setPreviewUrl(defaultValues?.photoUrl ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues?.id]);

  const handleMutationError = (err: unknown) => {
    const error = err as Error & { details?: Record<string, string[]> };
    if (error.details) {
      // Tampilkan error per-field (validasi duplikat)
      const fieldMap: Array<[keyof DosenInput, string[]]> = Object.entries(
        error.details
      ) as Array<[keyof DosenInput, string[]]>;
      fieldMap.forEach(([field, messages]) => {
        setError(field, { message: messages[0] });
      });
    } else {
      toast.error(error.message);
    }
  };

  const createMutation = useMutation({
    mutationFn: createRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      toast.success("Dosen berhasil ditambahkan");
      onClose();
    },
    onError: handleMutationError,
  });

  const updateMutation = useMutation({
    mutationFn: (data: DosenInput) => updateRecord(defaultValues!.id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      toast.success("Dosen berhasil diperbarui");
      onClose();
    },
    onError: handleMutationError,
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

  const onSubmit = (data: DosenInput) => {
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
            {isEdit ? "Edit Data Dosen" : "Tambah Dosen Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
          {/* ── Foto Upload ── */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview foto dosen"
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
              htmlFor="dosen-photo-upload"
              className="cursor-pointer flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Upload className="w-4 h-4" />
              {previewUrl ? "Ganti Foto" : "Unggah Foto"}
            </Label>
            <input
              id="dosen-photo-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <p className="text-xs text-gray-400">JPG, PNG, WebP • Maks 2MB</p>
          </div>

          {/* ── NIK ── */}
          <div className="space-y-1">
            <Label htmlFor="dosen-nik">
              NIK <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dosen-nik"
              placeholder="Contoh: 3578012345678901"
              {...register("nik")}
              className={errors.nik ? "border-red-400 focus-visible:ring-red-300" : ""}
            />
            {errors.nik && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <span className="inline-block w-3.5 h-3.5 rounded-full bg-red-500 text-white text-center leading-3.5 text-[9px] font-bold flex-shrink-0">!</span>
                {errors.nik.message}
              </p>
            )}
          </div>

          {/* ── Kode Dosen ── */}
          <div className="space-y-1">
            <Label htmlFor="dosen-kode">
              Kode Dosen <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dosen-kode"
              placeholder="Contoh: D001"
              {...register("kodeDosen")}
              className={errors.kodeDosen ? "border-red-400 focus-visible:ring-red-300" : ""}
            />
            {errors.kodeDosen && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <span className="inline-block w-3.5 h-3.5 rounded-full bg-red-500 text-white text-center leading-3.5 text-[9px] font-bold flex-shrink-0">!</span>
                {errors.kodeDosen.message}
              </p>
            )}
          </div>

          {/* ── NIDN ── */}
          <div className="space-y-1">
            <Label htmlFor="dosen-nidn">
              NIDN <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dosen-nidn"
              placeholder="Contoh: 0712345678"
              {...register("nidn")}
              className={errors.nidn ? "border-red-400 focus-visible:ring-red-300" : ""}
            />
            {errors.nidn && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <span className="inline-block w-3.5 h-3.5 rounded-full bg-red-500 text-white text-center leading-3.5 text-[9px] font-bold flex-shrink-0">!</span>
                {errors.nidn.message}
              </p>
            )}
          </div>

          {/* ── Nama ── */}
          <div className="space-y-1">
            <Label htmlFor="dosen-name">
              Nama <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dosen-name"
              placeholder="Nama lengkap dosen"
              {...register("name")}
              className={errors.name ? "border-red-400 focus-visible:ring-red-300" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <span className="inline-block w-3.5 h-3.5 rounded-full bg-red-500 text-white text-center leading-3.5 text-[9px] font-bold flex-shrink-0">!</span>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* ── Program Studi ── */}
          <div className="space-y-1">
            <Label htmlFor="dosen-prodi">
              Program Studi <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="prodi"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="dosen-prodi"
                    className={errors.prodi ? "border-red-400 focus-visible:ring-red-300" : ""}
                  >
                    <SelectValue placeholder="Pilih Program Studi" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODI_LIST.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.prodi && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <span className="inline-block w-3.5 h-3.5 rounded-full bg-red-500 text-white text-center leading-3.5 text-[9px] font-bold flex-shrink-0">!</span>
                {errors.prodi.message}
              </p>
            )}
          </div>

          {/* ── Email ── */}
          <div className="space-y-1">
            <Label htmlFor="dosen-email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dosen-email"
              type="email"
              placeholder="dosen@uwks.ac.id"
              {...register("email")}
              className={errors.email ? "border-red-400 focus-visible:ring-red-300" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <span className="inline-block w-3.5 h-3.5 rounded-full bg-red-500 text-white text-center leading-3.5 text-[9px] font-bold flex-shrink-0">!</span>
                {errors.email.message}
              </p>
            )}
          </div>

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
              {isEdit ? "Simpan Perubahan" : "Tambah Dosen"}
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
export default function DosenPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [filterProdi, setFilterProdi] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<
    (Partial<DosenInput> & { id: number }) | undefined
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

  // Reset page on filter change
  React.useEffect(() => {
    setPage(1);
  }, [filterProdi]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dosen", debouncedSearch, filterProdi, page],
    queryFn: () => fetchList(debouncedSearch, filterProdi, page),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteRecord(deleteTarget!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      toast.success(`${deleteTarget?.name} berhasil dihapus`);
      setDeleteTarget(null);
    },
    onError: (err: Error) => {
      toast.error(err.message);
      setDeleteTarget(null);
    },
  });

  const columns: ColumnDef<DosenRecord>[] = [
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
      accessorKey: "nik",
      header: "NIK",
      cell: ({ row }) => (
        <span className="text-sm font-mono text-gray-600">{row.original.nik}</span>
      ),
    },
    {
      accessorKey: "kodeDosen",
      header: "Kode Dosen",
      cell: ({ row }) => (
        <span className="text-sm font-mono font-semibold text-blue-700">
          {row.original.kodeDosen}
        </span>
      ),
    },
    {
      accessorKey: "nidn",
      header: "NIDN",
      cell: ({ row }) => (
        <span className="text-sm font-mono text-gray-600">{row.original.nidn}</span>
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
      accessorKey: "prodi",
      header: "Program Studi",
      cell: ({ row }) => (
        <span className="text-sm">
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
            {row.original.prodi}
          </span>
        </span>
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
                  photoUrl: record.photoUrl ?? "",
                  nik: record.nik,
                  kodeDosen: record.kodeDosen,
                  nidn: record.nidn,
                  name: record.name,
                  prodi: record.prodi,
                  email: record.email,
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
          <h1 className="text-2xl font-bold text-gray-900">Data Dosen</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola data dosen Fakultas Teknik UWKS
          </p>
        </div>
        <Button
          onClick={() => {
            setEditTarget(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Dosen
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="dosen-search"
            placeholder="Cari nama, NIK, Kode Dosen, NIDN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter Program Studi */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <Select
            value={filterProdi || "__all__"}
            onValueChange={(val) =>
              setFilterProdi(val === "__all__" ? "" : (val ?? ""))
            }
          >
            <SelectTrigger id="dosen-filter-prodi" className="w-48">
              <SelectValue placeholder="Semua Prodi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Semua Prodi</SelectItem>
              {PRODI_LIST.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filterProdi && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterProdi("")}
              className="px-2"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-gray-50 hover:bg-gray-50">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-gray-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
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
                  {debouncedSearch || filterProdi
                    ? "Tidak ada dosen yang sesuai filter."
                    : "Belum ada data dosen. Klik \"Tambah Dosen\" untuk memulai."}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
            <AlertDialogTitle>Hapus Dosen?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menghapus{" "}
              <span className="font-semibold text-gray-900">
                {deleteTarget?.name}
              </span>
              . Data tidak akan tampil di daftar, namun tetap tersimpan di
              database (soft delete).
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
