import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Struktur Organisasi",
  description:
    "Struktur organisasi Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

export default function StrukturOrganisasiPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Struktur Organisasi
      </h1>
      <p className="text-gray-500 mb-12">
        Bagan struktur organisasi akan di-render otomatis dari data hierarki
        pimpinan (Part 8).
      </p>

      {/* Placeholder org chart */}
      <div className="flex flex-col items-center gap-6">
        {/* Level 1: Dekan */}
        <div className="bg-blue-700 text-white rounded-xl px-8 py-4 text-center shadow-lg">
          <div className="font-bold">Dekan</div>
          <div className="text-blue-200 text-sm">Nama Pimpinan</div>
        </div>

        {/* Connector */}
        <div className="w-px h-8 bg-gray-300" />

        {/* Level 2: Wakil Dekan */}
        <div className="grid grid-cols-3 gap-6 relative">
          {["Wakil Dekan I", "Wakil Dekan II", "Wakil Dekan III"].map(
            (wd) => (
              <div
                key={wd}
                className="bg-blue-100 border-2 border-blue-300 rounded-xl px-6 py-3 text-center"
              >
                <div className="font-semibold text-blue-800 text-sm">{wd}</div>
                <div className="text-blue-500 text-xs">Nama Pimpinan</div>
              </div>
            )
          )}
        </div>

        <p className="text-center text-gray-400 text-sm mt-4">
          Bagan ini akan terbentuk otomatis dari data database (Part 8)
        </p>
      </div>
    </div>
  );
}
