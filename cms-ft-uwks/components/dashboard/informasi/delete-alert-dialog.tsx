"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Informasi } from "@/lib/db/schema";
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

interface DeleteAlertDialogProps {
  informasi: Informasi | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAlertDialog({ informasi, onOpenChange }: DeleteAlertDialogProps) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!informasi) return;
      const res = await fetch(`/api/informasi/${informasi.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal menghapus");
      return json;
    },
    onMutate: () => setIsDeleting(true),
    onSuccess: () => {
      toast.success(`Informasi "${informasi?.title}" berhasil dihapus`);
      queryClient.invalidateQueries({ queryKey: ["informasi"] });
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
    onSettled: () => setIsDeleting(false),
  });

  return (
    <AlertDialog open={!!informasi} onOpenChange={(open) => !open && onOpenChange(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Informasi?</AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini akan menghapus informasi{" "}
            <span className="font-semibold text-gray-900">
              &quot;{informasi?.title}&quot;
            </span>{" "}
            secara permanen. Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutation.mutate()}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Ya, Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
