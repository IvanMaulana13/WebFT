"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { konselingLayananSchema, type KonselingLayananInput } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function KonselingLayananForm() {
  const queryClient = useQueryClient();

  const form = useForm<KonselingLayananInput>({
    resolver: zodResolver(konselingLayananSchema),
    defaultValues: {
      narasi: "",
      offlineAktif: false,
      lokasi: "",
      jamLayananOffline: "",
      onlineAktif: false,
      kontakPenanggungJawab: "",
    },
  });

  const { isLoading } = useQuery({
    queryKey: ["konselingLayanan"],
    queryFn: async () => {
      const res = await fetch("/api/kemahasiswaan/konseling");
      if (!res.ok) throw new Error("Gagal mengambil data layanan");
      const json = await res.json();
      
      const data = json.data;
      if (data) {
        form.reset({
          narasi: data.narasi ?? "",
          offlineAktif: data.offlineAktif,
          lokasi: data.lokasi ?? "",
          jamLayananOffline: data.jamLayananOffline ?? "",
          onlineAktif: data.onlineAktif,
          kontakPenanggungJawab: data.kontakPenanggungJawab ?? "",
        });
      }
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: KonselingLayananInput) => {
      const res = await fetch("/api/kemahasiswaan/konseling", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Terjadi kesalahan");
      return json;
    },
    onSuccess: () => {
      toast.success("Informasi layanan konseling berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["konselingLayanan"] });
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Gagal menyimpan informasi layanan");
    },
  });

  const onSubmit = (data: KonselingLayananInput) => {
    mutation.mutate(data);
  };

  const watchOffline = form.watch("offlineAktif");
  const watchOnline = form.watch("onlineAktif");

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-1">Informasi Layanan Konseling</h2>
      <p className="text-sm text-gray-500 mb-6">Kelola narasi dan status layanan konseling mahasiswa.</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="narasi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Narasi Singkat (Opsional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Contoh: Fakultas Teknik menyediakan layanan konseling untuk mahasiswa yang membutuhkan bantuan psikologis..."
                    rows={3}
                    disabled={mutation.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            {/* OFFLINE */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="offlineAktif"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-gray-50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Layanan Tatap Muka (Offline)</FormLabel>
                      <FormDescription>Aktifkan jika melayani konseling langsung di kampus.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} disabled={mutation.isPending} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {watchOffline && (
                <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                  <FormField
                    control={form.control}
                    name="lokasi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lokasi Ruangan <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="cth: Ruang Konseling Gd. Dekanat Lt. 1" disabled={mutation.isPending} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jamLayananOffline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jam Layanan <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="cth: Senin - Jumat, 09.00 - 15.00 WIB" disabled={mutation.isPending} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* ONLINE */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="onlineAktif"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-gray-50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Layanan Daring (Online)</FormLabel>
                      <FormDescription>Mengaktifkan fitur penjadwalan via web.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} disabled={mutation.isPending} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {watchOnline && (
                <div className="space-y-4 pl-4 border-l-2 border-green-200">
                  <FormField
                    control={form.control}
                    name="kontakPenanggungJawab"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kontak Penanggung Jawab (WA) <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="cth: 08123456789 (Bpk Budi)" disabled={mutation.isPending} {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Digunakan mahasiswa untuk menghubungi setelah memilih jadwal.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Simpan Informasi Layanan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
