"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  LogOut,
} from "lucide-react";

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Informasi",
    href: "/dashboard/informasi",
    icon: FileText,
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

const adminItems = [
  {
    title: "Manajemen User",
    href: "/dashboard/users",
    icon: Users,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-bold">
            FT
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
        </div>

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
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors">
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
