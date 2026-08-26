import type { Metadata } from "next";
import { JadwalTable } from "@/components/dashboard/akademik/jadwal-table";

export const metadata: Metadata = { title: "Jadwal Perkuliahan" };

export default function JadwalPerkuliahanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Jadwal Perkuliahan</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola file jadwal perkuliahan per program studi, semester, dan tahun ajaran.
        </p>
      </div>
      <JadwalTable />
    </div>
  );
}
