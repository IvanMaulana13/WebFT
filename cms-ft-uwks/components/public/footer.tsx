import Image from "next/image";
import { Link } from "@/i18n/routing";
import { fetchPublicData, fetchPublicVisitorStats } from "@/lib/public-api";
import { Phone, Mail, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface SiteSettings {
  socialInstagram?: string | null;
  socialFacebook?: string | null;
  socialYoutube?: string | null;
  socialTwitter?: string | null;
  socialLinkedin?: string | null;
}

export default async function PublicFooter() {
  const [settings, visitorStats, tFooter, tNavbar] = await Promise.all([
    fetchPublicData<SiteSettings>("/api/settings"),
    fetchPublicVisitorStats(),
    getTranslations("footer"),
    getTranslations("navbar"),
  ]);

  const currentYear = new Date().getFullYear();

  const socialPlatforms = [
    {
      key: "socialInstagram",
      url: settings?.socialInstagram,
      label: "Instagram",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="2"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="2"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2"/>
        </svg>
      ),
    },
    {
      key: "socialFacebook",
      url: settings?.socialFacebook,
      label: "Facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
        </svg>
      ),
    },
    {
      key: "socialYoutube",
      url: settings?.socialYoutube,
      label: "YouTube",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
    {
      key: "socialTwitter",
      url: settings?.socialTwitter,
      label: "X (Twitter)",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      key: "socialLinkedin",
      url: settings?.socialLinkedin,
      label: "LinkedIn",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
        </svg>
      ),
    },
  ].filter((p) => Boolean(p.url && p.url.trim() !== ""));

  return (
    <footer className="bg-[#002347] text-white w-full py-12 border-t border-slate-800">
      <div className="px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Branding & Contact */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-uwks.png"
              alt="UWKS Logo"
              width={64}
              height={64}
              className="h-14 w-auto object-contain"
            />
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-bold text-white">FT</span>
              <span className="text-xl font-bold text-[#E5B80B]">UWKS</span>
            </div>
          </div>
          <p className="text-xs text-white/80 leading-relaxed mt-1">
            {tFooter("alamat")}
          </p>
          <div className="flex flex-col gap-2 mt-2 text-xs text-white/80">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#E5B80B]" />
              <span>085117654320</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#E5B80B]" />
              <span>ft@uwks.ac.id</span>
            </div>
          </div>
        </div>

        {/* Tautan Cepat */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5B80B] mb-1">
            {tFooter("tautanCepat")}
          </h4>
          <Link href="/sejarah" className="text-xs text-white/70 hover:text-[#E5B80B] transition-colors">
            {tNavbar("sejarah")}
          </Link>
          <Link href="/visi-misi" className="text-xs text-white/70 hover:text-[#E5B80B] transition-colors">
            {tNavbar("visiMisi")}
          </Link>
          <Link href="/struktur-organisasi" className="text-xs text-white/70 hover:text-[#E5B80B] transition-colors">
            {tNavbar("strukturOrganisasi")}
          </Link>
          <Link href="/pimpinan-fakultas" className="text-xs text-white/70 hover:text-[#E5B80B] transition-colors">
            {tNavbar("pimpinanFakultas")}
          </Link>
          <Link href="/dosen" className="text-xs text-white/70 hover:text-[#E5B80B] transition-colors">
            {tNavbar("dosen")}
          </Link>
          <Link href="/tenaga-kependidikan" className="text-xs text-white/70 hover:text-[#E5B80B] transition-colors">
            {tNavbar("tenagaKependidikan")}
          </Link>
        </div>

        {/* Program Studi */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5B80B] mb-1">
            {tFooter("programStudi")}
          </h4>
          <a
            href="https://ts.uwks.ac.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/70 hover:text-[#E5B80B] transition-colors"
          >
            {tNavbar("sipil")}
          </a>
          <a
            href="https://if.uwks.ac.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/70 hover:text-[#E5B80B] transition-colors"
          >
            {tNavbar("informatika")}
          </a>
          <a
            href="https://tip.uwks.ac.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/70 hover:text-[#E5B80B] transition-colors"
          >
            {tNavbar("tip")}
          </a>
        </div>

        {/* Social Media & Stats */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5B80B] mb-1">
            {tFooter("mediaSosial")}
          </h4>
          {socialPlatforms.length > 0 ? (
            <div className="flex gap-3 flex-wrap">
              {socialPlatforms.map((p) => (
                <a
                  key={p.key}
                  href={p.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={p.label}
                  title={p.label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E5B80B] hover:text-[#002347] transition-all duration-300 text-white hover:-translate-y-0.5"
                >
                  {p.icon}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/50 italic">{tFooter("mediaSosialKosong")}</p>
          )}

          <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5B80B] mt-2 mb-1">
            {tFooter("statistik")}
          </h4>
          <div className="bg-white/10 p-3 rounded-lg border border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-white/80">
                <Users className="w-3.5 h-3.5 text-[#E5B80B]" />
                <span>{tFooter("totalPengunjung")}</span>
              </div>
              <span className="text-xs font-bold text-[#E5B80B]">
                {visitorStats.totalVisitors.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-2">
              <span className="text-xs text-white/60">{tFooter("hariIni")}</span>
              <span className="text-xs font-semibold text-white/80">
                {visitorStats.todayVisitors.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-white/10 text-center px-6">
        <p className="text-xs text-white/60">
          {tFooter("hakCipta", { year: currentYear })}
        </p>
      </div>
    </footer>
  );
}
