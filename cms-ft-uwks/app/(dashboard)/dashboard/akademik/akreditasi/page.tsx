import type { Metadata } from "next";
import { AkreditasiTable } from "@/components/dashboard/akademik/akreditasi-table";

export const metadata: Metadata = { title: "Akreditasi" };

export default function AkreditasiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Akreditasi</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola data akreditasi program studi beserta sertifikat dan nomor SK dari BAN-PT.
        </p>
      </div>
      <AkreditasiTable />
    </div>
  );
}
