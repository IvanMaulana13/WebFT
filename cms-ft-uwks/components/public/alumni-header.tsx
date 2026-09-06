"use client";

import { useTranslations } from "next-intl";
import SharedHeader from "@/components/public/shared-header";

export default function AlumniHeader() {
  const t = useTranslations("navbar");

  const pageInfo: Record<string, { title: string; breadcrumb: string }> = {
    "/alumni/komfak": {
      title: t("komfak"),
      breadcrumb: "KOMFAK",
    },
    "/alumni/prominent-alumni": {
      title: t("prominentAlumni"),
      breadcrumb: "PROMINENT ALUMNI",
    },
    "/alumni/tracer-study": {
      title: t("tracerStudy"),
      breadcrumb: "TRACER STUDY",
    },
    "/alumni/tracer-alumni": {
      title: t("tracerAlumni"),
      breadcrumb: "TRACER ALUMNI",
    },
    "/alumni/pengembangan-karir": {
      title: t("karir"),
      breadcrumb: "PENGEMBANGAN KARIR",
    },
  };

  return (
    <SharedHeader
      sectionTitle={t("alumni")}
      pageInfo={pageInfo}
      defaultTitle="ALUMNI"
      defaultBreadcrumb="ALUMNI"
    />
  );
}
