"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  History,
  Eye,
  GitFork,
  Users,
  GraduationCap,
  BadgeCheck,
} from "lucide-react";

const profilNavItems = [
  { href: "/sejarah", label: "Sejarah", icon: History },
  { href: "/visi-misi", label: "Visi & Misi", icon: Eye },
  { href: "/struktur-organisasi", label: "Struktur Organisasi", icon: GitFork },
  { href: "/pimpinan-fakultas", label: "Pimpinan Fakultas", icon: Users },
  { href: "/dosen", label: "Dosen Pengajar", icon: GraduationCap },
  { href: "/tenaga-kependidikan", label: "Tenaga Kependidikan", icon: BadgeCheck },
];

export default function ProfilSidebar() {
  const pathname = usePathname();

  return (
    <aside className="col-span-12 lg:col-span-3 self-start sticky top-24">
      <div className="bg-[#F8F9FA] rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col">
        <div className="flex items-center mb-6">
          <div className="w-1.5 h-10 bg-[#E5B80B] mr-3 rounded-full flex-shrink-0" />
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-[#002347] leading-tight uppercase font-sans">
              PROFIL
            </h3>
            <h3 className="text-xl font-bold text-[#002347] leading-tight uppercase font-sans">
              FAKULTAS
            </h3>
          </div>
        </div>

        <ul className="flex flex-col gap-1.5">
          {profilNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all gap-3 ${
                    active
                      ? "bg-[#002C5F] text-white shadow-sm font-semibold"
                      : "text-slate-600 hover:bg-slate-200/60 hover:text-[#002347]"
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-[#E5B80B]" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
