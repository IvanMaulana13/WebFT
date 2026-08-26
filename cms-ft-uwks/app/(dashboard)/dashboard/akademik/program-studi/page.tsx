import type { Metadata } from "next";
import { ProgramStudiTable } from "@/components/dashboard/akademik/program-studi-table";

export const metadata: Metadata = { title: "Program Studi" };

export default function ProgramStudiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Program Studi</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola master data program studi. Perubahan di sini berdampak pada dropdown di modul Jadwal dan Akreditasi.
        </p>
      </div>
      <ProgramStudiTable />
    </div>
  );
}
