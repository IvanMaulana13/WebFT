import type { Metadata } from "next";
import PenelitianSidebar from "@/components/public/penelitian-sidebar";
import PenelitianHeader from "@/components/public/penelitian-header";

export const metadata: Metadata = {
  title: {
    default: "Penelitian & Pengabdian | Fakultas Teknik UWKS",
    template: "%s | Fakultas Teknik UWKS",
  },
  description: "Peta Jalan, Penelitian, Pengabdian kepada Masyarakat, Jurnal, dan SDGs Fakultas Teknik UWKS",
};

export default function PenelitianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full">
      <PenelitianHeader />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16 grid grid-cols-12 gap-6 md:gap-8">
        <PenelitianSidebar />
        <article className="col-span-12 md:col-span-8 lg:col-span-9 bg-white rounded-xl p-6 sm:p-8 lg:p-12 shadow-sm border border-slate-200">
          {children}
        </article>
      </div>
    </main>
  );
}
