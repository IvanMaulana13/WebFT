import type { Metadata } from "next";
import { BeritaTable } from "@/components/dashboard/berita/berita-table";

export const metadata: Metadata = { title: "Manajemen Berita" };

export default function BeritaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Berita</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola berita dan artikel yang ditampilkan di website.
        </p>
      </div>
      <BeritaTable />
    </div>
  );
}
