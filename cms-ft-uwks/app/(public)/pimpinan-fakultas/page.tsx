import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ProfilSidebar from "@/components/public/profil-sidebar";
import { fetchPublicData } from "@/lib/public-api";
import { ChevronRight, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Pimpinan Fakultas | Fakultas Teknik UWKS",
  description: "Struktur Pimpinan Dekanat Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

interface PimpinanItem {
  id: number;
  name: string;
  photoUrl?: string | null;
  jabatan: string;
  periodeMulai?: string | Date | null;
  periodeSelesai?: string | Date | null;
  sambutan?: string | null;
}

function formatPeriod(mulai?: string | Date | null, selesai?: string | Date | null) {
  if (!mulai && !selesai) return "";
  const yearMulai = mulai ? new Date(mulai).getFullYear() : "";
  const yearSelesai = selesai ? new Date(selesai).getFullYear() : "Sekarang";
  return `Periode ${yearMulai} - ${yearSelesai}`;
}

export default async function PimpinanFakultasPage() {
  const pimpinanList = (await fetchPublicData<PimpinanItem[]>("/api/pimpinan")) || [];

  // Separate Dekan from other leadership members
  const dekan = pimpinanList.find(
    (p) => p.jabatan?.toLowerCase().includes("dekan") && !p.jabatan?.toLowerCase().includes("wakil")
  );

  const wakilDekanAndOthers = pimpinanList.filter(
    (p) => p.id !== dekan?.id
  );

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
            <span className="text-[#E5B80B] font-bold">PIMPINAN FAKULTAS</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold font-sans uppercase">
            Pimpinan Fakultas
          </h1>
        </div>
      </section>

      {/* ── Main Content Grid ── */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-12 gap-8">
        <ProfilSidebar />

        <article className="col-span-12 lg:col-span-9 bg-white rounded-xl p-8 lg:p-12 shadow-sm border border-slate-200">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* ── Dekan Highlight Section (Top) ── */}
            {dekan ? (
              <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#E5B80B]" />
                <div className="w-48 h-60 relative rounded-xl overflow-hidden border-2 border-white shadow-md bg-slate-200 mb-6">
                  {dekan.photoUrl ? (
                    <Image
                      src={dekan.photoUrl}
                      alt={dekan.name}
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User className="w-16 h-16" />
                    </div>
                  )}
                </div>
                <span className="bg-[#002347] text-[#E5B80B] text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider mb-2">
                  {dekan.jabatan}
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-[#002347] mb-1 font-sans">
                  {dekan.name}
                </h2>
                {formatPeriod(dekan.periodeMulai, dekan.periodeSelesai) && (
                  <p className="text-xs text-slate-500 font-medium mb-4">
                    {formatPeriod(dekan.periodeMulai, dekan.periodeSelesai)}
                  </p>
                )}

                {/* Sambutan Dekan */}
                {dekan.sambutan && dekan.sambutan.trim() !== "" && (
                  <div className="mt-4 p-6 bg-white rounded-xl border border-slate-200/80 text-left text-sm text-slate-700 leading-relaxed italic relative">
                    <span className="text-3xl font-serif text-[#E5B80B] absolute -top-3 left-4">
                      “
                    </span>
                    <p className="pt-2 font-sans not-italic text-slate-700">
                      {dekan.sambutan}
                    </p>
                  </div>
                )}
              </div>
            ) : null}

            {/* ── Other Pimpinan Grid ── */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-[#002347] font-sans uppercase">
                  Jajaran Dekanat & Pimpinan
                </h3>
              </div>

              {wakilDekanAndOthers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {wakilDekanAndOthers.map((item) => (
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
                      <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1">
                        {item.name}
                      </h4>
                      {formatPeriod(item.periodeMulai, item.periodeSelesai) && (
                        <p className="text-[11px] text-slate-500">
                          {formatPeriod(item.periodeMulai, item.periodeSelesai)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : !dekan ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Belum ada data pimpinan fakultas.
                </div>
              ) : null}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
