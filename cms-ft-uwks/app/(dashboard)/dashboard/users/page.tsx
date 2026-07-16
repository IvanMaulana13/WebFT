import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manajemen User" };

export default function UsersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
        <p className="text-gray-500 text-sm mt-1">Modul ini akan diimplementasikan pada Part 2.</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="text-5xl mb-4">👥</div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Manajemen User</h2>
        <p className="text-gray-400 text-sm">Fitur lengkap tersedia di Part 2.</p>
      </div>
    </div>
  );
}
