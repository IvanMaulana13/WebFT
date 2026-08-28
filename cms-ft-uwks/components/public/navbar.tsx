"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Globe,
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
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-full"
              aria-label="Buka Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Mobile Side Drawer Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <nav className="relative w-80 max-w-full bg-[#002347] text-white flex flex-col py-6 px-4 h-full overflow-y-auto z-10 shadow-2xl ml-auto">
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <span className="font-bold text-sm text-[#E5B80B]">MENU UTAMA</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
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
                  <Home className="w-4 h-4" /> BERANDA
                </Link>

                {/* 2. PROFIL */}
                <div>
                  <button
                    onClick={() => setMobileProfilOpen(!mobileProfilOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold uppercase text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <Landmark className="w-4 h-4" /> PROFIL
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
                        Sejarah
                      </Link>
                      <Link href="/visi-misi" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B]">
                        Visi, Misi dan Tujuan
                      </Link>
                      <Link href="/struktur-organisasi" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B]">
                        Struktur Organisasi
                      </Link>
                      <Link href="/pimpinan-fakultas" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B]">
                        Pimpinan Fakultas
                      </Link>
                      <Link href="/dosen" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B]">
                        Dosen Pengajar
                      </Link>
                      <Link href="/tenaga-kependidikan" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B]">
                        Tenaga Kependidikan
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
                      <GraduationCap className="w-4 h-4" /> AKADEMIK
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
                        Program Studi
                      </span>
                      <a
                        href="https://ts.uwks.ac.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1 pl-2 text-xs text-white/80 hover:text-[#E5B80B] transition-colors"
                      >
                        • Teknik Sipil
                      </a>
                      <a
                        href="https://if.uwks.ac.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1 pl-2 text-xs text-white/80 hover:text-[#E5B80B] transition-colors"
                      >
                        • Informatika
                      </a>
                      <a
                        href="https://tip.uwks.ac.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1 pl-2 text-xs text-white/80 hover:text-[#E5B80B] transition-colors"
                      >
                        • Teknologi Industri Pertanian
                      </a>
                      <Link
                        href="/akademik/kalender"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B] transition-colors"
                      >
                        Kalender Akademik
                      </Link>
                      <Link
                        href="/akademik/pedoman"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B] transition-colors"
                      >
                        Pedoman Akademik
                      </Link>
                      <Link
                        href="/akademik/jadwal-perkuliahan"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B] transition-colors"
                      >
                        Jadwal Perkuliahan
                      </Link>
                      <Link
                        href="/akademik/akreditasi"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B] transition-colors"
                      >
                        Akreditasi
                      </Link>
                      <Link
                        href="/akademik/prosedur"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1.5 text-xs text-white/80 hover:text-[#E5B80B] transition-colors"
                      >
                        Prosedur Akademik
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
                      <FlaskConical className="w-4 h-4" /> PENELITIAN & PENGABDIAN
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobilePenelitianOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobilePenelitianOpen && (
                    <div className="ml-4 pl-3 border-l border-white/20 flex flex-col gap-1 my-1 text-xs text-white/80">
                      <span className="py-1.5">Peta Jalan (RoadMap)</span>
                      <span className="py-1.5">Penelitian</span>
                      <span className="py-1.5">Pengabdian kepada Masyarakat</span>
                      <span className="py-1.5">Pengelola Jurnal dan Seminar Ilmiah</span>
                      <span className="py-1.5">Sustainable Development Goals (SDGs)</span>
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
                      <Users className="w-4 h-4" /> KEMAHASISWAAN
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileKemahasiswaanOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileKemahasiswaanOpen && (
                    <div className="ml-4 pl-3 border-l border-white/20 flex flex-col gap-1 my-1 text-xs text-white/80">
                      <Link href="/kemahasiswaan/ormawa" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#E5B80B] transition-colors">
                        Organisasi Kemahasiswaan
                      </Link>
                      <Link href="/kemahasiswaan/prestasi" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#E5B80B] transition-colors">
                        Prestasi Mahasiswa
                      </Link>
                      <Link href="/kemahasiswaan/beasiswa" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#E5B80B] transition-colors">
                        Informasi Beasiswa
                      </Link>
                      <Link href="/kemahasiswaan/lomba" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#E5B80B] transition-colors">
                        Informasi Lomba Mahasiswa
                      </Link>
                      <Link href="/kemahasiswaan/kegiatan" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#E5B80B] transition-colors">
                        Kegiatan Kemahasiswaan
                      </Link>
                      <Link href="/kemahasiswaan/konseling" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#E5B80B] transition-colors">
                        Layanan Konseling Mahasiswa
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
                      <Award className="w-4 h-4" /> PENJAMINAN MUTU
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileMutuOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileMutuOpen && (
                    <div className="ml-4 pl-3 border-l border-white/20 flex flex-col gap-1 my-1 text-xs text-white/80">
                      <span className="py-1.5">Evaluasi Pembelajaran</span>
                      <span className="py-1.5">Sistem Penjamin Mutu Internal</span>
                      <span className="py-1.5">Audit Mutu Internal</span>
                      <span className="py-1.5">Rencana Tindak Lanjut</span>
                      <span className="py-1.5">Rapat Tinjauan Manajemen</span>
                      <span className="py-1.5">Kepuasan Layanan</span>
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
                      <UserCheck className="w-4 h-4" /> ALUMNI
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileAlumniOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileAlumniOpen && (
                    <div className="ml-4 pl-3 border-l border-white/20 flex flex-col gap-1 my-1 text-xs text-white/80">
                      <span className="py-1.5">Komisariat Fakultas (KOMFAK)</span>
                      <span className="py-1.5">Prominent Alumni</span>
                      <span className="py-1.5">Tracer Study</span>
                      <span className="py-1.5">Tracer Alumni</span>
                      <span className="py-1.5">Pengembangan Karir</span>
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
                      <Info className="w-4 h-4" /> INFORMASI
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileInformasiOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileInformasiOpen && (
                    <div className="ml-4 pl-3 border-l border-white/20 flex flex-col gap-1 my-1 text-xs text-white/80">
                      <span className="py-1.5">Fasilitas</span>
                      <span className="py-1.5">Pendaftaran Mahasiswa Baru</span>
                      <span className="py-1.5">Layanan Konsultasi Teknik</span>
                      <span className="py-1.5">Lowongan Pekerjaan</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block text-center bg-[#E5B80B] text-[#002347] font-bold py-2.5 rounded uppercase text-xs tracking-wider"
                >
                  PORTAL ADMIN
                </Link>
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
                  FAKULTAS TEKNIK
                </h1>
                <h2 className="text-[17px] font-bold text-[#002347] font-sans uppercase leading-tight tracking-tight">
                  UNIVERSITAS WIJAYA KUSUMA SURABAYA
                </h2>
              </div>
            </Link>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 cursor-pointer text-[#002347] font-bold text-xs hover:text-[#E5B80B] transition-colors">
                <Globe className="w-4 h-4" />
                <span>ID</span>
                <span className="font-normal text-slate-400">/EN</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari..."
                  className="bg-slate-50 border border-slate-200 rounded-full pl-4 pr-9 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#002347] w-56 transition-all focus:w-64"
                />
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Blue Navigation Bar (No Down Arrow icons, clean plain text sub-items) */}
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
              BERANDA
            </Link>

            {/* 2. PROFIL Dropdown */}
            <div className="dropdown h-full relative group">
              <button className="nav-link-hover text-white hover:text-[#E5B80B] transition-colors h-full flex items-center px-3 lg:px-3.5 text-[11px] lg:text-xs font-bold uppercase whitespace-nowrap">
                PROFIL
              </button>
              <div className="dropdown-menu hidden group-hover:block absolute top-full left-0 w-64 bg-white shadow-xl py-2 z-50 border-t-2 border-[#E5B80B] rounded-b-lg border-x border-b border-slate-100">
                <Link
                  href="/sejarah"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  Sejarah
                </Link>
                <Link
                  href="/visi-misi"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  Visi, Misi dan Tujuan
                </Link>
                <Link
                  href="/struktur-organisasi"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  Struktur Organisasi
                </Link>
                <Link
                  href="/pimpinan-fakultas"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  Pimpinan Fakultas
                </Link>
                <Link
                  href="/dosen"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  Dosen Pengajar
                </Link>
                <Link
                  href="/tenaga-kependidikan"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  Tenaga Kependidikan
                </Link>
              </div>
            </div>

            {/* 3. AKADEMIK Dropdown */}
            <div className="dropdown h-full relative group">
              <button className="nav-link-hover text-white hover:text-[#E5B80B] transition-colors h-full flex items-center px-3 lg:px-3.5 text-[11px] lg:text-xs font-bold uppercase whitespace-nowrap">
                AKADEMIK
              </button>
              <div className="dropdown-menu hidden group-hover:block absolute top-full left-0 w-64 bg-white shadow-xl py-2 z-50 border-t-2 border-[#E5B80B] rounded-b-lg border-x border-b border-slate-100">
                <div className="submenu relative group/sub">
                  <div className="flex items-center justify-between px-4 py-2 text-slate-800 hover:bg-slate-50 transition-colors text-xs font-medium cursor-pointer">
                    <span>Program Studi</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </div>
                  <div className="submenu-menu hidden group-hover/sub:block absolute top-0 left-full w-64 bg-white shadow-xl py-2 z-50 border-l-2 border-[#E5B80B] border-y border-r border-slate-100 rounded-r-lg">
                    <a
                      href="https://ts.uwks.ac.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-xs font-bold text-[#002347] hover:bg-slate-50 hover:text-[#E5B80B] transition-colors"
                    >
                      Teknik Sipil
                    </a>
                    <a
                      href="https://if.uwks.ac.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-xs font-bold text-[#002347] hover:bg-slate-50 hover:text-[#E5B80B] transition-colors"
                    >
                      Informatika
                    </a>
                    <a
                      href="https://tip.uwks.ac.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-xs font-bold text-[#002347] hover:bg-slate-50 hover:text-[#E5B80B] transition-colors"
                    >
                      Teknologi Industri Pertanian
                    </a>
                  </div>
                </div>
                <Link
                  href="/akademik/kalender"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  Kalender Akademik
                </Link>
                <Link
                  href="/akademik/pedoman"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  Pedoman Akademik
                </Link>
                <Link
                  href="/akademik/jadwal-perkuliahan"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  Jadwal Perkuliahan
                </Link>
                <Link
                  href="/akademik/akreditasi"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  Akreditasi
                </Link>
                <Link
                  href="/akademik/prosedur"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  Prosedur Akademik
                </Link>
              </div>
            </div>

            {/* 4. PENELITIAN & PENGABDIAN */}
            <div className="dropdown h-full relative group">
              <button className="nav-link-hover text-white hover:text-[#E5B80B] transition-colors h-full flex items-center px-3 lg:px-3.5 text-[11px] lg:text-xs font-bold uppercase whitespace-nowrap">
                PENELITIAN & PENGABDIAN
              </button>
              <div className="dropdown-menu hidden group-hover:block absolute top-full left-0 w-64 bg-white shadow-xl py-2 z-50 border-t-2 border-[#E5B80B] rounded-b-lg border-x border-b border-slate-100">
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Peta Jalan (RoadMap)</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Penelitian</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Pengabdian kepada Masyarakat</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Pengelola Jurnal dan Seminar Ilmiah</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Sustainable Development Goals (SDGs)</span>
              </div>
            </div>

            {/* 5. KEMAHASISWAAN */}
            <div className="dropdown h-full relative group">
              <button className="nav-link-hover text-white hover:text-[#E5B80B] transition-colors h-full flex items-center px-3 lg:px-3.5 text-[11px] lg:text-xs font-bold uppercase whitespace-nowrap">
                KEMAHASISWAAN
              </button>
              <div className="dropdown-menu hidden group-hover:block absolute top-full left-0 w-64 bg-white shadow-xl py-2 z-50 border-t-2 border-[#E5B80B] rounded-b-lg border-x border-b border-slate-100">
                <Link
                  href="/kemahasiswaan/ormawa"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  Organisasi Kemahasiswaan
                </Link>
                <Link
                  href="/kemahasiswaan/prestasi"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  Prestasi Mahasiswa
                </Link>
                <Link
                  href="/kemahasiswaan/beasiswa"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  Informasi Beasiswa
                </Link>
                <Link
                  href="/kemahasiswaan/lomba"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  Informasi Lomba Mahasiswa
                </Link>
                <Link
                  href="/kemahasiswaan/kegiatan"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  Kegiatan Kemahasiswaan
                </Link>
                <Link
                  href="/kemahasiswaan/konseling"
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50 hover:text-[#002347] transition-colors text-xs font-medium"
                >
                  Layanan Konseling Mahasiswa
                </Link>
              </div>
            </div>

            {/* 6. PENJAMINAN MUTU */}
            <div className="dropdown h-full relative group">
              <button className="nav-link-hover text-white hover:text-[#E5B80B] transition-colors h-full flex items-center px-3 lg:px-3.5 text-[11px] lg:text-xs font-bold uppercase whitespace-nowrap">
                PENJAMINAN MUTU
              </button>
              <div className="dropdown-menu hidden group-hover:block absolute top-full left-0 w-64 bg-white shadow-xl py-2 z-50 border-t-2 border-[#E5B80B] rounded-b-lg border-x border-b border-slate-100">
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Evaluasi Pembelajaran</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Sistem Penjamin Mutu Internal</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Audit Mutu Internal</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Rencana Tindak Lanjut</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Rapat Tinjauan Manajemen</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Kepuasan Layanan</span>
              </div>
            </div>

            {/* 7. ALUMNI */}
            <div className="dropdown h-full relative group">
              <button className="nav-link-hover text-white hover:text-[#E5B80B] transition-colors h-full flex items-center px-3 lg:px-3.5 text-[11px] lg:text-xs font-bold uppercase whitespace-nowrap">
                ALUMNI
              </button>
              <div className="dropdown-menu hidden group-hover:block absolute top-full left-0 w-64 bg-white shadow-xl py-2 z-50 border-t-2 border-[#E5B80B] rounded-b-lg border-x border-b border-slate-100">
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Komisariat Fakultas (KOMFAK)</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Prominent Alumni</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Tracer Study</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Tracer Alumni</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Pengembangan Karir</span>
              </div>
            </div>

            {/* 8. INFORMASI */}
            <div className="dropdown h-full relative group">
              <button className="nav-link-hover text-white hover:text-[#E5B80B] transition-colors h-full flex items-center px-3 lg:px-3.5 text-[11px] lg:text-xs font-bold uppercase whitespace-nowrap">
                INFORMASI
              </button>
              <div className="dropdown-menu hidden group-hover:block absolute top-full right-0 w-64 bg-white shadow-xl py-2 z-50 border-t-2 border-[#E5B80B] rounded-b-lg border-x border-b border-slate-100">
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Fasilitas</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Pendaftaran Mahasiswa Baru</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Layanan Konsultasi Teknik</span>
                <span className="block px-4 py-2 text-slate-700 text-xs font-medium">Lowongan Pekerjaan</span>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
