import type { Metadata } from "next";
import HeroVideo from "@/components/public/hero-video";
import PublicNavbar from "@/components/public/navbar";
import PublicFooter from "@/components/public/footer";
import WhatsappBubble from "@/components/public/whatsapp-bubble";

export const metadata: Metadata = {
  title: "Beranda | Fakultas Teknik UWKS",
  description:
    "Website resmi Fakultas Teknik Universitas Wijaya Kusuma Surabaya — mencetak insinyur berkarakter, inovatif, dan berdaya saing global.",
};

/**
 * Beranda publik — halaman utama website FT UWKS.
 * Terdiri dari: Navbar, Hero Video, section konten, Footer, dan WA Bubble.
 *
 * Link admin/login tersedia di navbar (kanan atas).
 */
export default function BerandaPage() {
  return (
    <>
      {/* ── Navbar (fixed, transparan → solid saat scroll) ── */}
      <PublicNavbar />

      <main>
        {/* ── 1. HERO — Video Background ── */}
        <HeroVideo />

        {/* ── 2. INFORMASI — Statistik Singkat ── */}
        <section
          id="informasi"
          className="bg-white py-20"
          aria-labelledby="informasi-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600">
                Sekilas Fakultas
              </span>
              <h2
                id="informasi-heading"
                className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
              >
                Fakultas Teknik dalam Angka
              </h2>
              <p className="mt-3 text-base text-slate-500">
                Komitmen kami terhadap kualitas pendidikan dan pengembangan
                insinyur masa depan.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { value: "3", label: "Program Studi", icon: "🎓" },
                { value: "50+", label: "Dosen Berpengalaman", icon: "👨‍🏫" },
                { value: "2000+", label: "Mahasiswa Aktif", icon: "👥" },
                { value: "25+", label: "Mitra Industri", icon: "🤝" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="group rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center transition-all duration-300 hover:border-blue-100 hover:bg-blue-50 hover:shadow-md"
                >
                  <div className="mb-3 text-4xl">{stat.icon}</div>
                  <div className="text-3xl font-bold text-slate-900 sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. PROFIL / VISI MISI ── */}
        <section
          id="profil"
          className="bg-slate-50 py-20"
          aria-labelledby="profil-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-700">
                  Profil
                </span>
                <h2
                  id="profil-heading"
                  className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
                >
                  Visi & Misi
                </h2>
                <p className="mt-4 text-lg font-semibold text-blue-700">
                  Visi
                </p>
                <p className="mt-2 text-base text-slate-600 leading-relaxed">
                  Menjadi Fakultas Teknik yang unggul, berkarakter, dan berdaya
                  saing di tingkat nasional maupun internasional pada tahun
                  2030.
                </p>
                <p className="mt-4 text-lg font-semibold text-blue-700">
                  Misi
                </p>
                <ul className="mt-2 space-y-2 text-base text-slate-600">
                  {[
                    "Menyelenggarakan pendidikan teknik berkualitas tinggi berbasis teknologi terkini.",
                    "Mengembangkan penelitian inovatif yang bermanfaat bagi masyarakat dan industri.",
                    "Membangun kemitraan strategis dengan industri dan institusi dalam & luar negeri.",
                    "Menghasilkan lulusan berkarakter Pancasila, profesional, dan siap kerja.",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                        {idx + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-8 text-white shadow-xl">
                <h3 className="text-xl font-bold">Program Studi</h3>
                <div className="mt-6 space-y-4">
                  {[
                    {
                      prodi: "Teknik Sipil",
                      akreditasi: "B",
                      color: "bg-emerald-500",
                    },
                    {
                      prodi: "Teknik Mesin",
                      akreditasi: "B",
                      color: "bg-blue-400",
                    },
                    {
                      prodi: "Teknik Industri",
                      akreditasi: "B",
                      color: "bg-purple-400",
                    },
                  ].map((item) => (
                    <div
                      key={item.prodi}
                      className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm"
                    >
                      <span className="font-medium">{item.prodi}</span>
                      <span
                        className={`${item.color} rounded-full px-3 py-0.5 text-xs font-bold text-white`}
                      >
                        Akreditasi {item.akreditasi}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. BERITA TERBARU (Placeholder) ── */}
        <section
          id="berita"
          className="bg-white py-20"
          aria-labelledby="berita-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <span className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600">
                  Terkini
                </span>
                <h2
                  id="berita-heading"
                  className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
                >
                  Berita & Kegiatan
                </h2>
              </div>
              <a
                href="#"
                className="hidden rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 sm:inline-flex"
              >
                Lihat semua →
              </a>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  kategori: "Akademik",
                  judul: "Wisuda Sarjana FT UWKS Periode 2025/2026",
                  tanggal: "10 Agustus 2026",
                  color: "bg-blue-100 text-blue-700",
                },
                {
                  kategori: "Prestasi",
                  judul:
                    "Mahasiswa FT Raih Juara 1 Kompetisi Robot Nasional 2026",
                  tanggal: "5 Agustus 2026",
                  color: "bg-emerald-100 text-emerald-700",
                },
                {
                  kategori: "Kemitraan",
                  judul: "Penandatanganan MoU dengan PT Semen Gresik",
                  tanggal: "1 Agustus 2026",
                  color: "bg-purple-100 text-purple-700",
                },
              ].map((berita) => (
                <article
                  key={berita.judul}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Thumbnail placeholder */}
                  <div className="h-44 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-300"
                      aria-hidden="true"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                  </div>
                  <div className="p-5">
                    <span
                      className={`inline-block rounded-full ${berita.color} px-2.5 py-0.5 text-xs font-semibold`}
                    >
                      {berita.kategori}
                    </span>
                    <h3 className="mt-3 text-base font-semibold leading-snug text-slate-900 group-hover:text-blue-700 transition-colors">
                      {berita.judul}
                    </h3>
                    <time className="mt-2 block text-xs text-slate-400">
                      {berita.tanggal}
                    </time>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. KEMITRAAN (Placeholder) ── */}
        <section
          id="kemitraan"
          className="bg-slate-900 py-16"
          aria-labelledby="kemitraan-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2
                id="kemitraan-heading"
                className="text-2xl font-bold text-white sm:text-3xl"
              >
                Mitra Industri & Institusi
              </h2>
              <p className="mt-2 text-sm text-white/50">
                Kami berkolaborasi dengan berbagai instansi untuk memperluas
                peluang mahasiswa.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 opacity-60">
              {["Mitra A", "Mitra B", "Mitra C", "Mitra D", "Mitra E"].map(
                (mitra) => (
                  <div
                    key={mitra}
                    className="flex h-14 w-28 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-white/40"
                  >
                    {mitra}
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ── 3. FOOTER — social media links dari config ── */}
      <PublicFooter />

      {/* ── WhatsApp Floating Bubble — nomor dari config ── */}
      <WhatsappBubble />
    </>
  );
}
