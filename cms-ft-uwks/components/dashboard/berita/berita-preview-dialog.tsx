"use client";

import Image from "next/image";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { Berita } from "@/lib/db/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface BeritaPreviewDialogProps {
  berita: Berita | null;
  onOpenChange: (open: boolean) => void;
}

const statusConfig = {
  published: { label: "Published", className: "bg-green-100 text-green-700 border-green-200" },
  draft: { label: "Draft", className: "bg-gray-100 text-gray-600 border-gray-300" },
  archived: { label: "Archived", className: "bg-amber-100 text-amber-700 border-amber-200" },
};

export function BeritaPreviewDialog({ berita, onOpenChange }: BeritaPreviewDialogProps) {
  if (!berita) return null;

  const status = statusConfig[berita.status];

  return (
    <Dialog open={!!berita} onOpenChange={(open) => !open && onOpenChange(false)}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Preview Berita</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Thumbnail */}
          {berita.thumbnailUrl && (
            <div className="relative w-full h-56 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={berita.thumbnailUrl}
                alt={berita.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-2 items-center">
            <Badge className={status.className}>{status.label}</Badge>
            {berita.category && (
              <Badge variant="outline" className="text-blue-600 border-blue-300">
                {berita.category}
              </Badge>
            )}
            {berita.publishedAt && (
              <span className="text-sm text-gray-500">
                {format(new Date(berita.publishedAt), "d MMMM yyyy", { locale: idLocale })}
              </span>
            )}
          </div>

          {/* Slug */}
          <p className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
            /berita/<span className="text-gray-600">{berita.slug}</span>
          </p>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 leading-snug">
            {berita.title}
          </h1>

          {/* Content */}
          <div
            className="prose prose-sm max-w-none text-gray-700 border-t border-gray-100 pt-4"
            dangerouslySetInnerHTML={{ __html: berita.content }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
