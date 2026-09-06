"use client";

import { useTranslations } from "next-intl";
import SharedHeader from "@/components/public/shared-header";

export default function PenjaminanMutuHeader() {
  const t = useTranslations("navbar");

  const pageInfo: Record<string, { title: string; breadcrumb: string }> = {
    "/penjaminan-mutu/evaluasi-pembelajaran": {
      title: t("evaluasiPembelajaran"),
      breadcrumb: "EVALUASI PEMBELAJARAN",
    },
    "/penjaminan-mutu/spmi": {
      title: t("spmi"),
      breadcrumb: "SPMI",
    },
    "/penjaminan-mutu/audit-mutu": {
      title: t("ami"),
      breadcrumb: "AUDIT MUTU INTERNAL",
    },
    "/penjaminan-mutu/rtl": {
      title: t("rencanaTindakLanjut"),
      breadcrumb: "RENCANA TINDAK LANJUT",
    },
    "/penjaminan-mutu/rtm": {
      title: t("rtm"),
      breadcrumb: "RAPAT TINJAUAN MANAJEMEN",
    },
    "/penjaminan-mutu/kepuasan-layanan": {
      title: t("kepuasanLayanan"),
      breadcrumb: "KEPUASAN LAYANAN",
    },
  };

  return (
    <SharedHeader
      sectionTitle={t("mutu")}
      pageInfo={pageInfo}
      defaultTitle="PENJAMINAN MUTU"
      defaultBreadcrumb="PENJAMINAN MUTU"
    />
  );
}
