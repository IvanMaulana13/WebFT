"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const pageTitles: Record<string, { title: string; breadcrumb: string }> = {
  "/akademik/kalender": {
    title: "Kalender Akademik",
    breadcrumb: "KALENDER AKADEMIK",
  },
  "/akademik/pedoman": {
    title: "Pedoman Akademik",
    breadcrumb: "PEDOMAN AKADEMIK",
  },
  "/akademik/jadwal-perkuliahan": {
    title: "Jadwal Perkuliahan",
    breadcrumb: "JADWAL PERKULIAHAN",
  },
  "/akademik/akreditasi": {
    title: "Akreditasi Program Studi",
    breadcrumb: "AKREDITASI",
  },
  "/akademik/prosedur": {
    title: "Prosedur Akademik",
    breadcrumb: "PROSEDUR AKADEMIK",
  },
};

export default function AkademikHeader() {
  const pathname = usePathname();
  const current = pageTitles[pathname] || {
    title: "Akademik Fakultas Teknik",
    breadcrumb: "AKADEMIK",
  };

  return (
    <section className="relative h-64 flex items-center overflow-hidden bg-[#002347] text-white">
      <div className="absolute inset-0 bg-[#002347]/80 z-10" />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAW1U5BTsnUUW4XUtR-Xn70Cc3id4UjSRlakVbeVHB8d-hI_QV5Kb_YcQo3KALsBTxfeMNG6lFLR8AiFNg3KqK_olg05tLYuPbP2ZknQ-QunlHgTN4OIZijDE1PsmstusiyI8YkqQZVYcrxOVWWMxTt3NAgqyu-r5-1Otak_bR83GsUxgE9HrcUcsh4S_Nq3hgibKFzp48OoXqYMIo5aq4WxI6HiLGcKrTXp5O5o7btyhtsG7ByGN-AdpJg6_91_HvXIQ')",
        }}
      />
      <div className="relative z-20 max-w-6xl mx-auto px-6 w-full">
        <nav className="flex items-center gap-2 mb-3 text-xs uppercase tracking-wider text-white/80">
          <Link href="/" className="hover:underline">
            BERANDA
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>AKADEMIK</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#E5B80B] font-bold">{current.breadcrumb}</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold font-sans uppercase">
          {current.title}
        </h1>
      </div>
    </section>
  );
}
