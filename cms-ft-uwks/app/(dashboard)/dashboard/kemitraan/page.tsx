import type { Metadata } from "next";
import { KemitraanTable } from "@/components/dashboard/kemitraan/kemitraan-table";

export const metadata: Metadata = { title: "Manajemen Kemitraan" };

export default function KemitraanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Kemitraan</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola data mitra dan institusi kerjasama.
        </p>
      </div>
      <KemitraanTable />
    </div>
  );
}
