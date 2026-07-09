"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string;
  fileId?: string;
  alt?: string;
  onUpload: (url: string, fileId: string) => void;
  onDelete?: () => void;
  folder?: string;
  className?: string;
  label?: string;
  accept?: string;
  previewHeight?: string;
  compact?: boolean;
}

export default function ImageUploader({
  value,
  fileId,
  alt = "",
  onUpload,
  onDelete,
  folder = "/portfolio",
  className,
  label = "Upload Image",
  accept = "image/*",
  previewHeight = "h-48",
  compact = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const upload = useCallback(
    async (file: File) => {
      if (!file) return;
      setUploading(true);
      setError("");

      try {
        // Get auth params from server
        const authRes = await fetch(
          `/api/upload?fileName=${encodeURIComponent(file.name)}&folder=${encodeURIComponent(folder)}`
        );
        const auth = await authRes.json();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("publicKey", auth.publicKey);
        formData.append("signature", auth.signature);
        formData.append("expire", auth.expire);
        formData.append("token", auth.token);
        formData.append("fileName", auth.fileName);
        formData.append("folder", auth.folder);

        const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Upload failed");
        const result = await uploadRes.json();
        onUpload(result.url, result.fileId);
      } catch {
        setError("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [folder, onUpload]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const handleDelete = async () => {
    if (fileId) {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });
    }
    onDelete?.();
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-mono text-text-secondary">{label}</label>
      )}

      {value ? (
        <div className={cn("relative group rounded-2xl overflow-hidden border border-border-subtle bg-black/40", previewHeight, "w-full")}>
          <div className="relative h-full w-full p-2">
            <Image src={value} alt={alt} fill className="object-contain" />
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {compact ? (
              <button
                type="button"
                onClick={handleDelete}
                className="p-1.5 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-full text-sm hover:bg-red-500/30 transition-colors"
              >
                <X size={14} />
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        <label
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed cursor-pointer transition-all",
            previewHeight,
            dragOver
              ? "border-green-accent bg-green-accent/5"
              : "border-border-subtle bg-bg-card hover:border-green-accent/40 hover:bg-bg-card/80"
          )}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={compact ? 20 : 32} className="text-green-accent animate-spin" />
              {!compact && <span className="text-sm text-text-secondary font-mono">Uploading...</span>}
            </div>
          ) : compact ? (
            <div className="flex flex-col items-center justify-center text-text-tertiary group-hover:text-green-accent transition-colors">
              <Upload size={20} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 rounded-full bg-bg-primary border border-border-subtle">
                <ImageIcon size={24} className="text-text-tertiary" />
              </div>
              <div className="text-center">
                <p className="text-sm text-text-secondary">
                  <span className="text-green-accent font-mono">Click to upload</span> or drag & drop
                </p>
                <p className="text-xs text-text-tertiary mt-1">PNG, JPG, WebP up to 10MB</p>
              </div>
            </div>
          )}
        </label>
      )}

      {error && (
        <p className="text-sm text-red-400 font-mono">{error}</p>
      )}
    </div>
  );
}
