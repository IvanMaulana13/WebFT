import type { Metadata } from "next";
import PenjaminanMutuSidebar from "@/components/public/penjaminan-mutu-sidebar";
import PenjaminanMutuHeader from "@/components/public/penjaminan-mutu-header";

export const metadata: Metadata = {
  title: {
    default: "Penjaminan Mutu | Fakultas Teknik UWKS",
    template: "%s | Fakultas Teknik UWKS",
  },
  description: "Sistem Penjaminan Mutu Internal, Audit Mutu, dan Evaluasi Layanan Fakultas Teknik UWKS",
};

export default function PenjaminanMutuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full">
      <PenjaminanMutuHeader />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16 grid grid-cols-12 gap-6 md:gap-8">
        <PenjaminanMutuSidebar />
        <article className="col-span-12 md:col-span-8 lg:col-span-9 bg-white rounded-xl p-6 sm:p-8 lg:p-12 shadow-sm border border-slate-200">
          {children}
        </article>
      </div>
    </main>
  );
}
