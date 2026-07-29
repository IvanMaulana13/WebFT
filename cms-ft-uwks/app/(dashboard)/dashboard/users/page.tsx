import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { UsersTable } from "@/components/dashboard/users/users-table";

export const metadata: Metadata = { title: "Manajemen User" };

export default async function UsersPage() {
  const session = await auth();

  // Middleware sudah handle unauthenticated, tapi double-check di sini
  if (!session?.user) {
    redirect("/login");
  }

  // Hanya super_admin yang boleh akses
  if (session.user.role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          403 — Akses Ditolak
        </h1>
        <p className="text-gray-500 max-w-md">
          Halaman ini hanya dapat diakses oleh{" "}
          <span className="font-semibold text-purple-700">Super Admin</span>.
          Akun Anda saat ini memiliki role{" "}
          <span className="font-semibold">{session.user.role}</span>.
        </p>
      </div>
    );
  }

  // Fetch semua users dari DB (server-side)
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(users.createdAt);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola akun admin yang dapat mengakses dashboard CMS.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{allUsers.length}</div>
          <div className="text-sm text-gray-500">Total User</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {allUsers.filter((u) => u.isActive).length}
          </div>
          <div className="text-sm text-gray-500">User Aktif</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">
            {allUsers.filter((u) => u.role === "super_admin").length}
          </div>
          <div className="text-sm text-gray-500">Super Admin</div>
        </div>
      </div>

      {/* Table */}
      <UsersTable initialUsers={allUsers} />
    </div>
  );
}
