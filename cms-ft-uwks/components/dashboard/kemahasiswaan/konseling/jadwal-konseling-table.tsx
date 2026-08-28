"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { JadwalKonseling } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

export function JadwalKonselingTable() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [formData, setFormData] = useState({
    tanggal: "",
    jam: "",
    status: "tersedia",
  });

  const { data, isLoading } = useQuery<{ data: JadwalKonseling[] }>({
    queryKey: ["jadwalKonseling", filterStatus],
    queryFn: async () => {
      const url = filterStatus === "all" ? "/api/kemahasiswaan/jadwal-konseling" : `/api/kemahasiswaan/jadwal-konseling?status=${filterStatus}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal mengambil jadwal");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/kemahasiswaan/jadwal-konseling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Jadwal berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["jadwalKonseling"] });
      setFormOpen(false);
      setFormData({ tanggal: "", jam: "", status: "tersedia" });
    },
    onError: () => toast.error("Gagal menambahkan jadwal"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, tanggal, jam }: { id: number; status: string; tanggal: string; jam: string }) => {
      const res = await fetch(`/api/kemahasiswaan/jadwal-konseling/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tanggal: typeof tanggal === 'string' ? tanggal.slice(0,10) : new Date(tanggal).toISOString().slice(0,10), jam, status }),
      });
      if (!res.ok) throw new Error("Gagal update");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Status jadwal diperbarui");
      queryClient.invalidateQueries({ queryKey: ["jadwalKonseling"] });
    },
    onError: () => toast.error("Gagal update status jadwal"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/kemahasiswaan/jadwal-konseling/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal hapus");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Jadwal dihapus");
      queryClient.invalidateQueries({ queryKey: ["jadwalKonseling"] });
      setDeleteId(null);
    },
    onError: () => toast.error("Gagal hapus jadwal"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tanggal || !formData.jam) {
      toast.error("Tanggal dan jam wajib diisi");
      return;
    }
    createMutation.mutate(formData);
  };

  const toggleStatus = (item: JadwalKonseling) => {
    const newStatus = item.status === "tersedia" ? "terisi" : "tersedia";
    updateStatusMutation.mutate({ 
      id: item.id, 
      status: newStatus, 
      tanggal: item.tanggal as unknown as string, 
      jam: item.jam 
    });
  };

  const jadwalList = data?.data ?? [];

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden mt-6">
      <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-gray-500" /> Slot Jadwal Konseling Online
          </h2>
          <p className="text-sm text-gray-500">Kelola slot waktu yang bisa dipilih mahasiswa.</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val || "all")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="tersedia">Tersedia</SelectItem>
              <SelectItem value="terisi">Terisi</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setFormOpen(true)} className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" /> Tambah Slot
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hari, Tanggal</TableHead>
            <TableHead>Jam</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></TableCell>
            </TableRow>
          ) : jadwalList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Belum ada slot jadwal.</TableCell>
            </TableRow>
          ) : (
            jadwalList.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {format(new Date(item.tanggal), "EEEE, d MMMM yyyy", { locale: idLocale })}
                </TableCell>
                <TableCell>{item.jam}</TableCell>
                <TableCell>
                  <button 
                    onClick={() => toggleStatus(item)} 
                    disabled={updateStatusMutation.isPending}
                    className="group flex items-center gap-2"
                  >
                    <Badge variant={item.status === "tersedia" ? "default" : "secondary"} className={cn("transition-colors", item.status === "tersedia" ? "bg-green-100 text-green-700 hover:bg-green-200" : "hover:bg-gray-200")}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                    <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Klik untuk ubah</span>
                  </button>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Tambah Slot Jadwal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Input type="date" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Jam (Format bebas)</Label>
              <Input placeholder="09:00 - 10:30 WIB" value={formData.jam} onChange={(e) => setFormData({...formData, jam: e.target.value})} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Batal</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Simpan Slot
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Jadwal?</AlertDialogTitle>
            <AlertDialogDescription>Slot jadwal akan dihapus secara permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (deleteId) deleteMutation.mutate(deleteId);
              }}
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
