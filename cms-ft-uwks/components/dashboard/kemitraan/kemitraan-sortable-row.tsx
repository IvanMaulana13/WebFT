"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Row, flexRender } from "@tanstack/react-table";
import { GripVertical } from "lucide-react";
import type { Kemitraan } from "@/lib/db/schema";

interface KemitraanSortableRowProps {
  row: Row<Kemitraan>;
}

export function KemitraanSortableRow({ row }: KemitraanSortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.original.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: isDragging ? ("relative" as const) : ("static" as const),
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      {/* Drag handle cell */}
      <td className="px-3 py-3 w-10">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          title="Drag untuk mengubah urutan"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </td>

      {/* Data cells */}
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="px-4 py-3 text-sm text-gray-700">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}
