import type { Metadata } from "next";
import InformasiSidebar from "@/components/public/informasi-sidebar";
import InformasiHeader from "@/components/public/informasi-header";

export const metadata: Metadata = {
  title: {
    default: "Informasi | Fakultas Teknik UWKS",
    template: "%s | Fakultas Teknik UWKS",
  },
  description: "Fasilitas, PMB, Layanan Konsultasi, dan Lowongan Pekerjaan Fakultas Teknik UWKS",
};

export default function InformasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full">
      <InformasiHeader />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16 grid grid-cols-12 gap-6 md:gap-8">
        <InformasiSidebar />
        <article className="col-span-12 md:col-span-8 lg:col-span-9 bg-white rounded-xl p-6 sm:p-8 lg:p-12 shadow-sm border border-slate-200">
          {children}
        </article>
      </div>
    </main>
  );
}
