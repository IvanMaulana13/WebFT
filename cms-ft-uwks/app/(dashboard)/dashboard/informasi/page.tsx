import type { Metadata } from "next";
import { InformasiTable } from "@/components/dashboard/informasi/informasi-table";

export const metadata: Metadata = { title: "Manajemen Informasi" };

export default function InformasiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Informasi</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola daftar informasi yang ditampilkan di website. Drag baris untuk mengubah urutan.
        </p>
      </div>
      <InformasiTable />
    </div>
  );
}
