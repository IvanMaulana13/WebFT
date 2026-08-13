import type { Metadata } from "next";
import Link from "next/link";
import ProfilSidebar from "@/components/public/profil-sidebar";
import DosenContent, { DosenItem } from "@/components/public/dosen-content";
import { fetchPublicData } from "@/lib/public-api";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Dosen Pengajar | Fakultas Teknik UWKS",
  description: "Daftar Dosen Pengajar Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

export default async function DosenPage() {
  const dosenList = (await fetchPublicData<DosenItem[]>("/api/dosen")) || [];

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
              BERANDA
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>PROFIL</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#E5B80B] font-bold">DOSEN PENGAJAR</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold font-sans uppercase">
            Dosen Pengajar
          </h1>
        </div>
      </section>

      {/* ── Main Content Grid ── */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-12 gap-8">
        <ProfilSidebar />

        <article className="col-span-12 lg:col-span-9 bg-white rounded-xl p-8 lg:p-12 shadow-sm border border-slate-200">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-[#002347] font-sans">
                Daftar Dosen Pengajar Fakultas Teknik
              </h2>
            </div>

            <DosenContent initialData={dosenList} />
          </div>
        </article>
      </div>
    </main>
  );
}
