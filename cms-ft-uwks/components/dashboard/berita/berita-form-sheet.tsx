"use client";

import { useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { beritaSchema, type BeritaInput } from "@/lib/validations";
import { generateSlug } from "@/lib/utils/slug";
import type { Berita } from "@/lib/db/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TiptapEditor } from "./tiptap-editor";
import { ThumbnailUpload } from "./thumbnail-upload";

interface BeritaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  berita?: Berita;
}

export function BeritaFormSheet({ open, onOpenChange, berita }: BeritaFormDialogProps) {
  const isEdit = !!berita;
  const queryClient = useQueryClient();
  const slugManuallyEdited = useRef(false);

  const form = useForm<BeritaInput>({
    resolver: zodResolver(beritaSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      thumbnailUrl: "",
      category: "berita",
      status: "draft",
      publishedAt: "",
    },
  });

  const watchTitle = form.watch("title");
  const watchStatus = form.watch("status");

  // Auto-generate slug from title (only if not manually edited)
  useEffect(() => {
    if (!slugManuallyEdited.current && watchTitle && !isEdit) {
      form.setValue("slug", generateSlug(watchTitle), { shouldValidate: false });
    }
  }, [watchTitle, isEdit, form]);

  // Reset form when dialog opens/closes or berita changes
  useEffect(() => {
    if (open) {
      slugManuallyEdited.current = false;
      if (isEdit && berita) {
        const publishedAtStr = berita.publishedAt
          ? new Date(berita.publishedAt).toISOString().slice(0, 10)
          : "";
        form.reset({
          title: berita.title,
          slug: berita.slug,
          content: berita.content,
          thumbnailUrl: berita.thumbnailUrl ?? "",
          category: berita.category ?? "",
          status: berita.status,
          publishedAt: publishedAtStr,
        });
        slugManuallyEdited.current = true;
      } else {
        form.reset({
          title: "",
          slug: "",
          content: "",
          thumbnailUrl: "",
          category: "berita",
          status: "draft",
          publishedAt: "",
        });
      }
    }
  }, [open, isEdit, berita, form]);

  const mutation = useMutation({
    mutationFn: async (data: BeritaInput) => {
      const url = isEdit ? `/api/berita/${berita!.id}` : "/api/berita";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          throw { field: "slug", message: json.error };
        }
        throw new Error(json.error ?? "Terjadi kesalahan");
      }
      return json;
    },
    onSuccess: () => {
      toast.success(isEdit ? "Berita berhasil diperbarui" : "Berita berhasil dibuat");
      queryClient.invalidateQueries({ queryKey: ["berita"] });
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      const e = err as { field?: string; message?: string } | Error;
      if ("field" in e && e.field === "slug") {
        form.setError("slug", { message: e.message });
        toast.error(e.message);
      } else {
        toast.error((e as Error).message ?? "Terjadi kesalahan");
      }
    },
  });

  const onSubmit = (data: BeritaInput) => {
    mutation.mutate(data);
  };

  const handleSlugChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      slugManuallyEdited.current = true;
      form.setValue("slug", e.target.value, { shouldValidate: true });
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Berita" : "Tambah Berita Baru"}</DialogTitle>
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
                    Judul <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan judul berita"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Slug <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center rounded-md border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
                      <span className="px-3 py-2 text-sm text-gray-500 bg-gray-50 border-r border-gray-200 whitespace-nowrap select-none">
                        /berita/
                      </span>
                      <input
                        className="flex-1 px-3 py-2 text-sm font-mono outline-none bg-white disabled:opacity-60"
                        placeholder="slug-berita"
                        disabled={mutation.isPending}
                        {...field}
                        onChange={handleSlugChange}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                    Auto-generate dari judul. Bisa diedit manual.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category & Status row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori <span className="text-red-500">*</span></FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={mutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="berita">Berita</SelectItem>
                        <SelectItem value="kegiatan">Kegiatan</SelectItem>
                        <SelectItem value="beasiswa">Beasiswa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status <span className="text-red-500">*</span>
                    </FormLabel>
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
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Published At — only show if published */}
            {watchStatus === "published" && (
              <FormField
                control={form.control}
                name="publishedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Terbit</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={mutation.isPending} {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Kosongkan untuk menggunakan waktu saat ini.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Thumbnail */}
            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <ThumbnailUpload
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      disabled={mutation.isPending}
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
                  <FormLabel>
                    Konten <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <TiptapEditor
                      value={field.value}
                      onChange={field.onChange}
                      disabled={mutation.isPending}
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
                {isEdit ? "Simpan Perubahan" : "Buat Berita"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
