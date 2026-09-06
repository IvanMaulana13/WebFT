import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import ProfilSidebar from "@/components/public/profil-sidebar";
import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("profil.visiMisi");
  return {
    title: `${t("title")} | Fakultas Teknik UWKS`,
    description: t("visiQuote"),
  };
}

export default async function VisiMisiPage() {
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
            <span className="text-[#E5B80B] font-bold">{tProfil("visiMisi.breadcrumb")}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold font-sans uppercase">
            {tProfil("visiMisi.title")}
          </h1>
        </div>
      </section>

      {/* ── Main Content Grid ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16 grid grid-cols-12 gap-6 md:gap-8">
        <ProfilSidebar />

        <article className="col-span-12 md:col-span-8 lg:col-span-9 bg-white rounded-xl p-6 sm:p-8 lg:p-12 shadow-sm border border-slate-200">
          <div className="max-w-3xl mx-auto space-y-10">
            {/* Visi Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002347] font-sans border-b-2 border-[#E5B80B] pb-2 inline-block">
                {tProfil("visiMisi.visiHeading")}
              </h2>
              <p className="text-base text-slate-700 leading-relaxed p-6 bg-slate-50 rounded-lg border-l-4 border-[#002347] italic font-medium">
                {tProfil("visiMisi.visiQuote")}
              </p>
            </section>

            {/* Misi Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002347] font-sans border-b-2 border-[#E5B80B] pb-2 inline-block">
                {tProfil("visiMisi.misiHeading")}
              </h2>
              <ol className="list-decimal list-outside ml-6 space-y-3 text-slate-700 text-sm md:text-base leading-relaxed">
                <li className="pl-2">{tProfil("visiMisi.misi1")}</li>
                <li className="pl-2">{tProfil("visiMisi.misi2")}</li>
                <li className="pl-2">{tProfil("visiMisi.misi3")}</li>
                <li className="pl-2">{tProfil("visiMisi.misi4")}</li>
                <li className="pl-2">{tProfil("visiMisi.misi5")}</li>
              </ol>
            </section>

            {/* Tujuan Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002347] font-sans border-b-2 border-[#E5B80B] pb-2 inline-block">
                {tProfil("visiMisi.tujuanHeading")}
              </h2>
              <ol className="list-decimal list-outside ml-6 space-y-3 text-slate-700 text-sm md:text-base leading-relaxed">
                <li className="pl-2">{tProfil("visiMisi.tujuan1")}</li>
                <li className="pl-2">{tProfil("visiMisi.tujuan2")}</li>
                <li className="pl-2">{tProfil("visiMisi.tujuan3")}</li>
                <li className="pl-2">{tProfil("visiMisi.tujuan4")}</li>
              </ol>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
