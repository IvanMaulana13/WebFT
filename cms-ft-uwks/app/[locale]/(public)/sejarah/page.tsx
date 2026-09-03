import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import ProfilSidebar from "@/components/public/profil-sidebar";
import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("profil.sejarah");
  return {
    title: `${t("title")} | Fakultas Teknik UWKS`,
    description: t("subheading"),
  };
}

export default async function SejarahPage() {
  const [tProfil, tCommon] = await Promise.all([
    getTranslations("profil"),
    getTranslations("common"),
  ]);

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
            <span className="text-[#E5B80B] font-bold">{tProfil("sejarah.breadcrumb")}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold font-sans uppercase">
            {tProfil("sejarah.title")}
          </h1>
        </div>
      </section>

      {/* ── Main Content Grid ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16 grid grid-cols-12 gap-6 md:gap-8">
        <ProfilSidebar />

        <article className="col-span-12 md:col-span-8 lg:col-span-9 bg-white rounded-xl p-6 sm:p-8 lg:p-12 shadow-sm border border-slate-200">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-[#002347] font-sans">
                {tProfil("sejarah.subheading")}
              </h2>
              <div className="h-1 w-20 bg-[#E5B80B] rounded-full" />
            </div>

            <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-5 text-justify">
              <p>{tProfil("sejarah.p1")}</p>
              <p>{tProfil("sejarah.p2")}</p>
              <p>{tProfil("sejarah.p3")}</p>
            </div>

            {/* Timeline Highlights */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-lg p-6 border-t-4 border-[#002347] shadow-sm">
                <span className="block text-xl font-bold text-[#002347] mb-2 font-sans">
                  1981
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {tProfil("sejarah.timeline1981Desc")}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-6 border-t-4 border-[#E5B80B] shadow-sm">
                <span className="block text-xl font-bold text-[#002347] mb-2 font-sans">
                  2007
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {tProfil("sejarah.timeline2007Desc")}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-6 border-t-4 border-[#002347] shadow-sm">
                <span className="block text-xl font-bold text-[#002347] mb-2 font-sans">
                  {tProfil("sejarah.timelineNowTitle")}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {tProfil("sejarah.timelineNowDesc")}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
