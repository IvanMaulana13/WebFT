"use client";

import { Bell, Search } from "lucide-react";

interface TopbarProps {
  title?: string;
}

export function DashboardTopbar({ title = "Dashboard" }: TopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Page Title */}
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari..."
            className="w-64 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-800">Admin</div>
            <div className="text-xs text-gray-500">Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
