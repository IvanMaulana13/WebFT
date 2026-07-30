"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { prestasiSchema, type PrestasiInput } from "@/lib/validations";
import type { Prestasi } from "@/lib/db/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { ImageUpload } from "./image-upload";

const CURRENT_YEAR = new Date().getFullYear();

interface PrestasiFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prestasi?: Prestasi;
}

export function PrestasiFormDialog({ open, onOpenChange, prestasi }: PrestasiFormDialogProps) {
  const isEdit = !!prestasi;
  const queryClient = useQueryClient();

  const form = useForm<PrestasiInput>({
    resolver: zodResolver(prestasiSchema),
    defaultValues: {
      title: "",
      achieverName: "",
      level: "nasional",
      year: CURRENT_YEAR,
      imageUrl: "",
      description: "",
    },
  });

  // Reset form when dialog opens/closes or prestasi changes
  useEffect(() => {
    if (open) {
      if (isEdit && prestasi) {
        form.reset({
          title: prestasi.title,
          achieverName: prestasi.achieverName,
          level: prestasi.level,
          year: prestasi.year,
          imageUrl: prestasi.imageUrl ?? "",
          description: prestasi.description ?? "",
        });
      } else {
        form.reset({
          title: "",
          achieverName: "",
          level: "nasional",
          year: CURRENT_YEAR,
          imageUrl: "",
          description: "",
        });
      }
    }
  }, [open, isEdit, prestasi, form]);

  const mutation = useMutation({
    mutationFn: async (data: PrestasiInput) => {
      const url = isEdit ? `/api/prestasi/${prestasi!.id}` : "/api/prestasi";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Terjadi kesalahan");
      }
      return json;
    },
    onSuccess: () => {
      toast.success(isEdit ? "Prestasi berhasil diperbarui" : "Prestasi berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["prestasi"] });
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Terjadi kesalahan");
    },
  });

  const onSubmit = (data: PrestasiInput) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Prestasi" : "Tambah Prestasi Baru"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-1">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Judul Prestasi <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="cth: Juara 1 Olimpiade Matematika"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Achiever Name */}
            <FormField
              control={form.control}
              name="achieverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nama Peraih <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="cth: Ahmad Fauzi"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Level & Year row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tingkat <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={mutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tingkat" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nasional">Nasional</SelectItem>
                        <SelectItem value="internasional">Internasional</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tahun <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={String(CURRENT_YEAR)}
                        min={1000}
                        max={CURRENT_YEAR}
                        disabled={mutation.isPending}
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value;
                          // Pass as number; empty => NaN => Zod will catch
                          field.onChange(val === "" ? "" : parseInt(val, 10));
                        }}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto / Sertifikat</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Keterangan tambahan tentang prestasi ini..."
                      rows={3}
                      disabled={mutation.isPending}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
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
                {isEdit ? "Simpan Perubahan" : "Tambah Prestasi"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
