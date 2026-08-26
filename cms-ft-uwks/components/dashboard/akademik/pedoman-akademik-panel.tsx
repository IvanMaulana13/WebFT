"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { FileText, Upload, Trash2, BookOpen, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

interface PedomanRecord {
  id: number;
  fileUrl: string | null;
  updatedAt: string;
  updatedByName: string | null;
}

export function PedomanAkademikPanel() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const { data, isLoading } = useQuery<{ data: PedomanRecord | null }>({
    queryKey: ["akademik", "pedoman"],
    queryFn: async () => {
      const res = await fetch("/api/akademik/pedoman");
      if (!res.ok) throw new Error("Gagal mengambil data");
      return res.json();
    },
  });

  const record = data?.data;

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/akademik/pedoman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Gagal menyimpan");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["akademik", "pedoman"] });
      setDialogOpen(false);
      toast.success("Pedoman akademik berhasil disimpan");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/akademik/pedoman", { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Gagal menghapus");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["akademik", "pedoman"] });
      setDeleteDialogOpen(false);
      toast.success("Pedoman akademik berhasil dihapus");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const openDialog = () => {
    setFileUrl(record?.fileUrl ?? "");
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Memuat data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {record?.fileUrl ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {record.fileUrl.split("/").pop()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Terakhir diperbarui:{" "}
                  {format(new Date(record.updatedAt), "d MMMM yyyy, HH:mm", { locale: idLocale })}
                  {record.updatedByName ? ` oleh ${record.updatedByName}` : ""}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <a
                href={record.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Lihat File
              </a>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={openDialog}>
                <Upload className="w-3.5 h-3.5" />
                Ganti File
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-gray-400" />
            </div>
            <p className="font-medium text-gray-700">Belum ada pedoman akademik</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">
              Upload file PDF pedoman akademik untuk ditampilkan.
            </p>
            <Button onClick={openDialog} className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Pedoman
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          Hanya satu file pedoman akademik yang aktif. Mengunggah file baru akan
          <strong> menggantikan</strong> file yang sedang aktif.
        </p>
      </div>

      {/* Upload Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {record?.fileUrl ? "Ganti File Pedoman Akademik" : "Upload Pedoman Akademik"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>File Pedoman (PDF)</Label>
              <DocumentUpload
                value={fileUrl}
                onChange={(url) => setFileUrl(url)}
                onClear={() => setFileUrl("")}
                label="Klik untuk upload PDF pedoman"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={!fileUrl || saveMutation.isPending}
            >
              {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pedoman Akademik?</AlertDialogTitle>
            <AlertDialogDescription>
              File pedoman akademik akan dihapus. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteMutation.mutate()}
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
