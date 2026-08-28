"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  HeartHandshake,
  MessageCircle,
  MapPin,
  Clock,
  Calendar,
  Phone,
  Send,
  Loader2,
  CheckCircle2,
  CalendarDays,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { KonselingLayanan, JadwalKonseling } from "@/lib/db/schema";

interface KonselingClientProps {
  layanan: KonselingLayanan | null;
  initialJadwal: JadwalKonseling[];
}

export default function KonselingClient({
  layanan,
  initialJadwal,
}: KonselingClientProps) {
  const queryClient = useQueryClient();
  const [selectedJadwal, setSelectedJadwal] = useState<JadwalKonseling | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    nama_pemesan: "",
    nim_pemesan: "",
    keperluan: "",
  });

  // Query available slots
  const { data: jadwalList = initialJadwal, isLoading: isLoadingJadwal, refetch } = useQuery<JadwalKonseling[]>({
    queryKey: ["publicJadwalKonseling"],
    queryFn: async () => {
      const res = await fetch("/api/kemahasiswaan/jadwal-konseling?public=true");
      if (!res.ok) throw new Error("Gagal memuat jadwal");
      const json = await res.json();
      return json.data || [];
    },
    initialData: initialJadwal,
  });

  // Mutation for booking
  const bookingMutation = useMutation({
    mutationFn: async ({
      jadwalId,
      data,
    }: {
      jadwalId: number;
      data: typeof bookingForm;
    }) => {
      const res = await fetch(
        `/api/kemahasiswaan/jadwal-konseling/${jadwalId}/booking`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal mengajukan janji temu");
      }
      return json;
    },
    onSuccess: (res) => {
      toast.success(
        res.message ||
          "Permintaan janji temu berhasil dikirim, silakan konfirmasi ulang ke kontak penanggung jawab."
      );
      setDialogOpen(false);
      setSelectedJadwal(null);
      setBookingForm({ nama_pemesan: "", nim_pemesan: "", keperluan: "" });
      refetch();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Terjadi kesalahan saat memproses booking");
      refetch();
    },
  });

  const handleOpenBooking = (jadwal: JadwalKonseling) => {
    setSelectedJadwal(jadwal);
    setBookingForm({ nama_pemesan: "", nim_pemesan: "", keperluan: "" });
    setDialogOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJadwal) return;
    if (!bookingForm.nama_pemesan.trim() || !bookingForm.nim_pemesan.trim() || !bookingForm.keperluan.trim()) {
      toast.error("Semua field wajib diisi");
      return;
    }

    bookingMutation.mutate({
      jadwalId: selectedJadwal.id,
      data: bookingForm,
    });
  };

  const formatDate = (dateVal: Date | string) => {
    try {
      const d = new Date(dateVal);
      return format(d, "EEEE, d MMMM yyyy", { locale: idLocale });
    } catch {
      return String(dateVal);
    }
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="online" className="w-full">
        {/* ── Tabs List ── */}
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-slate-100 p-1 rounded-xl mb-6">
          <TabsTrigger
            value="online"
            className="rounded-lg text-xs sm:text-sm font-bold data-[state=active]:bg-[#002C5F] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            Konseling Online (Daring)
          </TabsTrigger>
          <TabsTrigger
            value="offline"
            className="rounded-lg text-xs sm:text-sm font-bold data-[state=active]:bg-[#002C5F] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            Konseling Offline (Tatap Muka)
          </TabsTrigger>
        </TabsList>

        {/* ── TAB 1: KONSELING ONLINE ── */}
        <TabsContent value="online" className="space-y-6 focus:outline-none">
          {/* Penanggung Jawab Banner */}
          <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 rounded-xl p-5 sm:p-6 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#002C5F] text-[#E5B80B] flex items-center justify-center shrink-0 shadow-xs">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Kontak Penanggung Jawab
                </p>
                <h4 className="text-base sm:text-lg font-bold text-[#002347]">
                  {layanan?.kontakPenanggungJawab || "Bagian Kemahasiswaan FT UWKS"}
                </h4>
              </div>
            </div>

            <div className="text-xs text-slate-500 bg-white/80 px-3.5 py-2 rounded-lg border border-slate-200/80">
              Pilih slot jadwal di bawah untuk mengajukan sesi konseling
            </div>
          </div>

          {/* Section: Jadwal Tersedia */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-[#002347] flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#E5B80B]" />
                <span>Slot Jadwal Konseling Tersedia</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {jadwalList.length} Slot Aktif
              </span>
            </div>

            {isLoadingJadwal ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#002C5F]" />
                <p className="text-xs text-slate-500 mt-2">Memuat jadwal konseling...</p>
              </div>
            ) : jadwalList.length === 0 ? (
              <div className="bg-[#F8F9FA] rounded-xl p-10 text-center border border-slate-200">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-7 h-7" />
                </div>
                <p className="text-slate-600 font-semibold mb-1 text-sm">
                  Belum ada jadwal konseling online yang tersedia saat ini.
                </p>
                <p className="text-xs text-slate-400">
                  Silakan hubungi kontak penanggung jawab di atas secara langsung untuk konsultasi.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jadwalList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-[#002347]/30 transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#002347]">
                        <Calendar className="w-4 h-4 text-[#E5B80B] shrink-0" />
                        <span>{formatDate(item.tanggal)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-600 pl-6">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-800">{item.jam}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Tersedia
                      </span>

                      <Button
                        size="sm"
                        onClick={() => handleOpenBooking(item)}
                        className="bg-[#002C5F] hover:bg-[#002347] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-2xs"
                      >
                        Ajukan Janji Temu
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── TAB 2: KONSELING OFFLINE ── */}
        <TabsContent value="offline" className="space-y-6 focus:outline-none">
          <div className="bg-[#F8F9FA] rounded-xl p-6 sm:p-8 border border-slate-200 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#002347]">
                Layanan Konseling Tatap Muka (Offline)
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Bagi mahasiswa yang ingin berkonsultasi secara langsung, Anda dapat mengunjungi ruangan konseling pada jam operasional layanan di bawah ini.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Lokasi Ruangan */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#002C5F] flex items-center justify-center shrink-0 border border-blue-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Lokasi Ruangan
                  </h4>
                  <p className="text-sm sm:text-base font-bold text-[#002347] mt-0.5">
                    {layanan?.lokasi || "Ruang Konseling & Kemahasiswaan Gd. Dekanat Lt. 1"}
                  </p>
                </div>
              </div>

              {/* Jam Layanan */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#E5B80B] flex items-center justify-center shrink-0 border border-amber-100">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Jam Layanan
                  </h4>
                  <p className="text-sm sm:text-base font-bold text-[#002347] mt-0.5">
                    {layanan?.jamLayananOffline || "Senin - Jumat, 09.00 - 15.00 WIB"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 text-xs text-slate-700 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#002C5F] shrink-0 mt-0.5" />
              <span>
                Disarankan membuat konfirmasi terlebih dahulu melalui kontak penanggung jawab sebelum datang langsung untuk memastikan ketersediaan konselor.
              </span>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Dialog Booking Janji Temu ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#002347]">
              Pengajuan Janji Temu Konseling
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {selectedJadwal && (
                <span>
                  Sesi pada <strong>{formatDate(selectedJadwal.tanggal)}</strong> pukul{" "}
                  <strong>{selectedJadwal.jam}</strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBookingSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="nama" className="text-xs font-bold text-slate-700">
                Nama Lengkap <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama"
                placeholder="cth: Ahmad Fauzi"
                value={bookingForm.nama_pemesan}
                onChange={(e) =>
                  setBookingForm({ ...bookingForm, nama_pemesan: e.target.value })
                }
                disabled={bookingMutation.isPending}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nim" className="text-xs font-bold text-slate-700">
                NIM <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nim"
                placeholder="cth: 22041010001"
                value={bookingForm.nim_pemesan}
                onChange={(e) =>
                  setBookingForm({ ...bookingForm, nim_pemesan: e.target.value })
                }
                disabled={bookingMutation.isPending}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="keperluan" className="text-xs font-bold text-slate-700">
                Keperluan / Topik Singkat <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="keperluan"
                placeholder="Ceritakan gambaran singkat kendala akademik / pribadi..."
                rows={3}
                value={bookingForm.keperluan}
                onChange={(e) =>
                  setBookingForm({ ...bookingForm, keperluan: e.target.value })
                }
                disabled={bookingMutation.isPending}
                required
              />
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={bookingMutation.isPending}
                className="text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={bookingMutation.isPending}
                className="bg-[#002C5F] hover:bg-[#002347] text-white text-xs font-bold"
              >
                {bookingMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Kirim Permintaan
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
