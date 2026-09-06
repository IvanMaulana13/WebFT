"use client";

import { Link, usePathname } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AkademikHeader() {
  const pathname = usePathname();
  const t = useTranslations("akademik");
  const tCommon = useTranslations("common");

  const pageInfo: Record<string, { title: string; breadcrumb: string }> = {
    "/akademik/kalender": {
      title: t("kalender.title"),
      breadcrumb: t("kalender.breadcrumb"),
    },
    "/akademik/pedoman": {
      title: t("pedoman.title"),
      breadcrumb: t("pedoman.breadcrumb"),
    },
    "/akademik/jadwal-perkuliahan": {
      title: t("jadwal.title"),
      breadcrumb: t("jadwal.breadcrumb"),
    },
    "/akademik/akreditasi": {
      title: t("akreditasi.title"),
      breadcrumb: t("akreditasi.breadcrumb"),
    },
    "/akademik/prosedur": {
      title: t("prosedur.title"),
      breadcrumb: t("prosedur.breadcrumb"),
    },
  };

  const current = pageInfo[pathname] || {
    title: t("headerTitle"),
    breadcrumb: t("breadcrumb"),
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
            {tCommon("beranda")}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{t("breadcrumb")}</span>
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
