"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { lombaSchema, type LombaInput } from "@/lib/validations";
import type { Lomba } from "@/lib/db/schema";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { LogoUpload } from "@/components/dashboard/kemitraan/logo-upload";

interface LombaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lomba?: Lomba;
}

export function LombaFormDialog({
  open,
  onOpenChange,
  lomba,
}: LombaFormDialogProps) {
  const isEdit = !!lomba;
  const queryClient = useQueryClient();

  const form = useForm<LombaInput>({
    resolver: zodResolver(lombaSchema),
    defaultValues: {
      namaLomba: "",
      tingkat: "nasional",
      tanggalMulaiPendaftaran: "",
      tanggalSelesaiPendaftaran: "",
      linkPendaftaran: "",
      posterUrl: "",
      deskripsi: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (isEdit && lomba) {
        // Handle date string conversions
        const startStr = lomba.tanggalMulaiPendaftaran ? format(lomba.tanggalMulaiPendaftaran, "yyyy-MM-dd") : "";
        
        const endStr = lomba.tanggalSelesaiPendaftaran ? format(lomba.tanggalSelesaiPendaftaran, "yyyy-MM-dd") : "";

        form.reset({
          namaLomba: lomba.namaLomba,
          tingkat: lomba.tingkat as "nasional" | "internasional",
          tanggalMulaiPendaftaran: startStr,
          tanggalSelesaiPendaftaran: endStr,
          linkPendaftaran: lomba.linkPendaftaran,
          posterUrl: lomba.posterUrl ?? "",
          deskripsi: lomba.deskripsi,
        });
      } else {
        form.reset({
          namaLomba: "",
          tingkat: "nasional",
          tanggalMulaiPendaftaran: "",
          tanggalSelesaiPendaftaran: "",
          linkPendaftaran: "",
          posterUrl: "",
          deskripsi: "",
        });
      }
    }
  }, [open, isEdit, lomba, form]);

  const mutation = useMutation({
    mutationFn: async (data: LombaInput) => {
      const url = isEdit ? `/api/kemahasiswaan/lomba/${lomba!.id}` : "/api/kemahasiswaan/lomba";
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
      toast.success(isEdit ? "Data lomba berhasil diperbarui" : "Data lomba berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["lomba"] });
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Terjadi kesalahan");
    },
  });

  const onSubmit = (data: LombaInput) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Lomba" : "Tambah Informasi Lomba"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-1">
            <FormField
              control={form.control}
              name="posterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poster / Gambar Lomba</FormLabel>
                  <FormControl>
                    <LogoUpload
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="namaLomba"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lomba <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="cth: Lomba Bisnis Plan Nasional" disabled={mutation.isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tingkat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tingkat Lomba <span className="text-red-500">*</span></FormLabel>
                  <Select
                    disabled={mutation.isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tanggalMulaiPendaftaran"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tgl Mulai Pendaftaran <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" disabled={mutation.isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tanggalSelesaiPendaftaran"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tgl Selesai Pendaftaran <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" disabled={mutation.isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="linkPendaftaran"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Pendaftaran / Info <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://" disabled={mutation.isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Singkat <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea placeholder="Keterangan lomba..." rows={3} disabled={mutation.isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                Batal
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEdit ? "Simpan Perubahan" : "Tambah Lomba"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
