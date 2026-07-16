import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sejarah Fakultas",
  description:
    "Sejarah berdirinya Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

export default function SejarahPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Sejarah Fakultas Teknik
      </h1>

      <div className="prose prose-blue max-w-none">
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Fakultas Teknik Universitas Wijaya Kusuma Surabaya (FT UWKS) didirikan
          dengan semangat untuk mencetak generasi penerus bangsa yang kompeten di
          bidang ilmu rekayasa dan teknologi.
        </p>

        {/* Timeline placeholder */}
        <div className="relative border-l-2 border-blue-200 ml-4 space-y-8 mt-10">
          {[
            {
              year: "1981",
              event:
                "Universitas Wijaya Kusuma Surabaya resmi berdiri, dengan beberapa fakultas perintis.",
            },
            {
              year: "1990",
              event:
                "Fakultas Teknik resmi dibuka dengan Program Studi Teknik Sipil sebagai program studi pertama.",
            },
            {
              year: "2000",
              event:
                "Penambahan program studi baru: Teknik Elektro dan Teknik Mesin untuk memenuhi kebutuhan industri.",
            },
            {
              year: "2010",
              event:
                "Perolehan akreditasi A untuk beberapa program studi, menandai peningkatan kualitas pendidikan.",
            },
            {
              year: "2020",
              event:
                "Era transformasi digital: implementasi e-learning dan penguatan riset berbasis teknologi.",
            },
          ].map((item) => (
            <div key={item.year} className="relative pl-8">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white" />
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <span className="text-blue-700 font-bold text-lg">
                  {item.year}
                </span>
                <p className="text-gray-700 mt-1">{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
