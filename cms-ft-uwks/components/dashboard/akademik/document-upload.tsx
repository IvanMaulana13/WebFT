"use client";

import { useRef, useState } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  value?: string; // URL saat ini (jika ada)
  onChange: (url: string, fileName: string) => void;
  onClear?: () => void;
  accept?: string; // default: PDF only
  label?: string;
  className?: string;
}

/**
 * Reusable document upload component untuk modul Akademik.
 * Upload ke /api/upload/document (PDF/image, max 10MB).
 */
export function DocumentUpload({
  value,
  onChange,
  onClear,
  accept = ".pdf",
  label = "Upload Dokumen",
  className,
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>(() => {
    if (!value) return "";
    // Ambil nama file dari URL
    return value.split("/").pop() ?? "";
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/document", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Gagal mengunggah file");
        return;
      }

      setFileName(data.fileName ?? file.name);
      onChange(data.url, data.fileName ?? file.name);
    } catch {
      setError("Terjadi kesalahan saat mengunggah file");
    } finally {
      setUploading(false);
      // Reset input supaya file yang sama bisa diupload ulang
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleClear = () => {
    setFileName("");
    setError(null);
    onClear?.();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        // File sudah ada — tampilkan nama file + aksi
        <div className="flex items-center gap-2 p-3 rounded-lg border border-green-200 bg-green-50">
          <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-sm text-green-700 flex-1 truncate" title={fileName || value}>
            {fileName || value.split("/").pop()}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              Ganti
            </Button>
            {onClear && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                onClick={handleClear}
                disabled={uploading}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        // Belum ada file — tampilkan tombol upload
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "w-full flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed transition-colors",
            uploading
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
          )}
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-gray-400" />
          )}
          <span className="text-sm text-gray-500">
            {uploading ? "Mengunggah..." : label}
          </span>
          <span className="text-xs text-gray-400">
            {accept === ".pdf" ? "PDF" : "PDF, JPG, PNG"} — maks. 10MB
          </span>
        </button>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
