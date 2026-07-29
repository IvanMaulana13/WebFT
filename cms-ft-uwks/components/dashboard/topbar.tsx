"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Bell, LogOut, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function DashboardTopbar() {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      toast.loading("Keluar dari sesi...", { id: "logout" });
      await signOut({ callbackUrl: "/login" });
      toast.dismiss("logout");
    });
  };

  const userName = session?.user?.name ?? "Admin";
  const userRole = session?.user?.role ?? "";
  const roleLabel =
    userRole === "super_admin" ? "Super Admin" : "Admin";

  // Inisial dari nama
  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Logo + Page Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center overflow-hidden p-0.5 shrink-0">
          <Image
            src="/logo-uwks.png"
            alt="Logo UWKS"
            width={28}
            height={28}
            className="object-contain"
          />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {initials}
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-800 leading-tight">
              {userName}
            </div>
            <div className="text-xs text-gray-500">{roleLabel}</div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          id="logout-btn"
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={isPending}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
          title="Keluar"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
          <span className="hidden md:inline ml-1.5">Keluar</span>
        </Button>
      </div>
    </header>
  );
}
