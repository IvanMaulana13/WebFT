import type { Metadata } from "next";
import Link from "next/link";
import ProfilSidebar from "@/components/public/profil-sidebar";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sejarah | Fakultas Teknik UWKS",
  description: "Sejarah dan Perjalanan Perkemabangan Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

/**
 * Halaman Sejarah Fakultas Teknik
 * // TODO: belum ada CMS untuk halaman ini, konten masih statis (hardcode) sesuai desain Stitch
 */
export default function SejarahPage() {
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
            <span className="text-[#E5B80B] font-bold">SEJARAH</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold font-sans uppercase">
            Sejarah Fakultas Teknik
          </h1>
        </div>
      </section>

      {/* ── Main Content Grid ── */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-12 gap-8">
        <ProfilSidebar />

        <article className="col-span-12 lg:col-span-9 bg-white rounded-xl p-8 lg:p-12 shadow-sm border border-slate-200">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-[#002347] font-sans">
                Membangun Masa Depan Sejak 1981
              </h2>
              <div className="h-1 w-20 bg-[#E5B80B] rounded-full" />
            </div>

            <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-5 text-justify">
              <p>
                Fakultas Teknik berdiri sejak tahun 1981 bersamaan dengan berdirinya enam fakultas yang ada di lingkungan Universitas Wijaya Kusuma Surabaya, dan hanya terdiri dari satu program studi, yaitu Program Studi Teknik Sipil (TS). Pada mulanya, program studi ini mempunyai dua bidang studi konsentrasi yaitu bidang studi konstruksi dan bidang studi hidroteknik. Sejak diberlakukan kurikulum nasional pada tahun 1996/1997 menjadi Program Studi Teknik Sipil Umum sesuai dengan muatan kurikulum yang diberlakukan.
              </p>
              <p>
                Pada awal berdiri Program Studi Teknik Sipil hampir semua pimpinan dan dosen berasal dari Institut Sepuluh Nopember (ITS) Surabaya dan instansi-instansi pemerintah yang ada di Pemerintah Daerah Tingkat I Jawa Timur. Selama hampir 20 tahun Fakultas Teknik telah dibina oleh ITS dan instansi-instansi pemerintah.
              </p>
              <p>
                Tahun 2007 dibuka Program Studi Teknik Perangkat Lunak (TPL) berdasar ijin Dirjen Perguruan Tinggi (DIKTI) No.144/D/T/2007 tanggal 25 Januari 2007, program studi ini sekarang disebut Program Studi Informatika (IF). Bersamaan dengan itu Fakultas Teknik juga dipercaya oleh universitas untuk mengelola Program Studi Teknologi Industri Pertanian (TIP) yang dari awal sudah dikelola oleh Fakultas Pertanian sejak awal berdiri tahun 1994. Pemindahan ini karena pertimbangan bahwa kurikulum TIP lebih banyak ke arah teknologi dan lebih sesuai bila berada dalam pengelolaan Fakultas Teknik.
              </p>
            </div>

            {/* Timeline Highlights */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-lg p-6 border-t-4 border-[#002347] shadow-sm">
                <span className="block text-xl font-bold text-[#002347] mb-2 font-sans">
                  1981
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pendirian resmi bersama Universitas dengan Program Studi Teknik Sipil sebagai pionir.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-6 border-t-4 border-[#E5B80B] shadow-sm">
                <span className="block text-xl font-bold text-[#002347] mb-2 font-sans">
                  2007
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pembukaan Prodi Teknik Perangkat Lunak (kini Informatika) melengkapi ekosistem digital.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-6 border-t-4 border-[#002347] shadow-sm">
                <span className="block text-xl font-bold text-[#002347] mb-2 font-sans">
                  Sekarang
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Terus berkembang mengelola program studi unggulan Sipil, Informatika, dan TIP.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
