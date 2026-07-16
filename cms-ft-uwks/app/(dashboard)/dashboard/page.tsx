import type { Metadata } from "next";
import {
  FileText,
  Newspaper,
  Trophy,
  Handshake,
  GraduationCap,
  Building2,
  TrendingUp,
  Activity,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Overview",
};

const statsCards = [
  {
    title: "Total Berita",
    value: "—",
    sub: "Published / Draft",
    icon: Newspaper,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Total Prestasi",
    value: "—",
    sub: "Nasional & Internasional",
    icon: Trophy,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Total Mitra",
    value: "—",
    sub: "Kemitraan aktif",
    icon: Handshake,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    title: "Dosen Aktif",
    value: "—",
    sub: "Dari seluruh prodi",
    icon: GraduationCap,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "Pimpinan",
    value: "—",
    sub: "Struktur aktif",
    icon: Building2,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    title: "Informasi",
    value: "—",
    sub: "Published",
    icon: FileText,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">
          Selamat datang di CMS Fakultas Teknik UWKS. Data statistik akan
          dimuat setelah koneksi database tersambung (Part 2+).
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow"
            >
              <div className={`${card.bg} ${card.color} p-3 rounded-xl`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {card.value}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {card.title}
                </div>
                <div className="text-xs text-gray-400">{card.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            Aktivitas Terkini
          </h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-3/4" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/4" />
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-4">
          Log aktivitas akan muncul setelah autentikasi diimplementasikan (Part
          2).
        </p>
      </div>

      {/* Quick Links */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Mulai dari sini</h2>
        </div>
        <p className="text-blue-100 text-sm mb-4">
          Project ini sedang dalam fase setup (Part 0). Lanjutkan ke Part 1
          untuk mendefinisikan schema database Drizzle ORM.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Part 1: Schema DB", href: "#" },
            { label: "Part 2: Auth", href: "#" },
            { label: "Part 3: Informasi", href: "#" },
            { label: "Part 4: Berita", href: "#" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors text-center"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
