"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ormawaSchema, type OrmawaInput } from "@/lib/validations";
import type { Ormawa } from "@/lib/db/schema";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LogoUpload } from "@/components/dashboard/kemitraan/logo-upload"; // reuse logo upload

interface OrmawaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ormawa?: Ormawa;
}

export function OrmawaFormDialog({
  open,
  onOpenChange,
  ormawa,
}: OrmawaFormDialogProps) {
  const isEdit = !!ormawa;
  const queryClient = useQueryClient();

  const form = useForm<OrmawaInput>({
    resolver: zodResolver(ormawaSchema),
    defaultValues: {
      nama: "",
      logoUrl: "",
      deskripsi: "",
      websiteUrl: "",
      instagramUrl: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (isEdit && ormawa) {
        form.reset({
          nama: ormawa.nama,
          logoUrl: ormawa.logoUrl ?? "",
          deskripsi: ormawa.deskripsi ?? "",
          websiteUrl: ormawa.websiteUrl ?? "",
          instagramUrl: ormawa.instagramUrl ?? "",
        });
      } else {
        form.reset({
          nama: "",
          logoUrl: "",
          deskripsi: "",
          websiteUrl: "",
          instagramUrl: "",
        });
      }
    }
  }, [open, isEdit, ormawa, form]);

  const mutation = useMutation({
    mutationFn: async (data: OrmawaInput) => {
      const url = isEdit ? `/api/kemahasiswaan/ormawa/${ormawa!.id}` : "/api/kemahasiswaan/ormawa";
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
      toast.success(isEdit ? "Ormawa berhasil diperbarui" : "Ormawa berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["ormawa"] });
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Terjadi kesalahan");
    },
  });

  const onSubmit = (data: OrmawaInput) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Ormawa" : "Tambah Ormawa Baru"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-1">
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo Ormawa</FormLabel>
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
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Ormawa <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="BEM Fakultas Teknik" disabled={mutation.isPending} {...field} />
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
                  <FormLabel>Deskripsi <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea placeholder="Keterangan ormawa..." rows={3} disabled={mutation.isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://" disabled={mutation.isPending} {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagramUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://instagram.com/..." disabled={mutation.isPending} {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription className="text-xs text-amber-600">
                      Minimal salah satu dari Website atau Instagram wajib diisi.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                Batal
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEdit ? "Simpan Perubahan" : "Tambah Ormawa"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
