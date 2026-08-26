import type { Metadata } from "next";
import Link from "next/link";
import ProfilSidebar from "@/components/public/profil-sidebar";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Visi & Misi | Fakultas Teknik UWKS",
  description: "Visi, Misi, dan Tujuan Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

/**
 * Halaman Visi & Misi Fakultas Teknik
 * // TODO: belum ada CMS untuk halaman ini, konten masih statis (hardcode) sesuai desain Stitch
 */
export default function VisiMisiPage() {
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
            <span className="text-[#E5B80B] font-bold">VISI & MISI</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold font-sans uppercase">
            Visi, Misi & Tujuan
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
                Visi
              </h2>
              <p className="text-base text-slate-700 leading-relaxed p-6 bg-slate-50 rounded-lg border-l-4 border-[#002347] italic font-medium">
                &quot;Menjadi Fakultas Teknik unggulan yang adaptif digital, unggul tridarma, berwawasan lingkungan, dan beretika profesi pada 2030&quot;
              </p>
            </section>

            {/* Misi Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002347] font-sans border-b-2 border-[#E5B80B] pb-2 inline-block">
                Misi
              </h2>
              <ol className="list-decimal list-outside ml-6 space-y-3 text-slate-700 text-sm md:text-base leading-relaxed">
                <li className="pl-2">
                  Membangun tata kelola fakultas yang agile, transparan, dan berbasis teknologi informasi untuk mendukung <em>good governance</em>.
                </li>
                <li className="pl-2">
                  Menyelenggarakan pendidikan teknik berbasis digital, industri 4.0, dan pembelajaran inovatif yang berpusat pada mahasiswa.
                </li>
                <li className="pl-2">
                  Mendorong penelitian kolaboratif yang berorientasi pada solusi teknologi dan produk inovatif tepat guna.
                </li>
                <li className="pl-2">
                  Memperluas pengabdian kepada masyarakat berbasis teknologi digital untuk meningkatkan daya guna lokal.
                </li>
                <li className="pl-2">
                  Mengembangkan SDM yang tidak hanya profesional dan beretika, tetapi juga melek digital dan berjiwa wirausaha berbasis lingkungan.
                </li>
              </ol>
            </section>

            {/* Tujuan Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#002347] font-sans border-b-2 border-[#E5B80B] pb-2 inline-block">
                Tujuan
              </h2>
              <ol className="list-decimal list-outside ml-6 space-y-3 text-slate-700 text-sm md:text-base leading-relaxed">
                <li className="pl-2">
                  Mewujudkan Fakultas Teknik yang unggul, berbasis digital, dan adaptif terhadap transformasi teknologi global.
                </li>
                <li className="pl-2">
                  Meningkatkan kualitas tridarma melalui sinergi digitalisasi, kolaborasi, dan inovasi lintas bidang.
                </li>
                <li className="pl-2">
                  Menghasilkan SDM dosen dan tenaga kependidikan yang literat digital, kreatif, dan produktif dalam menghasilkan inovasi teknik.
                </li>
                <li className="pl-2">
                  Melahirkan lulusan teknik yang beretika, kompeten, melek teknologi, berjiwa wirausaha, serta siap menghadapi dunia kerja global yang dinamis.
                </li>
              </ol>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
