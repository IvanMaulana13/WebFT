"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Trophy,
  Handshake,
  GraduationCap,
  BookUser,
  Users2,
  Building2,
  Users,
  Settings2,
  LogOut,
  GraduationCap as AkademikIcon,
  ChevronDown,
  ChevronRight,
  Calendar,
  BookOpen,
  CalendarDays,
  Award,
  ClipboardList,
  Database,
} from "lucide-react";

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Berita",
    href: "/dashboard/berita",
    icon: Newspaper,
  },
  {
    title: "Prestasi",
    href: "/dashboard/prestasi",
    icon: Trophy,
  },
  {
    title: "Kemitraan",
    href: "/dashboard/kemitraan",
    icon: Handshake,
  },
  {
    title: "Data Dosen",
    href: "/dashboard/dosen",
    icon: GraduationCap,
  },
  {
    title: "Tenaga Pendidikan",
    href: "/dashboard/tenaga-pendidikan",
    icon: BookUser,
  },
  {
    title: "Pimpinan Fakultas",
    href: "/dashboard/pimpinan",
    icon: Building2,
  },
  {
    title: "Struktur Org",
    href: "/dashboard/struktur",
    icon: Users2,
  },
];

const akademikSubItems = [
  {
    title: "Kalender Akademik",
    href: "/dashboard/akademik/kalender",
    icon: Calendar,
  },
  {
    title: "Pedoman Akademik",
    href: "/dashboard/akademik/pedoman",
    icon: BookOpen,
  },
  {
    title: "Jadwal Perkuliahan",
    href: "/dashboard/akademik/jadwal",
    icon: CalendarDays,
  },
  {
    title: "Akreditasi",
    href: "/dashboard/akademik/akreditasi",
    icon: Award,
  },
  {
    title: "Prosedur Akademik",
    href: "/dashboard/akademik/prosedur",
    icon: ClipboardList,
  },
];

const adminItems = [
  {
    title: "Manajemen User",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Pengaturan Situs",
    href: "/dashboard/pengaturan",
    icon: Settings2,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "super_admin";

  // Auto-expand Akademik group jika sedang di halaman akademik
  const isInAkademik = pathname.startsWith("/dashboard/akademik");
  const [akademikOpen, setAkademikOpen] = useState(isInAkademik);

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden p-0.5 shrink-0">
            <Image
              src="/logo-uwks.png"
              alt="Logo UWKS"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <div className="font-bold text-sm">CMS FT UWKS</div>
            <div className="text-xs text-gray-400">Dashboard Admin</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.title}
              </Link>
            );
          })}

          {/* ─── Akademik Collapsible Group ─── */}
          <div>
            <button
              id="sidebar-akademik-toggle"
              onClick={() => setAkademikOpen((o) => !o)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isInAkademik
                  ? "bg-blue-600/20 text-blue-300"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <AkademikIcon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">Akademik</span>
              {akademikOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {akademikOpen && (
              <div className="ml-3 mt-0.5 pl-3 border-l border-gray-700 space-y-0.5">
                {akademikSubItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-blue-600 text-white font-medium"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      {item.title}
                    </Link>
                  );
                })}

                {/* Program Studi — Super Admin only */}
                {isSuperAdmin && (
                  <Link
                    href="/dashboard/akademik/program-studi"
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors",
                      pathname.startsWith("/dashboard/akademik/program-studi")
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    )}
                  >
                    <Database className="w-3.5 h-3.5 flex-shrink-0" />
                    Program Studi
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Admin Section */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Admin
          </p>
          <div className="space-y-1">
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          id="sidebar-logout-btn"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
