"use client";

import { useTranslations } from "next-intl";
import {
  ClipboardCheck,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Users,
  Smile,
} from "lucide-react";
import SharedSidebar, { type SharedSidebarItem } from "@/components/public/shared-sidebar";

export default function PenjaminanMutuSidebar() {
  const t = useTranslations("navbar");

  const items: SharedSidebarItem[] = [
    {
      href: "/penjaminan-mutu/evaluasi-pembelajaran",
      label: t("evaluasiPembelajaran"),
      icon: ClipboardCheck,
    },
    {
      href: "/penjaminan-mutu/spmi",
      label: t("spmi"),
      icon: ShieldCheck,
    },
    {
      href: "/penjaminan-mutu/audit-mutu",
      label: t("ami"),
      icon: CheckCircle2,
    },
    {
      href: "/penjaminan-mutu/rtl",
      label: t("rencanaTindakLanjut"),
      icon: FileText,
    },
    {
      href: "/penjaminan-mutu/rtm",
      label: t("rtm"),
      icon: Users,
    },
    {
      href: "/penjaminan-mutu/kepuasan-layanan",
      label: t("kepuasanLayanan"),
      icon: Smile,
    },
  ];

  return (
    <SharedSidebar
      headerTitle={t("mutu")}
      sidebarHeader1="PENJAMINAN"
      sidebarHeader2="MUTU"
      ariaLabel="Toggle Menu Penjaminan Mutu"
      items={items}
    />
  );
}
