"use client";

import { useState } from "react";
import { Users2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrmawaGrid } from "@/components/dashboard/kemahasiswaan/ormawa/ormawa-grid";
import { OrmawaFormDialog } from "@/components/dashboard/kemahasiswaan/ormawa/ormawa-form-dialog";

export default function OrmawaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
            <Users2 className="w-6 h-6 text-blue-600" />
            Organisasi Kemahasiswaan
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola data organisasi kemahasiswaan (BEM, DPM, HIMA, dll).
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="w-full sm:w-auto">
          Tambah Ormawa
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari nama ormawa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
      </div>

      <OrmawaGrid searchQuery={searchQuery} />

      <OrmawaFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
