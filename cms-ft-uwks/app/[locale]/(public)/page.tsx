import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { fetchPublicData } from "@/lib/public-api";
import {
  GraduationCap,
  Users,
  Building2,
  Trophy,
  Medal,
  User,
} from "lucide-react";
import { BeritaSection } from "@/components/public/berita-section";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Website Resmi Fakultas Teknik Universitas Wijaya Kusuma Surabaya — mencetak insinyur berkarakter, inovatif, dan berdaya saing global.",
};

interface SiteSettings {
  heroVideoUrl?: string | null;
  heroPosterUrl?: string | null;
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
  kategoriMitra?: string | null;
  logoUrl?: string | null;
  partnershipType?: string | null;
  websiteUrl?: string | null;
  orderIndex: number;
}

export default async function HomePage() {
  const [settings, beritaData, prestasiData, kemitraanData, t, tCommon] =
    await Promise.all([
      fetchPublicData<SiteSettings>("/api/settings"),
      fetchPublicData<BeritaItem[]>("/api/berita"),
      fetchPublicData<PrestasiItem[]>("/api/prestasi"),
      fetchPublicData<KemitraanItem[]>("/api/kemitraan"),
      getTranslations("beranda"),
      getTranslations("common"),
    ]);

  // Berita: filter published & sort terbaru (maks 6 untuk tab filter)
  const publishedBerita = (beritaData || [])
    .filter((b) => b.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    )
    .slice(0, 6);

  const sortedPrestasi = (prestasiData || [])
    .sort((a, b) => (b.year || 0) - (a.year || 0))
    .slice(0, 4);

  const allKemitraan = (kemitraanData || []).sort(
    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
  );

  const universitasMitra = allKemitraan.filter(
    (item) => (item.kategoriMitra ?? "universitas") === "universitas"
  );
  const lembagaMitra = allKemitraan.filter(
    (item) => item.kategoriMitra === "lembaga"
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
              <p className="text-xs text-slate-500 font-medium mt-1">{t("prodiCountLabel")}</p>
            </div>
            <div className="bg-[#f8f9fa] p-6 border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-md hover:border-[#E5B80B] transition-all">
              <Users className="w-10 h-10 text-[#002347] mb-2" />
              <h3 className="text-3xl font-bold text-[#212529]">1.2K+</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">{t("mahasiswaAktifLabel")}</p>
            </div>
            <div className="bg-[#f8f9fa] p-6 border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-md hover:border-[#E5B80B] transition-all">
              <Building2 className="w-10 h-10 text-[#002347] mb-2" />
              <h3 className="text-3xl font-bold text-[#212529]">50+</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">{t("dosenAhliLabel")}</p>
            </div>
            <div className="bg-[#f8f9fa] p-6 border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-md hover:border-[#E5B80B] transition-all">
              <Trophy className="w-10 h-10 text-[#002347] mb-2" />
              <h3 className="text-3xl font-bold text-[#212529]">98%</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">{t("terserapIndustriLabel")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. BERITA SECTION (Client Component with category tabs) ── */}
      <BeritaSection items={publishedBerita} />

      {/* ── 4. PRESTASI SECTION (Dynamic API) ── */}
      <section className="py-16 bg-[#f8f9fa] border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#002347] font-sans">
              {t("prestasiSectionTitle")}
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
                  </div>

                  {/* Info Konten */}
                  <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-[#E5B80B] block mb-1">
                        {tCommon("tahun")} {item.year}
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
              {t("emptyPrestasi")}
            </div>
          )}
        </div>
      </section>

      {/* ── 5. KEMITRAAN SECTION (Dynamic API with 2-Way Marquee) ── */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#002347] font-sans">
              {t("kemitraanSectionTitle")}
            </h2>
            <div className="flex-grow h-px bg-slate-200" />
          </div>

          {universitasMitra.length > 0 || lembagaMitra.length > 0 ? (
            <div className="space-y-10">
              {/* ── Universitas Mitra (Gerak ke KANAN) ── */}
              {universitasMitra.length > 0 && (
                <div>
                  <h3 className="text-xs md:text-sm font-bold text-[#002347] uppercase tracking-wider mb-5">
                    {t("mitraUniversitasTitle")}
                  </h3>
                  <div className="relative overflow-hidden group">
                    <div className="absolute inset-y-0 left-0 w-16 md:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-16 md:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                    <div className="flex gap-6 md:gap-8 items-center animate-marquee-ltr whitespace-nowrap py-3 w-max">
                      {universitasMitra.map((item) => (
                        <div
                          key={item.id}
                          className="flex-shrink-0 w-48 md:w-52 h-24 md:h-28 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center p-3 hover:border-[#E5B80B] hover:shadow-md transition-all duration-300"
                        >
                          {item.logoUrl ? (
                            <>
                              <div className="relative h-10 md:h-12 w-full flex items-center justify-center mb-1">
                                <Image
                                  src={item.logoUrl}
                                  alt={item.partnerName}
                                  width={120}
                                  height={48}
                                  className="max-h-10 md:max-h-12 w-auto object-contain"
                                  unoptimized
                                />
                              </div>
                              <span className="text-[11px] font-semibold text-slate-700 text-center line-clamp-1 max-w-full px-1">
                                {item.partnerName}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs font-bold text-slate-700 text-center leading-tight">
                              {item.partnerName}
                            </span>
                          )}
                        </div>
                      ))}
                      {/* Duplikasi 2x untuk loop mulus */}
                      {universitasMitra.map((item) => (
                        <div
                          key={`dup-univ-${item.id}`}
                          className="flex-shrink-0 w-48 md:w-52 h-24 md:h-28 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center p-3 hover:border-[#E5B80B] hover:shadow-md transition-all duration-300"
                        >
                          {item.logoUrl ? (
                            <>
                              <div className="relative h-10 md:h-12 w-full flex items-center justify-center mb-1">
                                <Image
                                  src={item.logoUrl}
                                  alt={item.partnerName}
                                  width={120}
                                  height={48}
                                  className="max-h-10 md:max-h-12 w-auto object-contain"
                                  unoptimized
                                />
                              </div>
                              <span className="text-[11px] font-semibold text-slate-700 text-center line-clamp-1 max-w-full px-1">
                                {item.partnerName}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs font-bold text-slate-700 text-center leading-tight">
                              {item.partnerName}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Lembaga Mitra (Gerak ke KIRI) ── */}
              {lembagaMitra.length > 0 && (
                <div>
                  <h3 className="text-xs md:text-sm font-bold text-[#002347] uppercase tracking-wider mb-5">
                    {t("mitraLembagaTitle")}
                  </h3>
                  <div className="relative overflow-hidden group">
                    <div className="absolute inset-y-0 left-0 w-16 md:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-16 md:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                    <div className="flex gap-6 md:gap-8 items-center animate-marquee-rtl whitespace-nowrap py-3 w-max">
                      {lembagaMitra.map((item) => (
                        <div
                          key={item.id}
                          className="flex-shrink-0 w-48 md:w-52 h-24 md:h-28 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center p-3 hover:border-[#E5B80B] hover:shadow-md transition-all duration-300"
                        >
                          {item.logoUrl ? (
                            <>
                              <div className="relative h-10 md:h-12 w-full flex items-center justify-center mb-1">
                                <Image
                                  src={item.logoUrl}
                                  alt={item.partnerName}
                                  width={120}
                                  height={48}
                                  className="max-h-10 md:max-h-12 w-auto object-contain"
                                  unoptimized
                                />
                              </div>
                              <span className="text-[11px] font-semibold text-slate-700 text-center line-clamp-1 max-w-full px-1">
                                {item.partnerName}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs font-bold text-slate-700 text-center leading-tight">
                              {item.partnerName}
                            </span>
                          )}
                        </div>
                      ))}
                      {/* Duplikasi 2x untuk loop mulus */}
                      {lembagaMitra.map((item) => (
                        <div
                          key={`dup-lembaga-${item.id}`}
                          className="flex-shrink-0 w-48 md:w-52 h-24 md:h-28 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center p-3 hover:border-[#E5B80B] hover:shadow-md transition-all duration-300"
                        >
                          {item.logoUrl ? (
                            <>
                              <div className="relative h-10 md:h-12 w-full flex items-center justify-center mb-1">
                                <Image
                                  src={item.logoUrl}
                                  alt={item.partnerName}
                                  width={120}
                                  height={48}
                                  className="max-h-10 md:max-h-12 w-auto object-contain"
                                  unoptimized
                                />
                              </div>
                              <span className="text-[11px] font-semibold text-slate-700 text-center line-clamp-1 max-w-full px-1">
                                {item.partnerName}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs font-bold text-slate-700 text-center leading-tight">
                              {item.partnerName}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              {t("emptyMitra")}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
