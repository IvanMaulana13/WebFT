import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manajemen Informasi" };

export default function InformasiPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Informasi</h1>
        <p className="text-gray-500 text-sm mt-1">CRUD Informasi akan diimplementasikan pada Part 3.</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="text-5xl mb-4">📄</div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Modul Informasi</h2>
        <p className="text-gray-400 text-sm">List, tambah, edit, hapus, dan reorder informasi akan tersedia di Part 3.</p>
      </div>
    </div>
  );
}
