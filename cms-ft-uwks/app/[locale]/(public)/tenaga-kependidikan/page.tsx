import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import ProfilSidebar from "@/components/public/profil-sidebar";
import { fetchPublicData } from "@/lib/public-api";
import { ChevronRight, User } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("profil.tendik");
  return {
    title: `${t("title")} | Fakultas Teknik UWKS`,
    description: t("desc"),
  };
}

interface TenagaPendidikanItem {
  id: number;
  photoUrl?: string | null;
  nuptk?: string | null;
  name: string;
  jabatan: string;
  email: string;
}

export default async function TenagaKependidikanPage() {
  const [list, tProfil, tCommon] = await Promise.all([
    fetchPublicData<TenagaPendidikanItem[]>("/api/tenaga-pendidikan").then((res) => res || []),
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
            <span className="text-[#E5B80B] font-bold">{tProfil("tendik.breadcrumb")}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold font-sans uppercase">
            {tProfil("tendik.title")}
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
                {tProfil("tendik.heading")}
              </h2>
            </div>

            {list.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {list.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col items-center text-center hover:border-[#E5B80B] hover:shadow-md transition-all"
                  >
                    <div className="w-36 h-44 relative rounded-lg overflow-hidden border border-slate-200 bg-slate-200 mb-4">
                      {item.photoUrl ? (
                        <Image
                          src={item.photoUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="144px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <User className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-[#002347] uppercase tracking-wider mb-1">
                      {item.jabatan}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">
                      {item.name}
                    </h3>
                    {item.nuptk && (
                      <p className="text-[11px] text-slate-500 font-mono">
                        NUPTK: {item.nuptk}
                      </p>
                    )}
                    {item.email && (
                      <p className="text-[11px] text-[#002347] font-medium mt-1 truncate max-w-full">
                        {item.email}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-sm">
                {tProfil("tendik.empty")}
              </div>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
