import type { Metadata } from "next";
import KemahasiswaanSidebar from "@/components/public/kemahasiswaan-sidebar";
import KemahasiswaanHeader from "@/components/public/kemahasiswaan-header";

export const metadata: Metadata = {
  title: {
    default: "Kemahasiswaan | Fakultas Teknik UWKS",
    template: "%s | Fakultas Teknik UWKS",
  },
  description: "Layanan, Organisasi, dan Informasi Kemahasiswaan Fakultas Teknik Universitas Wijaya Kusuma Surabaya",
};

export default function KemahasiswaanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full">
      <KemahasiswaanHeader />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16 grid grid-cols-12 gap-6 md:gap-8">
        <KemahasiswaanSidebar />
        <article className="col-span-12 md:col-span-8 lg:col-span-9 bg-white rounded-xl p-6 sm:p-8 lg:p-12 shadow-sm border border-slate-200">
          {children}
        </article>
      </div>
    </main>
  );
}
