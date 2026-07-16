import type { Metadata } from "next";

export const metadata: Metadata = { title: "Data Dosen" };

export default function DosenPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Dosen</h1>
        <p className="text-gray-500 text-sm mt-1">Modul ini akan diimplementasikan pada Part 7.</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="text-5xl mb-4">👨‍🏫</div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Data Dosen</h2>
        <p className="text-gray-400 text-sm">Fitur lengkap tersedia di Part 7.</p>
      </div>
    </div>
  );
}
