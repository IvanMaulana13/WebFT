"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  Newspaper,
  Trophy,
  Handshake,
  GraduationCap,
  Building2,
  Activity,
  Users,
  LayoutGrid,
  RefreshCw,
  Loader2,
  ImageIcon,
  ExternalLink,
  Globe,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface DashboardStats {
  beritaPublished: number;
  beritaDraft: number;
  prestasi: number;
  kemitraan: number;
  dosen: number;
  tenagaPendidikan: number;
  pimpinan: number;
  informasiPublished: number;
  totalVisitors: number;
  todayVisitors: number;
}

interface ActivityItem {
  id: number;
  action: string;
  module: string;
  detail: string | null;
  createdAt: string;
  userName: string | null;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  strukturImage: string | null;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
async function fetchStats(): Promise<DashboardData> {
  const res = await fetch("/api/dashboard/stats");
  if (!res.ok) throw new Error("Gagal mengambil statistik");
  return res.json();
}

/** Format waktu relatif dari ISO string */
function timeAgo(isoString: string): string {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} hari lalu`;
  return new Date(isoString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Label module → human-readable */
function moduleLabel(module: string): string {
  const map: Record<string, string> = {
    berita: "Berita",
    dosen: "Data Dosen",
    prestasi: "Prestasi",
    kemitraan: "Kemitraan",
    informasi: "Informasi",
    tenaga_pendidikan: "Tenaga Pendidikan",
    pimpinan_fakultas: "Pimpinan Fakultas",
    struktur_organisasi: "Struktur Organisasi",
    auth: "Autentikasi",
    users: "Manajemen User",
  };
  return map[module] ?? module;
}

/** Label action → human-readable */
function actionLabel(action: string): string {
  const map: Record<string, string> = {
    create: "menambahkan",
    update: "memperbarui",
    delete: "menghapus",
    login_success: "masuk ke",
    login_failed: "gagal masuk ke",
  };
  return map[action] ?? action;
}

/** Action → badge color */
function actionColor(action: string): string {
  if (action === "create") return "bg-green-100 text-green-700";
  if (action === "update") return "bg-blue-100 text-blue-700";
  if (action === "delete") return "bg-red-100 text-red-700";
  if (action === "login_success") return "bg-gray-100 text-gray-600";
  return "bg-gray-100 text-gray-500";
}

/** User initials for avatar */
function initials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** User avatar background color (stable per name) */
function avatarColor(name: string | null): string {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-amber-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
  ];
  if (!name) return "bg-gray-400";
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

// ─────────────────────────────────────────────
// Stat Card Component
// ─────────────────────────────────────────────
interface StatCardProps {
  icon: React.ElementType;
  value: number | string;
  label: string;
  sub: string;
  iconBg: string;
  iconColor: string;
  href?: string;
}

function StatCard({ icon: Icon, value, label, sub, iconBg, iconColor, href }: StatCardProps) {
  const inner = (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md hover:border-gray-300 transition-all duration-200 group">
      <div className={`${iconBg} ${iconColor} p-3 rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-bold text-gray-800 tabular-nums">{value}</div>
        <div className="text-sm font-medium text-gray-700 truncate">{label}</div>
        <div className="text-xs text-gray-400 truncate">{sub}</div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }
  return inner;
}

