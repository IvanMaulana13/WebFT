"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Globe, Link2, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import type { Ormawa } from "@/lib/db/schema";
import { OrmawaFormDialog } from "./ormawa-form-dialog";

interface OrmawaGridProps {
  searchQuery: string;
}

export function OrmawaGrid({ searchQuery }: OrmawaGridProps) {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedOrmawa, setSelectedOrmawa] = useState<Ormawa | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery<{ data: Ormawa[] }>({
    queryKey: ["ormawa", searchQuery],
    queryFn: async () => {
      const res = await fetch(`/api/kemahasiswaan/ormawa?search=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error("Gagal mengambil data");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/kemahasiswaan/ormawa/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Ormawa berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["ormawa"] });
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Terjadi kesalahan");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Gagal memuat data organisasi kemahasiswaan.
      </div>
    );
  }

  const ormawaList = data?.data ?? [];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ormawaList.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 flex-1 flex flex-col items-center text-center">
              <div className="w-24 h-24 relative mb-4 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                {item.logoUrl ? (
                  <Image src={item.logoUrl} alt={item.nama} fill className="object-contain p-2" unoptimized />
                ) : (
                  <span className="text-gray-400 text-3xl font-bold">{item.nama.charAt(0)}</span>
                )}
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.nama}</h3>
              <p className="text-sm text-gray-500 line-clamp-3 mb-4">{item.deskripsi}</p>
              
              <div className="mt-auto flex gap-2 justify-center">
                {item.websiteUrl && (
                  <a href={item.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors">
                    <Globe className="w-3.5 h-3.5" /> Website
                  </a>
                )}
                {item.instagramUrl && (
                  <a href={item.instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 text-pink-600 text-xs font-medium hover:bg-pink-100 transition-colors">
                    <Link2 className="w-3.5 h-3.5" /> Instagram
                  </a>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 border-t flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-blue-600"
                onClick={() => {
                  setSelectedOrmawa(item);
                  setFormOpen(true);
                }}
              >
                <Edit2 className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-red-600"
                onClick={() => setDeleteId(item.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Hapus
              </Button>
            </div>
          </div>
        ))}
        {ormawaList.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            Belum ada data organisasi kemahasiswaan.
          </div>
        )}
      </div>

      <OrmawaFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setSelectedOrmawa(undefined);
        }}
        ormawa={selectedOrmawa}
      />

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Data ormawa yang dihapus tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (deleteId) deleteMutation.mutate(deleteId);
              }}
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
