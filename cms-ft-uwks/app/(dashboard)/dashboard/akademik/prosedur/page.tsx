import type { Metadata } from "next";
import { ProsedurTable } from "@/components/dashboard/akademik/prosedur-table";

export const metadata: Metadata = { title: "Prosedur Akademik" };

export default function ProsedurAkademikPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Prosedur Akademik</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola SOP dan prosedur akademik. Setiap prosedur dapat berupa file PDF atau link eksternal.
        </p>
      </div>
      <ProsedurTable />
    </div>
  );
}
