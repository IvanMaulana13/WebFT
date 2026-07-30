import type { Metadata } from "next";
import { PrestasiTable } from "@/components/dashboard/prestasi/prestasi-table";

export const metadata: Metadata = { title: "Manajemen Prestasi" };

export default function PrestasiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Prestasi</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola data prestasi mahasiswa dan sivitas akademika.
        </p>
      </div>
      <PrestasiTable />
    </div>
  );
}
