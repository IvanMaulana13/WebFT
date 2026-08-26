import type { Metadata } from "next";
import { KalenderAkademikPanel } from "@/components/dashboard/akademik/kalender-akademik-panel";

export const metadata: Metadata = { title: "Kalender Akademik" };

export default function KalenderAkademikPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kalender Akademik</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola file kalender akademik. Hanya satu file aktif yang tersimpan — upload baru akan menggantikan yang lama.
        </p>
      </div>
      <KalenderAkademikPanel />
    </div>
  );
}
