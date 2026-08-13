"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "#profil" },
  { label: "Akademik", href: "#akademik" },
  { label: "Berita", href: "#berita" },
  { label: "Prestasi", href: "#prestasi" },
  { label: "Kemitraan", href: "#kemitraan" },
  { label: "Kontak", href: "#kontak" },
];

/**
 * Navbar publik — transparan saat di top, solid saat di-scroll.
 */
export default function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/95 shadow-lg shadow-black/20 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-9 w-9 overflow-hidden rounded-lg">
            <Image
              src="/logo-uwks.png"
              alt="Logo FT UWKS"
              fill
              className="object-contain"
              sizes="36px"
            />
          </div>
          <div className="hidden sm:block">
            <span className="block text-sm font-bold leading-tight text-white drop-shadow">
              FT UWKS
            </span>
            <span className="block text-xs text-white/60 leading-tight">
              Fakultas Teknik
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Navigasi utama"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Login CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-500 sm:inline-flex"
          >
            Login Admin
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Buka menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((v) => !v)}
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-slate-900/98 backdrop-blur-md lg:hidden">
          <nav className="flex flex-col px-4 py-3" aria-label="Navigasi mobile">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 border-t border-white/10 pt-3">
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login Admin
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
