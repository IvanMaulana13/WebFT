import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Selamat datang di Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-blue-800">
            FT UWKS
          </Link>
          <ul className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-700 transition-colors">
                Beranda
              </Link>
            </li>
            <li>
              <Link
                href="/visi-misi"
                className="hover:text-blue-700 transition-colors"
              >
                Visi &amp; Misi
              </Link>
            </li>
            <li>
              <Link
                href="/sejarah"
                className="hover:text-blue-700 transition-colors"
              >
                Sejarah
              </Link>
            </li>
            <li>
              <Link
                href="/pimpinan-fakultas"
                className="hover:text-blue-700 transition-colors"
              >
                Pimpinan
              </Link>
            </li>
            <li>
              <Link
                href="/struktur-organisasi"
                className="hover:text-blue-700 transition-colors"
              >
                Struktur Organisasi
              </Link>
            </li>
          </ul>
          <Link
            href="/login"
            className="text-sm font-medium text-white bg-blue-700 px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
          >
            Admin
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p className="font-semibold text-white mb-1">
            Fakultas Teknik — Universitas Wijaya Kusuma Surabaya
          </p>
          <p>
            Jl. Dukuh Kupang XXV No.54, Surabaya · Telp: (031) 5614073
          </p>
          <p className="mt-3">
            &copy; {new Date().getFullYear()} FT UWKS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
