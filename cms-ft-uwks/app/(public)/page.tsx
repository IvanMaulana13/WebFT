import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { fetchPublicData } from "@/lib/public-api";
import {
  GraduationCap,
  Users,
  Building2,
  Trophy,
  Calendar,
  ArrowRight,
  ExternalLink,
  Medal,
  User,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Website Resmi Fakultas Teknik Universitas Wijaya Kusuma Surabaya — mencetak insinyur berkarakter, inovatif, dan berdaya saing global.",
};

interface SiteSettings {
  heroVideoUrl?: string | null;
  heroPosterUrl?: string | null;
}

interface InformasiItem {
  id: number;
  title: string;
  category?: string | null;
  createdAt: string;
  orderIndex: number;
  status: string;
}

interface BeritaItem {
  id: number;
  title: string;
  slug: string;
  thumbnailUrl?: string | null;
  category?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  status: string;
}

interface PrestasiItem {
  id: number;
  title: string;
  achieverName: string;
  level: string;
  year: number;
  imageUrl?: string | null;
  description?: string | null;
}

interface KemitraanItem {
  id: number;
  partnerName: string;
  logoUrl?: string | null;
  partnershipType?: string | null;
  websiteUrl?: string | null;
  orderIndex: number;
}

export default async function HomePage() {
  const [settings, informasiData, beritaData, prestasiData, kemitraanData] =
    await Promise.all([
      fetchPublicData<SiteSettings>("/api/settings"),
      fetchPublicData<InformasiItem[]>("/api/informasi"),
      fetchPublicData<BeritaItem[]>("/api/berita"),
      fetchPublicData<PrestasiItem[]>("/api/prestasi"),
      fetchPublicData<KemitraanItem[]>("/api/kemitraan"),
    ]);

  // Filter published & sort
  const publishedInformasi = (informasiData || [])
    .filter((i) => i.status === "published")
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  const publishedBerita = (beritaData || [])
    .filter((b) => b.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    )
    .slice(0, 3);

  const sortedPrestasi = (prestasiData || [])
    .sort((a, b) => (b.year || 0) - (a.year || 0))
    .slice(0, 4);

  const sortedKemitraan = (kemitraanData || []).sort(
    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
  );

  const heroVideoUrl = settings?.heroVideoUrl;
  const heroPosterUrl = settings?.heroPosterUrl;

  return (
    <main className="w-full">
      {/* ── 1. HERO SECTION WITH DYNAMIC VIDEO BACKGROUND ── */}
      <section className="relative w-full h-[550px] md:h-[650px] bg-[#000d21] flex items-center justify-center overflow-hidden">
        {heroVideoUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={heroPosterUrl || undefined}
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
          >
            <source src={heroVideoUrl} />
            Browser Anda tidak mendukung pemutaran video.
          </video>
        ) : heroPosterUrl ? (
          <img
            src={heroPosterUrl}
            alt="Hero Poster FT UWKS"
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
          />
        ) : (
          /* Fallback background polos gelap jika video dan poster belum diupload */
          <div className="absolute inset-0 bg-gradient-to-br from-[#00152e] via-[#000d21] to-[#000814] z-0" />
        )}

        {/* Overlay gelap semi-transparan untuk keterbacaan teks */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000d21] via-[#000d21]/60 to-black/40 z-10" />
        
      </section>

      {/* ── 2. BENTO STATS SECTION ── */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[#f8f9fa] p-6 border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-md hover:border-[#E5B80B] transition-all">
              <GraduationCap className="w-10 h-10 text-[#002347] mb-2" />
              <h3 className="text-3xl font-bold text-[#212529]">3</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Program Studi</p>
            </div>
            <div className="bg-[#f8f9fa] p-6 border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-md hover:border-[#E5B80B] transition-all">
              <Users className="w-10 h-10 text-[#002347] mb-2" />
              <h3 className="text-3xl font-bold text-[#212529]">1.2K+</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Mahasiswa Aktif</p>
            </div>
            <div className="bg-[#f8f9fa] p-6 border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-md hover:border-[#E5B80B] transition-all">
              <Building2 className="w-10 h-10 text-[#002347] mb-2" />
              <h3 className="text-3xl font-bold text-[#212529]">50+</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Dosen Ahli</p>
            </div>
            <div className="bg-[#f8f9fa] p-6 border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-md hover:border-[#E5B80B] transition-all">
              <Trophy className="w-10 h-10 text-[#002347] mb-2" />
              <h3 className="text-3xl font-bold text-[#212529]">98%</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Terserap Industri</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. INFORMASI SECTION (Dynamic API) ── */}
      <section className="py-16 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#002347] font-sans">
              Informasi Terkini
            </h2>
            <div className="flex-grow h-px bg-slate-200" />
          </div>

          {publishedInformasi.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publishedInformasi.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 border border-slate-200 rounded-xl flex flex-col gap-2 hover:shadow-md hover:border-[#E5B80B] hover:-translate-y-0.5 transition-all group"
                >
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    {item.category && (
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[#002347] group-hover:text-[#E5B80B] transition-colors">
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              Belum ada data informasi dipublikasikan.
            </div>
          )}
        </div>
      </section>

      {/* ── 4. BERITA SECTION (Dynamic API) ── */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#002347] font-sans">
              Berita & Kegiatan
            </h2>
            <div className="flex-grow h-px bg-slate-200" />
          </div>

          {publishedBerita.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publishedBerita.map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="flex flex-col gap-3 group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-[#E5B80B]/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Building2 className="w-12 h-12 opacity-40" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col gap-2 flex-grow">
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(
                        item.publishedAt || item.createdAt
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <h3 className="text-base font-bold text-[#002347] group-hover:text-[#E5B80B] transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              Belum ada berita dipublikasikan.
            </div>
          )}
        </div>
      </section>

      {/* ── 5. PRESTASI SECTION (Dynamic API) ── */}
      <section className="py-16 bg-[#f8f9fa] border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#002347] font-sans">
              Prestasi Mahasiswa
            </h2>
            <div className="flex-grow h-px bg-slate-200" />
          </div>

          {sortedPrestasi.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {sortedPrestasi.map((item) => (
                <Link
                  key={item.id}
                  href={`/prestasi/${item.id}`}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:border-[#E5B80B] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  {/* Foto / Gambar Prestasi */}
                  <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-slate-100 text-amber-500/70">
                        <Medal className="w-10 h-10 stroke-1" />
                      </div>
                    )}
                    <div className="absolute top-2.5 right-2.5">
                      <span className="bg-[#002347]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm border border-white/10">
                        {item.level}
                      </span>
                    </div>
                  </div>

                  {/* Info Konten */}
                  <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-[#E5B80B] block mb-1">
                        Tahun {item.year}
                      </span>
                      <h3 className="text-sm font-bold text-[#002347] group-hover:text-[#E5B80B] transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
                      <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <p className="font-medium truncate">
                        {item.achieverName}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              Belum ada data prestasi.
            </div>
          )}
        </div>
      </section>

      {/* ── 6. KEMITRAAN SECTION (Dynamic API) ── */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#002347] font-sans">
              Kemitraan Strategis
            </h2>
            <div className="flex-grow h-px bg-slate-200" />
          </div>

          {sortedKemitraan.length > 0 ? (
            <div className="relative overflow-hidden py-4">
              <div className="flex gap-8 items-center animate-marquee-ltr whitespace-nowrap">
                {sortedKemitraan.map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 w-48 h-24 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-4 hover:border-[#E5B80B] transition-colors"
                  >
                    {item.logoUrl ? (
                      <Image
                        src={item.logoUrl}
                        alt={item.partnerName}
                        width={120}
                        height={60}
                        className="max-h-14 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-xs font-bold text-slate-700 text-center">
                        {item.partnerName}
                      </span>
                    )}
                  </div>
                ))}
                {/* Duplicate for seamless infinite loop */}
                {sortedKemitraan.map((item) => (
                  <div
                    key={`dup-${item.id}`}
                    className="flex-shrink-0 w-48 h-24 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-4 hover:border-[#E5B80B] transition-colors"
                  >
                    {item.logoUrl ? (
                      <Image
                        src={item.logoUrl}
                        alt={item.partnerName}
                        width={120}
                        height={60}
                        className="max-h-14 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-xs font-bold text-slate-700 text-center">
                        {item.partnerName}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              Belum ada data kemitraan.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
