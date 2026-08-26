import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchPublicPrestasiById } from "@/lib/public-api";
import {
  Trophy,
  Medal,
  Calendar,
  User,
  ArrowLeft,
  ChevronRight,
  Award,
} from "lucide-react";

export const revalidate = 60;

interface PrestasiDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PrestasiDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) {
    return {
      title: "Prestasi Tidak Ditemukan | Fakultas Teknik UWKS",
      description: "Data prestasi tidak ditemukan.",
    };
  }

  const prestasi = await fetchPublicPrestasiById(numId);

  if (!prestasi) {
    return {
      title: "Prestasi Tidak Ditemukan | Fakultas Teknik UWKS",
      description: "Data prestasi tidak ditemukan.",
    };
  }

  const fallbackDesc = `${prestasi.achieverName} - ${prestasi.title} (Tingkat ${prestasi.level.toUpperCase()}, Tahun ${prestasi.year}). Fakultas Teknik Universitas Wijaya Kusuma Surabaya.`;
  const snippet = prestasi.description
    ? prestasi.description.length > 160
      ? `${prestasi.description.substring(0, 157)}...`
      : prestasi.description
    : fallbackDesc;

  return {
    title: `${prestasi.title} - Prestasi Mahasiswa | Fakultas Teknik UWKS`,
    description: snippet,
    openGraph: {
      title: `${prestasi.title} | Fakultas Teknik UWKS`,
      description: snippet,
      images: prestasi.imageUrl ? [{ url: prestasi.imageUrl }] : undefined,
    },
  };
}

function formatIndonesianDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function PrestasiDetailPage({
  params,
}: PrestasiDetailPageProps) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) {
    notFound();
  }

  const prestasi = await fetchPublicPrestasiById(numId);

  if (!prestasi) {
    notFound();
  }

  const formattedDate = formatIndonesianDate(prestasi.createdAt);

  return (
    <main className="w-full pb-20">
      {/* ── Banner Header / Breadcrumb ── */}
      <section className="relative overflow-hidden bg-[#002347] text-white py-14">
        <div className="absolute inset-0 bg-[#002347]/85 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAW1U5BTsnUUW4XUtR-Xn70Cc3id4UjSRlakVbeVHB8d-hI_QV5Kb_YcQo3KALsBTxfeMNG6lFLR8AiFNg3KqK_olg05tLYuPbP2ZknQ-QunlHgTN4OIZijDE1PsmstusiyI8YkqQZVYcrxOVWWMxTt3NAgqyu-r5-1Otak_bR83GsUxgE9HrcUcsh4S_Nq3hgibKFzp48OoXqYMIo5aq4WxI6HiLGcKrTXp5O5o7btyhtsG7ByGN-AdpJg6_91_HvXIQ')",
          }}
        />
        <div className="relative z-20 max-w-4xl mx-auto px-6 w-full">
          <nav className="flex items-center flex-wrap gap-2 mb-4 text-xs uppercase tracking-wider text-white/80">
            <Link href="/" className="hover:underline hover:text-[#E5B80B] transition-colors">
              BERANDA
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/60" />
            <span className="text-white/80">PRESTASI MAHASISWA</span>
            <ChevronRight className="w-3.5 h-3.5 text-white/60" />
            <span className="text-[#E5B80B] font-bold truncate max-w-[200px] sm:max-w-xs">
              {prestasi.title}
            </span>
          </nav>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-sans text-white leading-tight mt-2">
            {prestasi.title}
          </h1>

          <div className="flex items-center flex-wrap gap-4 mt-6 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#E5B80B]" />
              <span>{formattedDate || `Tahun ${prestasi.year}`}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-[#E5B80B] text-[#002347] text-xs font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Tingkat {prestasi.level}
              </span>
              <span className="bg-white/10 text-white border border-white/20 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Tahun {prestasi.year}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Section ── */}
      <section className="max-w-4xl mx-auto px-6 -mt-6">
        <article className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200">
          
          {/* Foto/Gambar Prestasi Besar */}
          {prestasi.imageUrl ? (
            <div className="relative w-full aspect-video md:aspect-[16/9] rounded-xl overflow-hidden mb-8 border border-slate-100 shadow-inner bg-slate-100">
              <Image
                src={prestasi.imageUrl}
                alt={prestasi.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
          ) : (
            <div className="w-full h-56 md:h-72 bg-gradient-to-br from-amber-50 via-slate-50 to-orange-50 border border-amber-200/60 rounded-xl flex flex-col items-center justify-center text-center p-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-[#E5B80B]/20 flex items-center justify-center text-[#E5B80B] mb-3 shadow-sm">
                <Medal className="w-10 h-10" />
              </div>
              <span className="text-sm font-bold text-[#002347]">
                Prestasi Mahasiswa Fakultas Teknik UWKS
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Tingkat {prestasi.level.toUpperCase()} • Tahun {prestasi.year}
              </span>
            </div>
          )}

          {/* Info Card Peraih */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#002347] text-[#E5B80B] flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Peraih Prestasi</p>
                <h2 className="text-base sm:text-lg font-bold text-[#002347]">
                  {prestasi.achieverName}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
              <Award className="w-5 h-5 text-[#E5B80B] flex-shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-[#002347]">Kategori Lomba/Ajang</p>
                <p className="text-slate-500 capitalize">{prestasi.level}</p>
              </div>
            </div>
          </div>

          {/* Deskripsi Lengkap */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#002347] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#E5B80B]" />
              <span>Detail Pencapaian</span>
            </h3>
            
            {prestasi.description ? (
              <div className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line bg-white p-5 rounded-lg border border-slate-100 shadow-sm">
                {prestasi.description}
              </div>
            ) : (
              <p className="text-slate-500 italic text-sm">
                Tidak ada rincian deskripsi tambahan untuk prestasi ini.
              </p>
            )}
          </div>

          {/* Divider & Tombol Kembali */}
          <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 text-[#002347] hover:bg-[#002347] hover:text-white transition-all text-sm font-semibold group shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Beranda</span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Fakultas Teknik UWKS Bangga & Mengapresiasi</span>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
