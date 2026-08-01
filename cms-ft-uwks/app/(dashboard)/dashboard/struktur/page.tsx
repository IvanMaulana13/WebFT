"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
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
import {
  ImageIcon,
  Upload,
  Trash2,
  Loader2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface StrukturRecord {
  id: number;
  imageUrl: string | null;
  updatedBy: number | null;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// API helpers
// ─────────────────────────────────────────────
async function fetchStruktur(): Promise<{ data: StrukturRecord | null }> {
  const res = await fetch("/api/struktur-organisasi");
  if (!res.ok) throw new Error("Gagal mengambil data");
  return res.json();
}

async function uploadGambar(file: File): Promise<{ data: StrukturRecord }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/struktur-organisasi", {
    method: "POST",
    body: fd,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Gagal mengunggah gambar");
  return json;
}

async function hapusGambar(): Promise<{ message: string }> {
  const res = await fetch("/api/struktur-organisasi", { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Gagal menghapus gambar");
  return json;
}

// ─────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────
export default function StrukturOrganisasiPage() {
  const queryClient = useQueryClient();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [confirmHapus, setConfirmHapus] = React.useState(false);
  const [localPreview, setLocalPreview] = React.useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["struktur-organisasi"],
    queryFn: fetchStruktur,
  });

  const currentImage = localPreview ?? data?.data?.imageUrl ?? null;

  const uploadMutation = useMutation({
    mutationFn: uploadGambar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["struktur-organisasi"] });
      setLocalPreview(null);
      toast.success("Gambar struktur organisasi berhasil diperbarui");
    },
    onError: (err: Error) => {
      toast.error(err.message);
      setLocalPreview(null);
    },
  });

  const hapusMutation = useMutation({
    mutationFn: hapusGambar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["struktur-organisasi"] });
      setLocalPreview(null);
      setConfirmHapus(false);
      toast.success("Gambar berhasil dihapus");
    },
    onError: (err: Error) => {
      toast.error(err.message);
      setConfirmHapus(false);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input agar bisa pilih file yang sama lagi
    e.target.value = "";

    // Validasi client-side
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file melebihi 5MB.");
      return;
    }

    // Preview lokal segera
    const localUrl = URL.createObjectURL(file);
    setLocalPreview(localUrl);

    // Upload ke server
    uploadMutation.mutate(file);
  };

  const isUploading = uploadMutation.isPending;
  const isDeleting = hapusMutation.isPending;
  const isBusy = isUploading || isDeleting;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Struktur Organisasi</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola gambar statis struktur organisasi Fakultas Teknik UWKS
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Status Bar */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentImage ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">
                  Gambar aktif tersimpan
                </span>
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  Belum ada gambar — upload gambar pertama kali
                </span>
              </>
            )}
          </div>

          {/* Tombol aksi */}
          <div className="flex items-center gap-2">
            <Button
              id="btn-ganti-gambar"
              variant={currentImage ? "outline" : "default"}
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : currentImage ? (
                <RefreshCw className="w-4 h-4 mr-2" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {isUploading
                ? "Mengunggah..."
                : currentImage
                ? "Ganti Gambar"
                : "Upload Gambar"}
            </Button>

            {currentImage && (
              <Button
                id="btn-hapus-gambar"
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={() => setConfirmHapus(true)}
                disabled={isBusy}
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Hapus Gambar
              </Button>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Preview Area */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-64 text-red-500 text-sm">
              Gagal memuat data. Refresh halaman dan coba lagi.
            </div>
          ) : currentImage ? (
            <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              {/* Overlay uploading */}
              {isUploading && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <p className="text-sm font-medium text-gray-600">
                    Mengunggah gambar baru...
                  </p>
                </div>
              )}
              <Image
                src={currentImage}
                alt="Struktur Organisasi Fakultas Teknik UWKS"
                width={1200}
                height={800}
                className="w-full h-auto object-contain"
                unoptimized
                priority
              />
            </div>
          ) : (
            /* Drop Zone / Kosong */
            <button
              type="button"
              className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
            >
              <ImageIcon className="w-12 h-12" />
              <div className="text-center">
                <p className="text-sm font-medium">
                  Klik untuk upload gambar struktur organisasi
                </p>
                <p className="text-xs mt-1">JPG, PNG, WebP • Maks 5MB</p>
              </div>
            </button>
          )}
        </div>

        {/* Info footer */}
        {data?.data?.updatedAt && currentImage && !isUploading && (
          <div className="px-6 pb-4 text-xs text-gray-400">
            Terakhir diperbarui:{" "}
            {new Date(data.data.updatedAt).toLocaleString("id-ID", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
        <strong>Catatan:</strong> Tabel <code>struktur_organisasi</code> hanya
        menyimpan 1 baris. Setiap kali Anda mengunggah gambar baru, gambar lama
        di database akan <strong>digantikan</strong> (bukan ditambah baris baru).
        File gambar lama di server tetap tersimpan di folder{" "}
        <code>public/uploads/</code>.
      </div>

      {/* Confirm Hapus */}
      <AlertDialog open={confirmHapus} onOpenChange={setConfirmHapus}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Gambar?</AlertDialogTitle>
            <AlertDialogDescription>
              Gambar struktur organisasi akan dihapus dari tampilan. Field{" "}
              <code>image_url</code> di database akan dikosongkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => hapusMutation.mutate()}
              disabled={isDeleting}
            >
              {isDeleting && (
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
