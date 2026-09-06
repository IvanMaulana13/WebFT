"use client";

import { useTranslations } from "next-intl";
import { Route, FlaskConical, HeartHandshake, BookOpen, Globe } from "lucide-react";
import SharedSidebar, { type SharedSidebarItem } from "@/components/public/shared-sidebar";

export default function PenelitianSidebar() {
  const t = useTranslations("navbar");

  const items: SharedSidebarItem[] = [
    {
      href: "/penelitian-pengabdian/roadmap",
      label: t("roadmap"),
      icon: Route,
    },
    {
      href: "/penelitian-pengabdian/penelitian",
      label: t("penelitianSub"),
      icon: FlaskConical,
    },
    {
      href: "/penelitian-pengabdian/pengabdian",
      label: t("pengabdianSub"),
      icon: HeartHandshake,
    },
    {
      href: "/penelitian-pengabdian/jurnal-seminar",
      label: t("jurnalSub"),
      icon: BookOpen,
    },
    {
      href: "/penelitian-pengabdian/sdgs",
      label: t("sdgsSub"),
      icon: Globe,
    },
  ];

  return (
    <SharedSidebar
      headerTitle={t("penelitian")}
      sidebarHeader1="PENELITIAN &"
      sidebarHeader2="PENGABDIAN"
      ariaLabel="Toggle Menu Penelitian & Pengabdian"
      items={items}
    />
  );
}
