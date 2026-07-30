"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { kemitraanSchema, type KemitraanInput } from "@/lib/validations";
import type { Kemitraan } from "@/lib/db/schema";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { LogoUpload } from "./logo-upload";

interface KemitraanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kemitraan?: Kemitraan;
}

export function KemitraanFormDialog({
  open,
  onOpenChange,
  kemitraan,
}: KemitraanFormDialogProps) {
  const isEdit = !!kemitraan;
  const queryClient = useQueryClient();

  // Date picker local state
  const [calendarOpen, setCalendarOpen] = useState(false);

  const form = useForm<KemitraanInput>({
    resolver: zodResolver(kemitraanSchema),
    defaultValues: {
      partnerName: "",
      logoUrl: "",
      partnershipType: "",
      mouDate: "",
      description: "",
      websiteUrl: "",
    },
  });

  // Reset form when dialog opens / kemitraan changes
  useEffect(() => {
    if (open) {
      if (isEdit && kemitraan) {
        // mouDate from DB may be a Date object or a YYYY-MM-DD string
        const rawMouDate = kemitraan.mouDate;
        let mouDateStr = "";
        if (rawMouDate) {
          if (rawMouDate instanceof Date) {
            mouDateStr = format(rawMouDate, "yyyy-MM-dd");
          } else {
            // Already a string like "2024-01-15" or ISO string
            mouDateStr = String(rawMouDate).slice(0, 10);
          }
        }
        form.reset({
          partnerName: kemitraan.partnerName,
          logoUrl: kemitraan.logoUrl ?? "",
          partnershipType: kemitraan.partnershipType ?? "",
          mouDate: mouDateStr,
          description: kemitraan.description ?? "",
          websiteUrl: kemitraan.websiteUrl ?? "",
        });
      } else {
        form.reset({
          partnerName: "",
          logoUrl: "",
          partnershipType: "",
          mouDate: "",
          description: "",
          websiteUrl: "",
        });
      }
    }
  }, [open, isEdit, kemitraan, form]);

  const mutation = useMutation({
    mutationFn: async (data: KemitraanInput) => {
      const url = isEdit ? `/api/kemitraan/${kemitraan!.id}` : "/api/kemitraan";
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
      toast.success(isEdit ? "Kemitraan berhasil diperbarui" : "Kemitraan berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["kemitraan"] });
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Terjadi kesalahan");
    },
  });

  const onSubmit = (data: KemitraanInput) => {
    mutation.mutate(data);
  };

  // Watch mouDate to show selected date in trigger button
  const mouDateValue = form.watch("mouDate");
  const selectedDate = mouDateValue ? parseISO(mouDateValue) : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Kemitraan" : "Tambah Mitra Baru"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-1">
            {/* Logo Upload */}
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo Mitra</FormLabel>
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

            {/* Partner Name */}
            <FormField
              control={form.control}
              name="partnerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nama Mitra <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="cth: Universitas Indonesia"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Partnership Type */}
            <FormField
              control={form.control}
              name="partnershipType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Kemitraan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="cth: MoU, Penelitian, Industri"
                      disabled={mutation.isPending}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* MoU Date — Calendar + Popover */}
            <FormField
              control={form.control}
              name="mouDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal MoU</FormLabel>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={mutation.isPending}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate
                            ? format(selectedDate, "d MMMM yyyy", { locale: idLocale })
                            : "Pilih tanggal..."}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                          setCalendarOpen(false);
                        }}
                        initialFocus
                      />
                      {selectedDate && (
                        <div className="p-2 border-t">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs text-gray-500"
                            onClick={() => {
                              field.onChange("");
                              setCalendarOpen(false);
                            }}
                          >
                            Hapus tanggal
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="text-xs">
                    Kosongkan jika tanggal MoU belum diketahui.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Website URL */}
            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      disabled={mutation.isPending}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Wajib diawali https:// atau http://, atau biarkan kosong.
                  </FormDescription>
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
                      placeholder="Keterangan tentang kemitraan ini..."
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
                {isEdit ? "Simpan Perubahan" : "Tambah Mitra"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
