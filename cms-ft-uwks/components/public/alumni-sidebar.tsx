"use client";

import { useTranslations } from "next-intl";
import { Users2, Award, GraduationCap, UserCheck, Briefcase } from "lucide-react";
import SharedSidebar, { type SharedSidebarItem } from "@/components/public/shared-sidebar";

export default function AlumniSidebar() {
  const t = useTranslations("navbar");

  const items: SharedSidebarItem[] = [
    {
      href: "/alumni/komfak",
      label: t("komfak"),
      icon: Users2,
    },
    {
      href: "/alumni/prominent-alumni",
      label: t("prominentAlumni"),
      icon: Award,
    },
    {
      href: "/alumni/tracer-study",
      label: t("tracerStudy"),
      icon: GraduationCap,
    },
    {
      href: "/alumni/tracer-alumni",
      label: t("tracerAlumni"),
      icon: UserCheck,
    },
    {
      href: "/alumni/pengembangan-karir",
      label: t("karir"),
      icon: Briefcase,
    },
  ];

  return (
    <SharedSidebar
      headerTitle={t("alumni")}
      sidebarHeader1="IKATAN"
      sidebarHeader2="ALUMNI"
      ariaLabel="Toggle Menu Alumni"
      items={items}
    />
  );
}
