import type { Metadata } from "next";
import { PedomanAkademikPanel } from "@/components/dashboard/akademik/pedoman-akademik-panel";

export const metadata: Metadata = { title: "Pedoman Akademik" };

export default function PedomanAkademikPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pedoman Akademik</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola file pedoman akademik. Hanya satu file aktif yang tersimpan — upload baru akan menggantikan yang lama.
        </p>
      </div>
      <PedomanAkademikPanel />
    </div>
  );
}
