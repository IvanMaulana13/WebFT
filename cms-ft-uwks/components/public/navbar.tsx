"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/public/language-switcher";
import GlobalSearch from "@/components/public/global-search";
import {
  Menu,
  X,
  Search,
  ChevronRight,
  ChevronDown,
  Home,
  Landmark,
  GraduationCap,
  FlaskConical,
  Users,
  Award,
  UserCheck,
  Info,
} from "lucide-react";

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProfilOpen, setMobileProfilOpen] = useState(false);
  const [mobileAkademikOpen, setMobileAkademikOpen] = useState(false);
  const [mobilePenelitianOpen, setMobilePenelitianOpen] = useState(false);
  const [mobileKemahasiswaanOpen, setMobileKemahasiswaanOpen] = useState(false);
  const [mobileMutuOpen, setMobileMutuOpen] = useState(false);
  const [mobileAlumniOpen, setMobileAlumniOpen] = useState(false);
  const [mobileInformasiOpen, setMobileInformasiOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const t = useTranslations("navbar");
  const tSearch = useTranslations("search");
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* ── Mobile Nav Header (Fixed Top) ── */}
      <div className="md:hidden">
        <header className="bg-white border-b border-slate-200 w-full z-50 fixed top-0 left-0 right-0">
          <div className="flex justify-between items-center w-full px-4 h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-uwks.png"
                alt="UWKS Logo"
                width={32}
                height={32}
                className="h-8 w-auto object-contain"
              />
              <span className="text-lg font-bold text-[#002347] font-sans">
                FT UWKS
              </span>
            </Link>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                aria-label={mobileSearchOpen ? tSearch("close") : tSearch("placeholder")}
              >
                {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
              <LanguageSwitcher />
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Buka Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar Dropdown */}
          {mobileSearchOpen && (
            <div className="border-t border-slate-200 bg-white px-4 py-2.5 shadow-md animate-in fade-in-50 duration-150">
              <GlobalSearch isMobile onClose={() => setMobileSearchOpen(false)} />
            </div>
          )}
        </header>

        {/* Mobile Side Drawer Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <nav className="relative w-80 max-w-full bg-[#002347] text-white flex flex-col py-6 px-4 h-full overflow-y-auto z-10 shadow-2xl ml-auto">
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                <span className="font-bold text-sm text-[#E5B80B]">{t("menuUtama")}</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Language Switcher on Mobile Drawer */}
              <div className="mb-4">
                <LanguageSwitcher isMobile />
              </div>

              <div className="flex flex-col gap-1">
                {/* 1. BERANDA */}
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase transition-colors ${
                    isActive("/") ? "bg-[#002C5F] text-[#E5B80B]" : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Home className="w-4 h-4" /> {t("beranda")}
                </Link>

                {/* 2. PROFIL */}
                <div>
                  <button
                    onClick={() => setMobileProfilOpen(!mobileProfilOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold uppercase text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <Landmark className="w-4 h-4" /> {t("profil")}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        mobileProfilOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {mobileProfilOpen && (
                    <div className="ml-4 pl-3 border-l border-white/20 flex flex-col gap-1 my-1">
                      <Link href="/sejarah" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B]">
                        {t("sejarah")}
                      </Link>
                      <Link href="/visi-misi" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B]">
                        {t("visiMisi")}
                      </Link>
                      <Link href="/struktur-organisasi" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B]">
                        {t("strukturOrganisasi")}
                      </Link>
                      <Link href="/pimpinan-fakultas" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B]">
                        {t("pimpinanFakultas")}
                      </Link>
                      <Link href="/dosen" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B]">
                        {t("dosen")}
                      </Link>
                      <Link href="/tenaga-kependidikan" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B]">
                        {t("tenagaKependidikan")}
                      </Link>
                    </div>
                  )}
                </div>

                {/* 3. AKADEMIK */}
                <div>
                  <button
                    onClick={() => setMobileAkademikOpen(!mobileAkademikOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold uppercase text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <GraduationCap className="w-4 h-4" /> {t("akademik")}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        mobileAkademikOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {mobileAkademikOpen && (
                    <div className="ml-4 pl-3 border-l border-white/20 flex flex-col gap-1 my-1">
                      <span className="py-1 text-xs font-bold text-[#E5B80B] uppercase">
                        {t("programStudi")}
                      </span>
                      <a
                        href="https://ts.uwks.ac.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1 pl-2 text-xs text-white/80 hover:text-[#E5B80B] transition-colors"
                      >
                        • {t("sipil")}
                      </a>
                      <a
                        href="https://if.uwks.ac.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1 pl-2 text-xs text-white/80 hover:text-[#E5B80B] transition-colors"
                      >
                        • {t("informatika")}
                      </a>
                      <a
                        href="https://tip.uwks.ac.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1 pl-2 text-xs text-white/80 hover:text-[#E5B80B] transition-colors"
                      >
                        • {t("tip")}
                      </a>
                      <Link
                        href="/akademik/kalender"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B] transition-colors"
                      >
                        {t("kalenderAkademik")}
                      </Link>
                      <Link
                        href="/akademik/pedoman"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B] transition-colors"
                      >
                        {t("pedomanAkademik")}
                      </Link>
                      <Link
                        href="/akademik/jadwal-perkuliahan"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B] transition-colors"
                      >
                        {t("jadwalPerkuliahan")}
                      </Link>
                      <Link
                        href="/akademik/akreditasi"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B] transition-colors"
                      >
                        {t("akreditasi")}
                      </Link>
                      <Link
                        href="/akademik/prosedur"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B] transition-colors"
                      >
                        {t("prosedurAkademik")}
                      </Link>
                    </div>
                  )}
                </div>

                {/* 4. PENELITIAN & PENGABDIAN */}
                <div>
                  <button
                    onClick={() => setMobilePenelitianOpen(!mobilePenelitianOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold uppercase text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <FlaskConical className="w-4 h-4" /> {t("penelitian")}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobilePenelitianOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobilePenelitianOpen && (
                    <div className="ml-4 pl-3 border-l border-white/20 flex flex-col gap-1 my-1 text-xs text-white/80">
                      <span className="py-1.5">{t("roadmap")}</span>
                      <span className="py-1.5">{t("penelitianSub")}</span>
                      <span className="py-1.5">{t("pengabdianSub")}</span>
                      <span className="py-1.5">{t("jurnalSub")}</span>
                      <span className="py-1.5">{t("sdgsSub")}</span>
                    </div>
                  )}
                </div>

                {/* 5. KEMAHASISWAAN */}
                <div>
                  <button
                    onClick={() => setMobileKemahasiswaanOpen(!mobileKemahasiswaanOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold uppercase text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <Users className="w-4 h-4" /> {t("kemahasiswaan")}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileKemahasiswaanOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileKemahasiswaanOpen && (
                    <div className="ml-4 pl-3 border-l border-white/20 flex flex-col gap-1 my-1 text-xs text-white/80">
                      <Link href="/kemahasiswaan/ormawa" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#E5B80B] transition-colors">
                        {t("ormawa")}
                      </Link>
                      <Link href="/kemahasiswaan/prestasi" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#E5B80B] transition-colors">
                        {t("prestasiMahasiswa")}
                      </Link>
                      <Link href="/kemahasiswaan/beasiswa" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#E5B80B] transition-colors">
                        {t("beasiswa")}
                      </Link>
                      <Link href="/kemahasiswaan/lomba" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#E5B80B] transition-colors">
                        {t("lomba")}
                      </Link>
                      <Link href="/kemahasiswaan/kegiatan" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#E5B80B] transition-colors">
                        {t("kegiatan")}
                      </Link>
                      <Link href="/kemahasiswaan/konseling" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#E5B80B] transition-colors">
                        {t("konseling")}
                      </Link>
                    </div>
                  )}
                </div>

                {/* 6. PENJAMINAN MUTU */}
                <div>
                  <button
                    onClick={() => setMobileMutuOpen(!mobileMutuOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold uppercase text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <Award className="w-4 h-4" /> {t("mutu")}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileMutuOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileMutuOpen && (
                    <div className="ml-4 pl-3 border-l border-white/20 flex flex-col gap-1 my-1 text-xs text-white/80">
                      <span className="py-1.5">{t("evaluasiPembelajaran")}</span>
                      <span className="py-1.5">{t("spmi")}</span>
                      <span className="py-1.5">{t("ami")}</span>
                      <span className="py-1.5">{t("rencanaTindakLanjut")}</span>
                      <span className="py-1.5">{t("rtm")}</span>
                      <span className="py-1.5">{t("kepuasanLayanan")}</span>
                    </div>
                  )}
                </div>

                {/* 7. ALUMNI */}
                <div>
                  <button
                    onClick={() => setMobileAlumniOpen(!mobileAlumniOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold uppercase text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <UserCheck className="w-4 h-4" /> {t("alumni")}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileAlumniOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileAlumniOpen && (
                    <div className="ml-4 pl-3 border-l border-white/20 flex flex-col gap-1 my-1 text-xs text-white/80">
                      <span className="py-1.5">{t("komfak")}</span>
                      <span className="py-1.5">{t("prominentAlumni")}</span>
                      <span className="py-1.5">{t("tracerStudy")}</span>
                      <span className="py-1.5">{t("tracerAlumni")}</span>
                      <span className="py-1.5">{t("karir")}</span>
                    </div>
                  )}
                </div>

                {/* 8. INFORMASI */}
                <div>
                  <button
                    onClick={() => setMobileInformasiOpen(!mobileInformasiOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold uppercase text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <Info className="w-4 h-4" /> {t("informasi")}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileInformasiOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileInformasiOpen && (
                    <div className="ml-4 pl-3 border-l border-white/20 flex flex-col gap-1 my-1 text-xs text-white/80">
                      <span className="py-1.5">{t("fasilitas")}</span>
                      <span className="py-1.5">{t("pmb")}</span>
                      <span className="py-1.5">{t("konsultasiTeknik")}</span>
                      <span className="py-1.5">{t("lowongan")}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                <a
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block text-center bg-[#E5B80B] text-[#002347] font-bold py-2.5 rounded uppercase text-xs tracking-wider hover:bg-[#d4a800] transition-colors"
                >
                  {t("portalAdmin")}
                </a>
              </div>
            </nav>
          </div>
        )}
        <div className="h-16" />
      </div>

      {/* ── Desktop Nav Wrapper ── */}
      <header className="hidden md:block w-full z-50">
        {/* Top Header Logo Bar */}
        <div className="bg-white w-full border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo-uwks.png"
                alt="UWKS Logo"
                width={48}
                height={48}
                className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col -space-y-0.5">
                <h1 className="text-[17px] font-bold text-[#002347] font-sans uppercase leading-tight tracking-tight">
                  {t("title1")}
                </h1>
                <h2 className="text-[17px] font-bold text-[#002347] font-sans uppercase leading-tight tracking-tight">
                  {t("title2")}
                </h2>
              </div>
            </Link>

            <div className="flex items-center gap-4 lg:gap-6">
              <LanguageSwitcher />
              <GlobalSearch />
            </div>
          </div>
        </div>

        {/* Blue Navigation Bar */}
        <nav className="bg-[#002347] w-full h-14 relative shadow-md">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 h-full flex items-center justify-between">
            {/* 1. BERANDA */}
            <Link
              href="/"
              className={`h-full flex items-center px-3 lg:px-3.5 text-[11px] lg:text-xs font-bold uppercase transition-colors whitespace-nowrap ${
                isActive("/")
                  ? "text-[#E5B80B] border-b-2 border-[#E5B80B]"
                  : "text-white hover:text-[#E5B80B] nav-link-hover"
              }`}
            >
              {t("beranda")}
            </Link>

            {/* 2. PROFIL Dropdown */}
            <div className="dropdown h-full relative group">
              <button className="nav-link-hover text-white hover:text-[#E5B80B] transition-colors h-full flex items-center px-3 lg:px-3.5 text-[11px] lg:text-xs font-bold uppercase whitespace-nowrap">
                {t("profil")}
              </button>
              <div className="dropdown-menu hidden group-hover:block absolute top-full left-0 w-64 bg-white shadow-xl py-2 z-50 border-t-2 border-[#E5B80B] rounded-b-lg border-x border-b border-slate-100">
                <Link
                  href="/sejarah"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  {t("sejarah")}
                </Link>
                <Link
                  href="/visi-misi"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  {t("visiMisi")}
                </Link>
                <Link
                  href="/struktur-organisasi"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  {t("strukturOrganisasi")}
                </Link>
                <Link
                  href="/pimpinan-fakultas"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  {t("pimpinanFakultas")}
                </Link>
                <Link
                  href="/dosen"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  {t("dosen")}
                </Link>
                <Link
                  href="/tenaga-kependidikan"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  {t("tenagaKependidikan")}
                </Link>
              </div>
            </div>

            {/* 3. AKADEMIK Dropdown */}
            <div className="dropdown h-full relative group">
              <button className="nav-link-hover text-white hover:text-[#E5B80B] transition-colors h-full flex items-center px-3 lg:px-3.5 text-[11px] lg:text-xs font-bold uppercase whitespace-nowrap">
                {t("akademik")}
              </button>
              <div className="dropdown-menu hidden group-hover:block absolute top-full left-0 w-64 bg-white shadow-xl py-2 z-50 border-t-2 border-[#E5B80B] rounded-b-lg border-x border-b border-slate-100">
                <div className="submenu relative group/sub">
                  <div className="flex items-center justify-between px-4 py-2 text-slate-800 hover:bg-slate-50 transition-colors text-xs font-medium cursor-pointer">
                    <span>{t("programStudi")}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </div>
                  <div className="submenu-menu hidden group-hover/sub:block absolute top-0 left-full w-64 bg-white shadow-xl py-2 z-50 border-l-2 border-[#E5B80B] border-y border-r border-slate-100 rounded-r-lg">
                    <a
                      href="https://ts.uwks.ac.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-xs font-bold text-[#002347] hover:bg-slate-50 hover:text-[#E5B80B] transition-colors"
                    >
                      {t("sipil")}
                    </a>
                    <a
                      href="https://if.uwks.ac.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-xs font-bold text-[#002347] hover:bg-slate-50 hover:text-[#E5B80B] transition-colors"
                    >
                      {t("informatika")}
                    </a>
                    <a
                      href="https://tip.uwks.ac.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-xs font-bold text-[#002347] hover:bg-slate-50 hover:text-[#E5B80B] transition-colors"
                    >
                      {t("tip")}
                    </a>
                  </div>
                </div>
                <Link
                  href="/akademik/kalender"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  {t("kalenderAkademik")}
                </Link>
                <Link
                  href="/akademik/pedoman"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  {t("pedomanAkademik")}
                </Link>
                <Link
                  href="/akademik/jadwal-perkuliahan"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  {t("jadwalPerkuliahan")}
                </Link>
                <Link
                  href="/akademik/akreditasi"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  {t("akreditasi")}
                </Link>
                <Link
                  href="/akademik/prosedur"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  {t("prosedurAkademik")}
                </Link>
              </div>
            </div>

            {/* 4. PENELITIAN & PENGABDIAN */}
            <div className="dropdown h-full relative group">
              <button className="nav-link-hover text-white hover:text-[#E5B80B] transition-colors h-full flex items-center px-3 lg:px-3.5 text-[11px] lg:text-xs font-bold uppercase whitespace-nowrap">
                {t("penelitian")}
              </button>
              <div className="dropdown-menu hidden group-hover:block absolute top-full left-0 w-64 bg-white shadow-xl py-2 z-50 border-t-2 border-[#E5B80B] rounded-b-lg border-x border-b border-slate-100">
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("roadmap")}</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("penelitianSub")}</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("pengabdianSub")}</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("jurnalSub")}</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("sdgsSub")}</span>
              </div>
            </div>

            {/* 5. KEMAHASISWAAN */}
            <div className="dropdown h-full relative group">
              <button className="nav-link-hover text-white hover:text-[#E5B80B] transition-colors h-full flex items-center px-3 lg:px-3.5 text-[11px] lg:text-xs font-bold uppercase whitespace-nowrap">
                {t("kemahasiswaan")}
              </button>
              <div className="dropdown-menu hidden group-hover:block absolute top-full left-0 w-64 bg-white shadow-xl py-2 z-50 border-t-2 border-[#E5B80B] rounded-b-lg border-x border-b border-slate-100">
                <Link
                  href="/kemahasiswaan/ormawa"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  {t("ormawa")}
                </Link>
                <Link
                  href="/kemahasiswaan/prestasi"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  {t("prestasiMahasiswa")}
                </Link>
                <Link
                  href="/kemahasiswaan/beasiswa"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  {t("beasiswa")}
                </Link>
                <Link
                  href="/kemahasiswaan/lomba"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  {t("lomba")}
                </Link>
                <Link
                  href="/kemahasiswaan/kegiatan"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  {t("kegiatan")}
                </Link>
                <Link
                  href="/kemahasiswaan/konseling"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  {t("konseling")}
                </Link>
              </div>
            </div>

            {/* 6. PENJAMINAN MUTU */}
            <div className="dropdown h-full relative group">
              <button className="nav-link-hover text-white hover:text-[#E5B80B] transition-colors h-full flex items-center px-3 lg:px-3.5 text-[11px] lg:text-xs font-bold uppercase whitespace-nowrap">
                {t("mutu")}
              </button>
              <div className="dropdown-menu hidden group-hover:block absolute top-full left-0 w-64 bg-white shadow-xl py-2 z-50 border-t-2 border-[#E5B80B] rounded-b-lg border-x border-b border-slate-100">
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("evaluasiPembelajaran")}</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("spmi")}</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("ami")}</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("rencanaTindakLanjut")}</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("rtm")}</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("kepuasanLayanan")}</span>
              </div>
            </div>

            {/* 7. ALUMNI */}
            <div className="dropdown h-full relative group">
              <button className="nav-link-hover text-white hover:text-[#E5B80B] transition-colors h-full flex items-center px-3 lg:px-3.5 text-[11px] lg:text-xs font-bold uppercase whitespace-nowrap">
                {t("alumni")}
              </button>
              <div className="dropdown-menu hidden group-hover:block absolute top-full left-0 w-64 bg-white shadow-xl py-2 z-50 border-t-2 border-[#E5B80B] rounded-b-lg border-x border-b border-slate-100">
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("komfak")}</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("prominentAlumni")}</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("tracerStudy")}</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("tracerAlumni")}</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("karir")}</span>
              </div>
            </div>

            {/* 8. INFORMASI */}
            <div className="dropdown h-full relative group">
              <button className="nav-link-hover text-white hover:text-[#E5B80B] transition-colors h-full flex items-center px-3 lg:px-3.5 text-[11px] lg:text-xs font-bold uppercase whitespace-nowrap">
                {t("informasi")}
              </button>
              <div className="dropdown-menu hidden group-hover:block absolute top-full right-0 w-64 bg-white shadow-xl py-2 z-50 border-t-2 border-[#E5B80B] rounded-b-lg border-x border-b border-slate-100">
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("fasilitas")}</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("pmb")}</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("konsultasiTeknik")}</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">{t("lowongan")}</span>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
