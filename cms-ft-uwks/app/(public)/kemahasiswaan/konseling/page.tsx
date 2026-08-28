import type { Metadata } from "next";
import { fetchPublicKonseling, fetchPublicJadwalKonseling } from "@/lib/public-api";
import KonselingClient from "@/components/public/kemahasiswaan/konseling-client";
import type { JadwalKonseling } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Layanan Konseling Mahasiswa",
  description: "Layanan Konseling dan Pendampingan Mahasiswa Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

export const revalidate = 60;

export default async function KonselingPage() {
  const [layanan, initialJadwal] = await Promise.all([
    fetchPublicKonseling(),
    fetchPublicJadwalKonseling(),
  ]);

  return (
    <div className="space-y-8">
      {/* ── Title & Decorative Bar ── */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#002347] font-sans uppercase tracking-tight">
          Layanan Konseling Mahasiswa
        </h2>
        <div className="h-1 w-20 bg-[#E5B80B] rounded-full" />
      </div>

      {/* ── Static Narrative Paragraph ── */}
      <div className="bg-gradient-to-r from-amber-50/70 via-slate-50 to-blue-50/70 p-5 sm:p-6 rounded-xl border border-amber-200/60 shadow-2xs">
        <p className="text-slate-700 text-sm md:text-base leading-relaxed text-justify font-medium">
          Layanan konseling pribadi hadir sebagai ruang aman yang siap mendengarkan setiap keluh kesah, kecemasan, dan tantangan emosional yang sedang kamu alami. Di sini, kamu bisa berbagi cerita tanpa takut dihakimi.
        </p>
        {layanan?.narasi && (
          <p className="text-slate-600 text-xs sm:text-sm mt-3 pt-3 border-t border-slate-200/60 leading-relaxed whitespace-pre-line">
            {layanan.narasi}
          </p>
        )}
      </div>

      {/* ── Client Tabs & Booking ── */}
      <KonselingClient
        layanan={layanan}
        initialJadwal={(initialJadwal as JadwalKonseling[]) || []}
      />
    </div>
  );
}
