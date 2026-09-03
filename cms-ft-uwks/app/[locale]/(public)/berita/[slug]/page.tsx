import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { fetchPublicBeritaBySlug } from "@/lib/public-api";
import {
  Calendar,
  Tag,
  ArrowLeft,
  ChevronRight,
  Building2,
  Share2,
} from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

export const revalidate = 60;

interface BeritaDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>?/gm, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateMetadata({
  params,
}: BeritaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const berita = await fetchPublicBeritaBySlug(slug);

  if (!berita || berita.status !== "published") {
    return {
      title: "Berita Tidak Ditemukan | Fakultas Teknik UWKS",
      description: "Halaman berita yang Anda cari tidak ditemukan.",
    };
  }

  const plainText = stripHtml(berita.content || "");
  const snippet =
    plainText.length > 160 ? `${plainText.substring(0, 157)}...` : plainText;

  return {
    title: `${berita.title} | Fakultas Teknik UWKS`,
    description: snippet || "Berita terkini Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
    openGraph: {
      title: `${berita.title} | Fakultas Teknik UWKS`,
      description: snippet,
      type: "article",
      publishedTime: berita.publishedAt ? new Date(berita.publishedAt).toISOString() : undefined,
      images: berita.thumbnailUrl ? [{ url: berita.thumbnailUrl }] : undefined,
    },
  };
}

export default async function BeritaDetailPage({
  params,
}: BeritaDetailPageProps) {
  const { slug } = await params;
  const [berita, tCommon, locale] = await Promise.all([
    fetchPublicBeritaBySlug(slug),
    getTranslations("common"),
    getLocale(),
  ]);

  // Jika tidak ditemukan atau draft, tampilkan 404
  if (!berita || berita.status !== "published") {
    notFound();
  }

  const formattedDate = (berita.publishedAt || berita.createdAt)
    ? new Date(berita.publishedAt || berita.createdAt).toLocaleDateString(
        locale === "en" ? "en-US" : "id-ID",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "";
  const cleanContent = DOMPurify.sanitize(berita.content || "");

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
        <div className="relative z-20 max-w-5xl mx-auto px-6 w-full">
          <nav className="flex items-center flex-wrap gap-2 mb-4 text-xs uppercase tracking-wider text-white/80">
            <Link href="/" className="hover:underline hover:text-[#E5B80B] transition-colors">
              {tCommon("beranda")}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/60" />
            <span className="text-white/80">{locale === "en" ? "NEWS" : "BERITA"}</span>
            <ChevronRight className="w-3.5 h-3.5 text-white/60" />
            <span className="text-[#E5B80B] font-bold truncate max-w-[200px] sm:max-w-xs">
              {berita.title}
            </span>
          </nav>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-sans text-white leading-tight mt-2">
            {berita.title}
          </h1>

          <div className="flex items-center flex-wrap gap-4 mt-6 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#E5B80B]" />
              <span>{formattedDate}</span>
            </div>

            {berita.category && (
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#E5B80B]" />
                <span className="bg-[#E5B80B]/20 text-[#E5B80B] border border-[#E5B80B]/30 px-2.5 py-0.5 rounded-full font-medium text-xs">
                  {berita.category}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Content Section ── */}
      <section className="max-w-5xl mx-auto px-6 -mt-6">
        <article className="bg-white rounded-2xl p-6 sm:p-10 md:p-12 shadow-sm border border-slate-200">
          
          {/* Thumbnail Besar */}
          {berita.thumbnailUrl ? (
            <div className="relative w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden mb-8 border border-slate-100 shadow-inner bg-slate-100">
              <Image
                src={berita.thumbnailUrl}
                alt={berita.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 960px"
              />
            </div>
          ) : (
            <div className="w-full h-48 md:h-64 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 mb-8">
              <Building2 className="w-16 h-16 opacity-30 mb-2" />
              <span className="text-xs">Fakultas Teknik UWKS</span>
            </div>
          )}

          {/* Isi Berita (Rich Text / HTML yang sudah disanitasi) */}
          <div
            className="prose prose-slate max-w-none text-slate-700 leading-relaxed sm:text-base prose-headings:font-bold prose-headings:text-[#002347] prose-h2:text-2xl prose-h3:text-xl prose-a:text-[#002347] prose-a:font-semibold prose-a:underline hover:prose-a:text-[#E5B80B] prose-img:rounded-xl prose-img:shadow-md prose-blockquote:border-l-4 prose-blockquote:border-[#E5B80B] prose-blockquote:bg-slate-50 prose-blockquote:p-4 prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />

          {/* Divider & Tombol Aksi */}
          <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 text-[#002347] hover:bg-[#002347] hover:text-white transition-all text-sm font-semibold group shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>{tCommon("kembaliKeBeranda")}</span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Share2 className="w-4 h-4 text-slate-400" />
              <span>Fakultas Teknik Universitas Wijaya Kusuma Surabaya</span>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
