"use client";

import { useTranslations } from "next-intl";
import SharedHeader from "@/components/public/shared-header";

export default function PenelitianHeader() {
  const t = useTranslations("navbar");

  const pageInfo: Record<string, { title: string; breadcrumb: string }> = {
    "/penelitian-pengabdian/roadmap": {
      title: t("roadmap"),
      breadcrumb: "PETA JALAN (ROADMAP)",
    },
    "/penelitian-pengabdian/penelitian": {
      title: t("penelitianSub"),
      breadcrumb: "PENELITIAN",
    },
    "/penelitian-pengabdian/pengabdian": {
      title: t("pengabdianSub"),
      breadcrumb: "PENGABDIAN KEPADA MASYARAKAT",
    },
    "/penelitian-pengabdian/jurnal-seminar": {
      title: t("jurnalSub"),
      breadcrumb: "PENGELOLA JURNAL & SEMINAR",
    },
    "/penelitian-pengabdian/sdgs": {
      title: t("sdgsSub"),
      breadcrumb: "SDGS",
    },
  };

  return (
    <SharedHeader
      sectionTitle={t("penelitian")}
      pageInfo={pageInfo}
      defaultTitle="PENELITIAN & PENGABDIAN"
      defaultBreadcrumb="PENELITIAN & PENGABDIAN"
    />
  );
}
