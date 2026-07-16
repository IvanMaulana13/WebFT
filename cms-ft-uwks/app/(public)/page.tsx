import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda — Fakultas Teknik UWKS",
  description:
    "Selamat datang di Fakultas Teknik Universitas Wijaya Kusuma Surabaya. Unggul, terpercaya, dan berdedikasi dalam pendidikan teknik.",
};

export default function BerandaPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Fakultas Teknik
            <br />
            <span className="text-blue-200">Universitas Wijaya Kusuma Surabaya</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Mencetak lulusan teknik yang unggul, inovatif, dan berwawasan
            global untuk membangun Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/visi-misi"
              className="bg-white text-blue-800 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors"
            >
              Visi &amp; Misi
            </a>
            <a
              href="/pimpinan-fakultas"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-blue-800 transition-colors"
            >
              Pimpinan Fakultas
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Program Studi", value: "5+" },
              { label: "Dosen Aktif", value: "80+" },
              { label: "Mahasiswa", value: "2.000+" },
              { label: "Alumni", value: "10.000+" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Berita & Informasi Placeholder */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Berita &amp; Informasi Terkini
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-blue-400 text-4xl">📰</span>
                </div>
                <div className="p-4">
                  <div className="text-xs text-blue-600 font-medium mb-2">
                    INFORMASI
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Konten berita akan dimuat dari CMS
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Data akan diambil secara dinamis dari database setelah
                    koneksi database terpasang.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
