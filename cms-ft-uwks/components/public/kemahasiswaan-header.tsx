"use client";

import { Link, usePathname } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function KemahasiswaanHeader() {
  const pathname = usePathname();
  const t = useTranslations("kemahasiswaan");
  const tCommon = useTranslations("common");

  const pageInfo: Record<string, { title: string; breadcrumb: string }> = {
    "/kemahasiswaan/ormawa": {
      title: t("ormawa.title"),
      breadcrumb: t("ormawa.breadcrumb"),
    },
    "/kemahasiswaan/prestasi": {
      title: t("prestasi.title"),
      breadcrumb: t("prestasi.breadcrumb"),
    },
    "/kemahasiswaan/beasiswa": {
      title: t("beasiswa.title"),
      breadcrumb: t("beasiswa.breadcrumb"),
    },
    "/kemahasiswaan/lomba": {
      title: t("lomba.title"),
      breadcrumb: t("lomba.breadcrumb"),
    },
    "/kemahasiswaan/kegiatan": {
      title: t("kegiatan.title"),
      breadcrumb: t("kegiatan.breadcrumb"),
    },
    "/kemahasiswaan/konseling": {
      title: t("konseling.title"),
      breadcrumb: t("konseling.breadcrumb"),
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
        <nav className="flex items-center gap-2 mb-3 text-xs uppercase tracking-wider text-white/80 flex-wrap">
          <Link href="/" className="hover:underline hover:text-[#E5B80B] transition-colors">
            {tCommon("beranda")}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{t("breadcrumb")}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#E5B80B] font-bold">{current.breadcrumb}</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold font-sans uppercase leading-tight">
          {current.title}
        </h1>
      </div>
    </section>
  );
}
