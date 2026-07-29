"use client";

import { useState, useTransition } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  UserX,
  UserCheck,
  Search,
} from "lucide-react";
import { UserFormDialog } from "./user-form-dialog";

export interface UserRow {
  id: number;
  name: string;
  email: string;
  role: "super_admin" | "admin";
  isActive: boolean;
  createdAt: Date | string;
}

interface UsersTableProps {
  initialUsers: UserRow[];
}

export function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isPending, startTransition] = useTransition();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);

  // ─── Toggle is_active ───────────────────────────────────────────────
  const handleToggleActive = (user: UserRow) => {
    startTransition(async () => {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Gagal mengubah status user.");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isActive: !u.isActive } : u
        )
      );
      toast.success(
        `User ${user.name} berhasil ${!user.isActive ? "diaktifkan" : "dinonaktifkan"}.`
      );
    });
  };

  // ─── Setelah create/edit berhasil ───────────────────────────────────
  const handleSuccess = async () => {
    // Re-fetch data terbaru dari API
    const res = await fetch("/api/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
    setDialogOpen(false);
    setEditingUser(null);
  };

  // ─── Columns ────────────────────────────────────────────────────────
  const columns: ColumnDef<UserRow>[] = [
    {
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.name}</div>
          <div className="text-xs text-gray-500">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ getValue }) => {
        const role = getValue<string>();
        return (
          <Badge
            variant={role === "super_admin" ? "default" : "secondary"}
            className={
              role === "super_admin"
                ? "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100"
                : "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100"
            }
          >
            {role === "super_admin" ? "Super Admin" : "Admin"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ getValue }) => {
        const active = getValue<boolean>();
        return (
          <Badge
            variant={active ? "default" : "secondary"}
            className={
              active
                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
                : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100"
            }
          >
            {active ? "Aktif" : "Nonaktif"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Dibuat",
      cell: ({ getValue }) => {
        const date = new Date(getValue<string | Date>());
        return (
          <span className="text-sm text-gray-500">
            {date.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              id={`edit-user-${user.id}`}
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                setEditingUser(user);
                setDialogOpen(true);
              }}
              title="Edit user"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>

            <Button
              id={`toggle-user-${user.id}`}
              variant="outline"
              size="sm"
              className={`h-8 w-8 p-0 ${
                user.isActive
                  ? "text-red-500 hover:bg-red-50 hover:border-red-200"
                  : "text-green-600 hover:bg-green-50 hover:border-green-200"
              }`}
              onClick={() => handleToggleActive(user)}
              disabled={isPending}
              title={user.isActive ? "Nonaktifkan" : "Aktifkan"}
            >
              {user.isActive ? (
                <UserX className="w-3.5 h-3.5" />
              ) : (
                <UserCheck className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-4">
      {/* Header: Search + Tambah */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="users-search"
            placeholder="Cari nama atau email..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button
          id="add-user-btn"
          onClick={() => {
            setEditingUser(null);
            setDialogOpen(true);
          }}
          className="bg-blue-700 hover:bg-blue-800 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah User
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-gray-200">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-gray-600 font-semibold text-xs uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-10 text-gray-400"
                >
                  Tidak ada data user.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Menampilkan{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}
          –
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          dari {table.getFilteredRowModel().rows.length} user
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-gray-700 font-medium">
            {table.getState().pagination.pageIndex + 1} /{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <UserFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingUser(null);
        }}
        user={editingUser}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
