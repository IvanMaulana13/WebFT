"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Loader2, Trash2, Globe, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { format, isAfter, isSameDay } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { cn } from "@/lib/utils";
import type { Lomba } from "@/lib/db/schema";
import { LombaFormDialog } from "./lomba-form-dialog";
import { Badge } from "@/components/ui/badge";

export function LombaTable() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedLomba, setSelectedLomba] = useState<Lomba | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery<{ data: Lomba[] }>({
    queryKey: ["lomba"],
    queryFn: async () => {
      const res = await fetch(`/api/kemahasiswaan/lomba`);
      if (!res.ok) throw new Error("Gagal mengambil data");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/kemahasiswaan/lomba/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Data lomba berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["lomba"] });
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Terjadi kesalahan");
    },
  });

  const formatDateStr = (dateVal: string | Date) => {
    const d = new Date(dateVal);
    return format(d, "dd MMM yyyy", { locale: idLocale });
  };

  const calculateStatus = (endDateVal: string | Date) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const end = new Date(endDateVal);
    end.setHours(0,0,0,0);
    
    // Status is 'dibuka' if today is before or equal to endDate
    if (isAfter(end, today) || isSameDay(end, today)) {
      return { label: "Dibuka", active: true };
    }
    return { label: "Ditutup", active: false };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Gagal memuat data lomba.</div>;
  }

  const lombaList = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Daftar Informasi Lomba</h2>
        <Button onClick={() => { setSelectedLomba(undefined); setFormOpen(true); }}>
          Tambah Lomba
        </Button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Lomba</TableHead>
              <TableHead>Tingkat</TableHead>
              <TableHead>Pendaftaran</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lombaList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                  Belum ada data lomba
                </TableCell>
              </TableRow>
            ) : (
              lombaList.map((item) => {
                const statusInfo = calculateStatus(item.tanggalSelesaiPendaftaran);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border">
                          {item.posterUrl ? (
                            <Image
                              src={item.posterUrl}
                              alt={item.namaLomba}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.namaLomba}</div>
                          <a href={item.linkPendaftaran} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                            <Globe className="w-3 h-3" /> Link Info
                          </a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={item.tingkat === 'internasional' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}>
                        {item.tingkat === 'internasional' ? 'Internasional' : 'Nasional'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>Mulai: {formatDateStr(item.tanggalMulaiPendaftaran)}</div>
                      <div className="text-gray-500">Tutup: {formatDateStr(item.tanggalSelesaiPendaftaran)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.active ? "default" : "secondary"} className={cn(statusInfo.active ? "bg-green-100 text-green-700 hover:bg-green-100" : "")}>
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedLomba(item);
                          setFormOpen(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <LombaFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setSelectedLomba(undefined);
        }}
        lomba={selectedLomba}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Lomba?</AlertDialogTitle>
            <AlertDialogDescription>Data lomba ini akan dihapus dari sistem.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (deleteId) deleteMutation.mutate(deleteId);
              }}
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
