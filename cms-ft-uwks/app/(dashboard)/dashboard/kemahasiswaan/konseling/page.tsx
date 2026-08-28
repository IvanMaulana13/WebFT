"use client";

import { useQuery } from "@tanstack/react-query";
import { HeartHandshake } from "lucide-react";
import { KonselingLayananForm } from "@/components/dashboard/kemahasiswaan/konseling/konseling-layanan-form";
import { JadwalKonselingTable } from "@/components/dashboard/kemahasiswaan/konseling/jadwal-konseling-table";

export default function KonselingPage() {
  const { data } = useQuery({
    queryKey: ["konselingLayanan"],
    queryFn: async () => {
      const res = await fetch("/api/kemahasiswaan/konseling");
      if (!res.ok) return null;
      return res.json();
    }
  });

  const isOnlineAktif = data?.data?.onlineAktif;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
            <HeartHandshake className="w-6 h-6 text-blue-600" />
            Layanan Konseling Mahasiswa
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola informasi layanan konseling dan atur ketersediaan jadwal bimbingan daring.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12 xl:col-span-10">
          <KonselingLayananForm />
          
          {isOnlineAktif && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <JadwalKonselingTable />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
