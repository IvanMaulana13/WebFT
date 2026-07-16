import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pimpinan Fakultas",
  description:
    "Pimpinan Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

export default function PimpinanFakultasPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Pimpinan Fakultas
      </h1>
      <p className="text-gray-500 mb-12">
        Data pimpinan fakultas akan dimuat secara dinamis dari database (Part 8).
      </p>

      {/* Placeholder cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { jabatan: "Dekan", level: 1 },
          { jabatan: "Wakil Dekan I", level: 2 },
          { jabatan: "Wakil Dekan II", level: 2 },
          { jabatan: "Wakil Dekan III", level: 2 },
        ].map((pimpinan) => (
          <div
            key={pimpinan.jabatan}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-blue-300 flex items-center justify-center text-4xl">
                👤
              </div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                {pimpinan.jabatan}
              </div>
              <h3 className="font-semibold text-gray-700">
                Nama Pimpinan
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Data dari CMS — Part 8
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