// ─────────────────────────────────────────────
// Skeleton loader
// ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-6 bg-gray-200 rounded w-12" />
        <div className="h-4 bg-gray-100 rounded w-24" />
        <div className="h-3 bg-gray-100 rounded w-16" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function DashboardOverviewPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchStats,
    refetchInterval: 60_000, // auto-refresh tiap 1 menit
    staleTime: 30_000,
  });

  const stats = data?.stats;
  const activity = data?.recentActivity ?? [];
  const strukturImage = data?.strukturImage ?? null;

  // Build stat cards from live data
  const statCards: StatCardProps[] = stats
    ? [
        {
          icon: Newspaper,
          value: stats.beritaPublished + stats.beritaDraft,
          label: "Total Berita",
          sub: `${stats.beritaPublished} published · ${stats.beritaDraft} draft`,
          iconBg: "bg-blue-50",
          iconColor: "text-blue-600",
          href: "/dashboard/berita",
        },
        {
          icon: FileText,
          value: stats.informasiPublished,
          label: "Informasi",
          sub: "Published",
          iconBg: "bg-indigo-50",
          iconColor: "text-indigo-600",
          href: "/dashboard/informasi",
        },
        {
          icon: Trophy,
          value: stats.prestasi,
          label: "Total Prestasi",
          sub: "Nasional & Internasional",
          iconBg: "bg-amber-50",
          iconColor: "text-amber-600",
          href: "/dashboard/prestasi",
        },
        {
          icon: Handshake,
          value: stats.kemitraan,
          label: "Total Mitra",
          sub: "Kemitraan aktif",
          iconBg: "bg-green-50",
          iconColor: "text-green-600",
          href: "/dashboard/kemitraan",
        },
        {
          icon: GraduationCap,
          value: stats.dosen,
          label: "Dosen Aktif",
          sub: "Dari seluruh prodi",
          iconBg: "bg-purple-50",
          iconColor: "text-purple-600",
          href: "/dashboard/dosen",
        },
        {
          icon: Users,
          value: stats.tenagaPendidikan,
          label: "Tenaga Pendidikan",
          sub: "Staf kependidikan",
          iconBg: "bg-cyan-50",
          iconColor: "text-cyan-600",
          href: "/dashboard/tenaga-pendidikan",
        },
        {
          icon: Building2,
          value: stats.pimpinan,
          label: "Pimpinan Fakultas",
          sub: "Struktur aktif",
          iconBg: "bg-red-50",
          iconColor: "text-red-600",
          href: "/dashboard/pimpinan",
        },
        {
          icon: Globe,
          value: stats.totalVisitors.toLocaleString("id-ID"),
          label: "Total Pengunjung",
          sub: `Hari ini: ${stats.todayVisitors.toLocaleString("id-ID")} pengunjung unik`,
          iconBg: "bg-teal-50",
          iconColor: "text-teal-600",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">
            Statistik konten dan aktivitas terkini CMS Fakultas Teknik UWKS
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {isFetching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh
        </button>
      </div>

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          Gagal memuat statistik. Pastikan koneksi database aktif dan{" "}
          <button
            className="underline font-medium"
            onClick={() => refetch()}
          >
            coba lagi
          </button>
          .
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)
          : statCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
      </div>

      {/* Bottom Section: Activity + Struktur */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Recent Activity ── */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-800">
              Aktivitas Terkini
            </h2>
            <span className="ml-auto text-xs text-gray-400">10 terakhir</span>
          </div>

          <div className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : activity.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-gray-400">
                Belum ada aktivitas tercatat.
              </div>
            ) : (
              activity.map((log) => (
                <div key={log.id} className="flex items-start gap-3 px-6 py-3 hover:bg-gray-50/50 transition-colors">
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full ${avatarColor(log.userName)} flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold`}
                  >
                    {initials(log.userName)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-snug">
                      <span className="font-medium">
                        {log.userName ?? "Sistem"}
                      </span>{" "}
                      {actionLabel(log.action)}{" "}
                      <span className="font-medium">
                        {moduleLabel(log.module)}
                      </span>
                      {log.detail && (
                        <span className="text-gray-400 text-xs block mt-0.5 truncate">
                          {log.detail}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${actionColor(log.action)}`}
                    >
                      {log.action}
                    </span>
                    <span className="text-[11px] text-gray-400 whitespace-nowrap">
                      {timeAgo(log.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Struktur Organisasi Card ── */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-800">
              Struktur Organisasi
            </h2>
          </div>

          <div className="flex-1 p-5 flex flex-col gap-4">
            {isLoading ? (
              <div className="w-full aspect-video rounded-lg bg-gray-200 animate-pulse" />
            ) : strukturImage ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <Image
                  src={strukturImage}
                  alt="Struktur Organisasi FT UWKS"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 bg-gray-50">
                <ImageIcon className="w-8 h-8" />
                <p className="text-xs text-center">
                  Belum ada gambar struktur organisasi
                </p>
              </div>
            )}

            <Link
              href="/dashboard/struktur"
              className="flex items-center justify-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {strukturImage ? "Ganti Gambar" : "Upload Gambar"}
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <LayoutGrid className="w-5 h-5" />
          <h2 className="text-base font-semibold">Navigasi Cepat</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {[
            { label: "Berita", href: "/dashboard/berita" },
            { label: "Informasi", href: "/dashboard/informasi" },
            { label: "Prestasi", href: "/dashboard/prestasi" },
            { label: "Kemitraan", href: "/dashboard/kemitraan" },
            { label: "Dosen", href: "/dashboard/dosen" },
            { label: "Tenaga Pendidikan", href: "/dashboard/tenaga-pendidikan" },
            { label: "Pimpinan", href: "/dashboard/pimpinan" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors text-center"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
