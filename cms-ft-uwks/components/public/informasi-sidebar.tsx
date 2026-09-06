"use client";

import { useTranslations } from "next-intl";
import { Building2, UserPlus, Headphones, Briefcase } from "lucide-react";
import SharedSidebar, { type SharedSidebarItem } from "@/components/public/shared-sidebar";

export default function InformasiSidebar() {
  const t = useTranslations("navbar");

  const items: SharedSidebarItem[] = [
    {
      href: "/informasi/fasilitas",
      label: t("fasilitas"),
      icon: Building2,
    },
    {
      href: "/informasi/pmb",
      label: t("pmb"),
      icon: UserPlus,
    },
    {
      href: "/informasi/konsultasi-teknik",
      label: t("konsultasiTeknik"),
      icon: Headphones,
    },
    {
      href: "/informasi/lowongan-kerja",
      label: t("lowongan"),
      icon: Briefcase,
    },
  ];

  return (
    <SharedSidebar
      headerTitle={t("informasi")}
      sidebarHeader1="PUSAT"
      sidebarHeader2="INFORMASI"
      ariaLabel="Toggle Menu Informasi"
      items={items}
    />
  );
}
