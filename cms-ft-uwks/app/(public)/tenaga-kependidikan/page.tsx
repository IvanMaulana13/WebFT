import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ProfilSidebar from "@/components/public/profil-sidebar";
import { fetchPublicData } from "@/lib/public-api";
import { ChevronRight, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Tenaga Kependidikan | Fakultas Teknik UWKS",
  description: "Daftar Tenaga Kependidikan / Staf Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

interface TenagaPendidikanItem {
  id: number;
  photoUrl?: string | null;
  nuptk?: string | null;
  name: string;
  jabatan: string;
  email: string;
}

export default async function TenagaKependidikanPage() {
  const list = (await fetchPublicData<TenagaPendidikanItem[]>("/api/tenaga-pendidikan")) || [];

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
            <span className="text-[#E5B80B] font-bold">TENAGA KEPENDIDIKAN</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold font-sans uppercase">
            Tenaga Kependidikan
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
                Daftar Tenaga Kependidikan Fakultas Teknik
              </h2>
            </div>

            {list.length > 0 ? (
              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-[#002347] text-white">
                      <th className="p-3.5 font-bold uppercase tracking-wider text-xs">Foto</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-xs">NUPTK</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-xs">Nama Lengkap</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-xs">Jabatan</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-xs">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {list.map((item, idx) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                        }`}
                      >
                        <td className="p-3.5">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 relative">
                            {item.photoUrl ? (
                              <Image
                                src={item.photoUrl}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <User className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 font-medium text-slate-700">
                          {item.nuptk || "-"}
                        </td>
                        <td className="p-3.5 font-bold text-[#002347]">{item.name}</td>
                        <td className="p-3.5 text-slate-700 font-medium">{item.jabatan}</td>
                        <td className="p-3.5">
                          <a
                            href={`mailto:${item.email}`}
                            className="text-[#002347] hover:text-[#E5B80B] underline transition-colors"
                          >
                            {item.email}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm">
                Belum ada data tenaga kependidikan.
              </div>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
