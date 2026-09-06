import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import ProfilSidebar from "@/components/public/profil-sidebar";
import { fetchPublicData } from "@/lib/public-api";
import { ChevronRight, GitFork } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("profil.struktur");
  return {
    title: `${t("title")} | Fakultas Teknik UWKS`,
    description: t("desc"),
  };
}

interface StrukturData {
  id: number;
  imageUrl?: string | null;
  updatedAt?: string;
}

export default async function StrukturOrganisasiPage() {
  const [struktur, tProfil, tCommon] = await Promise.all([
    fetchPublicData<StrukturData>("/api/struktur-organisasi"),
    getTranslations("profil"),
    getTranslations("common"),
  ]);

  const imageUrl = struktur?.imageUrl;

  return (
    <main className="w-full">
      {/* ── Banner Header / Breadcrumb ── */}
      <section className="relative h-64 flex items-center overflow-hidden bg-[#002347] text-white">
        <div className="absolute inset-0 bg-[#002347]/80 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAW1U5BTsnUUW4XUtR-Xn70Cc3id4UjSRlakVbeVHB8d-hI_QV5Kb_YcQo3KALsBTxfeMNG6lFLR8AiFNg3KqK_olg05tLYuPbP2ZknQ-QunlHgTN4OIZijDE1PsmstusiyI8YkqQZVYcrxOVWWMxTt3NAgqyu-r5-1Otak_bR83GsUxgE9HrcUcsh4S_Nq3hgibKFzp48OoXqYMIo5aq4WxI6HiLGcKrTXp5O5o7btyhtsG7ByGN-AdpJg6_91_HvXIQ')",
          }}
        />
        <div className="relative z-20 max-w-6xl mx-auto px-6 w-full">
          <nav className="flex items-center gap-2 mb-3 text-xs uppercase tracking-wider text-white/80">
            <Link href="/" className="hover:underline">
              {tCommon("beranda")}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>{tProfil("breadcrumbProfil")}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#E5B80B] font-bold">{tProfil("struktur.breadcrumb")}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold font-sans uppercase">
            {tProfil("struktur.title")}
          </h1>
        </div>
      </section>

      {/* ── Main Content Grid ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16 grid grid-cols-12 gap-6 md:gap-8">
        <ProfilSidebar />

        <article className="col-span-12 md:col-span-8 lg:col-span-9 bg-white rounded-xl p-6 sm:p-8 lg:p-12 shadow-sm border border-slate-200">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-[#002347] font-sans">
                {tProfil("struktur.heading")}
              </h2>
            </div>

            {imageUrl ? (
              <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-4 shadow-sm flex items-center justify-center">
                <Image
                  src={imageUrl}
                  alt={tProfil("struktur.title")}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-contain rounded-lg"
                  priority
                />
              </div>
            ) : (
              <div className="p-12 text-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-400">
                <GitFork className="w-12 h-12 opacity-30" />
                <p className="text-sm font-medium">
                  {tCommon("belumTersedia")}
                </p>
              </div>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
