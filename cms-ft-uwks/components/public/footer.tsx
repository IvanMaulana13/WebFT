import Image from "next/image";
import { socialLinks } from "@/lib/config/social-links";

// Lucide-style SVG icons untuk setiap platform sosmed
const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case "instagram":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case "facebook":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "youtube":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <path d="m10 15 5-3-5-3z" />
        </svg>
      );
    case "twitter":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 4l16 16" />
          <path d="m4 20 7.5-7.5M20 4l-7.5 7.5" />
          <path d="M4 4h4l12 16h-4z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    default:
      return null;
  }
};

const footerLinks = [
  {
    heading: "Tentang Kami",
    links: [
      { label: "Profil Fakultas", href: "#profil" },
      { label: "Visi & Misi", href: "#visi-misi" },
      { label: "Sejarah", href: "#sejarah" },
      { label: "Struktur Organisasi", href: "#struktur" },
    ],
  },
  {
    heading: "Akademik",
    links: [
      { label: "Program Studi", href: "#prodi" },
      { label: "Kalender Akademik", href: "#kalender" },
      { label: "Dosen", href: "#dosen" },
      { label: "Jurnal & Penelitian", href: "#jurnal" },
    ],
  },
  {
    heading: "Layanan",
    links: [
      { label: "Informasi Umum", href: "#informasi" },
      { label: "Berita & Kegiatan", href: "#berita" },
      { label: "Prestasi", href: "#prestasi" },
      { label: "Kemitraan", href: "#kemitraan" },
    ],
  },
];

/**
 * Footer publik — link navigasi, ikon sosial media, dan info kontak.
 * Semua URL sosmed diambil dari lib/config/social-links.ts
 */
export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white" id="kontak">
      {/* ── Main Footer ── */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white/10">
                <Image
                  src="/logo-uwks.png"
                  alt="Logo FT UWKS"
                  fill
                  className="object-contain p-1"
                  sizes="40px"
                />
              </div>
              <div>
                <p className="text-base font-bold leading-tight">FT UWKS</p>
                <p className="text-xs text-white/50 leading-tight">
                  Fakultas Teknik
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              Fakultas Teknik Universitas Wijaya Kusuma Surabaya — mencetak
              insinyur berkarakter, inovatif, dan berdaya saing global.
            </p>

            {/* Alamat */}
            <address className="mt-5 not-italic text-sm text-white/50 leading-relaxed">
              Jl. Dukuh Kupang XXV No.54,
              <br />
              Surabaya, Jawa Timur 60225
              <br />
              <a
                href="mailto:ft@uwks.ac.id"
                className="mt-1 inline-block text-blue-400 hover:text-blue-300 transition-colors"
              >
                ft@uwks.ac.id
              </a>
            </address>

            {/* Social Media Icons */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-200 hover:border-blue-500/50 hover:bg-blue-600/20 hover:text-blue-400"
                >
                  <SocialIcon platform={link.platform} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          {footerLinks.map((section) => (
            <div key={section.heading}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
                {section.heading}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/30 sm:flex-row sm:px-6 lg:px-8">
          <p>
            &copy; {currentYear} Fakultas Teknik Universitas Wijaya Kusuma
            Surabaya. Hak cipta dilindungi.
          </p>
          <p className="text-white/20">
            Dikembangkan oleh Tim IT FT UWKS
          </p>
        </div>
      </div>
    </footer>
  );
}
