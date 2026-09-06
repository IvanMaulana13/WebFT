"use client";

import { useTranslations } from "next-intl";
import SharedHeader from "@/components/public/shared-header";

export default function InformasiHeader() {
  const t = useTranslations("navbar");

  const pageInfo: Record<string, { title: string; breadcrumb: string }> = {
    "/informasi/fasilitas": {
      title: t("fasilitas"),
      breadcrumb: "FASILITAS",
    },
    "/informasi/pmb": {
      title: t("pmb"),
      breadcrumb: "PENDAFTARAN MAHASISWA BARU",
    },
    "/informasi/konsultasi-teknik": {
      title: t("konsultasiTeknik"),
      breadcrumb: "LAYANAN KONSULTASI TEKNIK",
    },
    "/informasi/lowongan-kerja": {
      title: t("lowongan"),
      breadcrumb: "LOWONGAN PEKERJAAN",
    },
  };

  return (
    <SharedHeader
      sectionTitle={t("informasi")}
      pageInfo={pageInfo}
      defaultTitle="INFORMASI"
      defaultBreadcrumb="INFORMASI"
    />
  );
}
