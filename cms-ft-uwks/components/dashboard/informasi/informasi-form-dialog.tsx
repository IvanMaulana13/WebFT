"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { informasiSchema, type InformasiInput } from "@/lib/validations";
import type { Informasi } from "@/lib/db/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface InformasiFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Jika ada → mode edit, jika undefined → mode create */
  informasi?: Informasi;
}

export function InformasiFormDialog({
  open,
  onOpenChange,
  informasi,
}: InformasiFormDialogProps) {
  const isEdit = !!informasi;
  const queryClient = useQueryClient();

  const form = useForm<InformasiInput>({
    resolver: zodResolver(informasiSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      status: "draft",
    },
  });

  // Pre-fill form saat edit
  useEffect(() => {
    if (open) {
      if (isEdit && informasi) {
        form.reset({
          title: informasi.title,
          content: informasi.content,
          category: informasi.category ?? "",
          status: informasi.status,
        });
      } else {
        form.reset({ title: "", content: "", category: "", status: "draft" });
      }
    }
  }, [open, isEdit, informasi, form]);

  const mutation = useMutation({
    mutationFn: async (data: InformasiInput) => {
      const url = isEdit
        ? `/api/informasi/${informasi!.id}`
        : "/api/informasi";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Terjadi kesalahan");
      return json;
    },
    onSuccess: () => {
      toast.success(isEdit ? "Informasi berhasil diperbarui" : "Informasi berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["informasi"] });
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (data: InformasiInput) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Informasi" : "Tambah Informasi"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan judul informasi"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konten <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan isi informasi..."
                      className="min-h-[120px] resize-y"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="cth: Pengumuman, Akademik, Umum"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={mutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
              >
                Batal
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEdit ? "Simpan Perubahan" : "Tambah Informasi"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
