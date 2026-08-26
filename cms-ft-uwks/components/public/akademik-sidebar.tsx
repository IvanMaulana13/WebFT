"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  BookOpen,
  CalendarDays,
  Award,
  ClipboardList,
  ChevronDown,
} from "lucide-react";

const akademikNavItems = [
  { href: "/akademik/kalender", label: "Kalender Akademik", icon: Calendar },
  { href: "/akademik/pedoman", label: "Pedoman Akademik", icon: BookOpen },
  { href: "/akademik/jadwal-perkuliahan", label: "Jadwal Perkuliahan", icon: CalendarDays },
  { href: "/akademik/akreditasi", label: "Akreditasi", icon: Award },
  { href: "/akademik/prosedur", label: "Prosedur Akademik", icon: ClipboardList },
];

export default function AkademikSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem =
    akademikNavItems.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    ) || akademikNavItems[0];
  const ActiveIcon = activeItem.icon;

  return (
    <aside className="col-span-12 md:col-span-4 lg:col-span-3 self-start md:sticky md:top-24">
      <div className="bg-[#F8F9FA] rounded-xl border border-slate-200 shadow-sm flex flex-col p-4 md:p-6 transition-all">
        {/* ── Mobile View: Collapsed Header / Accordion Toggle ── */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden flex items-center justify-between w-full text-left gap-3 focus:outline-none"
          aria-expanded={mobileOpen}
          aria-label="Toggle Menu Akademik"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-1.5 h-8 bg-[#E5B80B] rounded-full flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase leading-tight">
                MENU AKADEMIK
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <ActiveIcon className="w-4 h-4 text-[#002C5F] shrink-0" />
                <span className="text-sm font-bold text-[#002347] truncate">
                  {activeItem.label}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#002C5F] text-white rounded-lg text-xs font-semibold shrink-0 shadow-xs">
            <span>{mobileOpen ? "Tutup" : "Pilih Menu"}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                mobileOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* ── Desktop View: Fixed Header with Gold Bar ── */}
        <div className="hidden md:flex items-center mb-6">
          <div className="w-1.5 h-10 bg-[#E5B80B] mr-3 rounded-full flex-shrink-0" />
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-[#002347] leading-tight uppercase font-sans">
              MENU
            </h3>
            <h3 className="text-xl font-bold text-[#002347] leading-tight uppercase font-sans">
              AKADEMIK
            </h3>
          </div>
        </div>

        {/* ── Menu List: Hidden on Mobile when collapsed, Flex on Desktop ── */}
        <ul
          className={`${
            mobileOpen ? "flex mt-4 pt-4 border-t border-slate-200" : "hidden"
          } md:flex flex-col gap-1.5`}
        >
          {akademikNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all gap-3 ${
                    active
                      ? "bg-[#002C5F] text-white shadow-sm font-semibold"
                      : "text-slate-600 hover:bg-slate-200/60 hover:text-[#002347]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      active ? "text-[#E5B80B]" : "text-slate-500"
                    }`}
                  />
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
