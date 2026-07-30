"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value: string; // current URL
  onChange: (url: string) => void;
  disabled?: boolean;
}

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Format tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("Ukuran file melebihi 2MB.");
      return;
    }

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal mengupload gambar");
        return;
      }

      onChange(json.url);
      toast.success("Gambar berhasil diupload");
    } catch {
      toast.error("Terjadi kesalahan saat mengupload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled || isUploading}
      />

      {value ? (
        // Preview
        <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <div className="relative w-full h-48">
            <Image
              src={value}
              alt="Pratinjau gambar"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          {!disabled && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span className="ml-1">Ganti</span>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => onChange("")}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        // Drop zone
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !disabled && !isUploading && inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm">Mengupload...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <ImageIcon className="w-10 h-10" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Klik atau drag &amp; drop gambar
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WebP — Maks. 2MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
