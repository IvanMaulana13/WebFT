"use client";

import { Medal } from "lucide-react";
import { LombaTable } from "@/components/dashboard/kemahasiswaan/lomba/lomba-table";

export default function LombaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
            <Medal className="w-6 h-6 text-blue-600" />
            Informasi Lomba Mahasiswa
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola informasi kompetisi atau perlombaan tingkat nasional dan internasional.
          </p>
        </div>
      </div>

      <LombaTable />
    </div>
  );
}
