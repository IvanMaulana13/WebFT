import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visi & Misi",
  description:
    "Visi dan misi Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

export default function VisiMisiPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Visi &amp; Misi</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Visi</h2>
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl">
          <p className="text-gray-800 leading-relaxed">
            Menjadi Fakultas Teknik yang unggul, inovatif, dan berdaya saing
            global dalam bidang ilmu pengetahuan dan teknologi yang berlandaskan
            nilai-nilai Pancasila pada tahun 2035.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Misi</h2>
        <ol className="space-y-4">
          {[
            "Menyelenggarakan pendidikan tinggi teknik yang berkualitas, relevan dengan kebutuhan industri dan perkembangan IPTEK.",
            "Melaksanakan penelitian yang inovatif dan aplikatif untuk kemajuan ilmu pengetahuan dan teknologi.",
            "Melaksanakan pengabdian kepada masyarakat berbasis keilmuan teknik untuk meningkatkan kesejahteraan masyarakat.",
            "Mengembangkan sumber daya manusia yang profesional, berintegritas, dan berjiwa wirausaha.",
            "Membangun kemitraan strategis dengan industri, pemerintah, dan institusi pendidikan di tingkat nasional maupun internasional.",
          ].map((misi, idx) => (
            <li key={idx} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {idx + 1}
              </span>
              <p className="text-gray-700 leading-relaxed pt-1">{misi}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
