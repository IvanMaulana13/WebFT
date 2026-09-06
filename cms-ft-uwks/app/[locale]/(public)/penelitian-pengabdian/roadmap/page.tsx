import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peta Jalan (RoadMap)",
  description: "Peta Jalan (RoadMap) Penelitian dan Pengabdian Fakultas Teknik UWKS",
};

export default function RoadmapPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#002347] font-sans uppercase">
          PETA JALAN (ROADMAP)
        </h2>
        <div className="h-1 w-20 bg-[#E5B80B] rounded-full" />
      </div>
      <p className="text-slate-600 text-sm md:text-base leading-relaxed">
      </p>
    </div>
  );
}
