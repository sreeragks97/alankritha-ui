"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { OptimizedImage } from "@/components/ui/image";
import { CloudinaryService } from "@/src/services/CloudinaryService";
import { revokeObjectUrl } from "@/utils/image";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

type UploadStatus = "uploading" | "success" | "error";

interface PendingUpload {
  id: string;
  fileName: string;
  previewUrl: string;
  progress: number;
  status: UploadStatus;
  error?: string;
}

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  disabled?: boolean;
}

function validateFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return `${file.name}: Only JPG, JPEG, PNG, and WEBP files are allowed.`;
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `${file.name}: File size must be 5MB or less.`;
  }

  return null;
}

export function ImageUploader({
  images,
  onChange,
  onUploadingChange,
  disabled = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const localBlobUrlsRef = useRef<Set<string>>(new Set());
  const cloudinaryServiceRef = useRef(new CloudinaryService());
  const imagesRef = useRef(images);

  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const hasActiveUploads = useMemo(
    () => pendingUploads.some((upload) => upload.status === "uploading"),
    [pendingUploads],
  );

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    onUploadingChange?.(hasActiveUploads);
  }, [hasActiveUploads, onUploadingChange]);

  useEffect(() => {
    const knownBlobUrls = localBlobUrlsRef.current;
    return () => {
      for (const blobUrl of knownBlobUrls) {
        revokeObjectUrl(blobUrl);
      }
      knownBlobUrls.clear();
    };
  }, []);

  const appendUploadedImage = (imageUrl: string) => {
    const nextImages = [...imagesRef.current, imageUrl];
    const deduped = nextImages.filter((item, index) => nextImages.indexOf(item) === index);
    onChange(deduped);
  };

  const releasePendingPreview = (previewUrl: string) => {
    if (localBlobUrlsRef.current.has(previewUrl)) {
      revokeObjectUrl(previewUrl);
      localBlobUrlsRef.current.delete(previewUrl);
    }
  };

  const uploadSingleFile = async (file: File, index: number) => {
    const id = `${Date.now()}-${index}-${file.name}`;
    const previewUrl = URL.createObjectURL(file);
    localBlobUrlsRef.current.add(previewUrl);

    setPendingUploads((prev) => [
      ...prev,
      {
        id,
        fileName: file.name,
        previewUrl,
        progress: 0,
        status: "uploading",
      },
    ]);

    try {
      const uploaded = await cloudinaryServiceRef.current.uploadImage(file, (percentage) => {
        setPendingUploads((prev) =>
          prev.map((item) => (item.id === id ? { ...item, progress: percentage } : item)),
        );
      });

      console.info("[ProductImageDebug] Cloudinary upload response", {
        fileName: file.name,
        secureUrl: uploaded.secure_url,
        publicId: uploaded.public_id,
      });

      appendUploadedImage(uploaded.secure_url);

      setPendingUploads((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, progress: 100, status: "success" } : item,
        ),
      );

      window.setTimeout(() => {
        setPendingUploads((prev) => prev.filter((item) => item.id !== id));
      }, 1200);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Image upload failed";

      console.error("[ProductImageDebug] Cloudinary upload error", {
        fileName: file.name,
        error: message,
      });

      setPendingUploads((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "error",
                error: message,
              }
            : item,
        ),
      );

      setValidationErrors((prev) => [...prev, `${file.name}: ${message}`]);
    } finally {
      releasePendingPreview(previewUrl);
    }
  };

  const pushFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const nextErrors: string[] = [];
    const validFiles: File[] = [];

    for (const file of Array.from(files)) {
      const validationMessage = validateFile(file);

      if (validationMessage) {
        nextErrors.push(validationMessage);
      } else {
        validFiles.push(file);
      }
    }

    setValidationErrors(nextErrors);

    if (validFiles.length === 0) {
      return;
    }

    void Promise.all(validFiles.map((file, index) => uploadSingleFile(file, index)));
  };

  const clearUploadMessage = (id: string) => {
    setPendingUploads((prev) => prev.filter((item) => item.id !== id));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  };

  const removeImage = (index: number) => {
    const removedImage = images[index];
    if (removedImage && localBlobUrlsRef.current.has(removedImage)) {
      revokeObjectUrl(removedImage);
      localBlobUrlsRef.current.delete(removedImage);
    }

    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        disabled={disabled || hasActiveUploads}
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#d7c49a] bg-[#fffaf0] px-4 py-9 text-center transition-all duration-200 hover:border-[#c8ab73] hover:bg-[#fff7e8] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="text-sm font-semibold text-[var(--brand-ink)]">Upload product images</span>
        <span className="mt-1 text-xs text-[var(--brand-muted)]">
          JPG, JPEG, PNG, WEBP up to 5MB. Files upload to Cloudinary before saving.
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(event) => {
          pushFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {validationErrors.length > 0 ? (
        <div className="rounded-xl border border-[#f2d0c8] bg-[#fff5f2] px-3 py-2 text-xs text-[#9d3f2d]">
          {validationErrors.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      ) : null}

      {pendingUploads.length > 0 ? (
        <div className="space-y-2 rounded-xl border border-[#ebdfca] bg-white p-3">
          {pendingUploads.map((item) => (
            <div key={item.id} className="space-y-2 rounded-lg border border-[#efe5d2] p-2 text-xs">
              <div className="relative h-14 w-14 overflow-hidden rounded-md border border-[#ebdfca] bg-[#f1e7d3]">
                <OptimizedImage
                  src={item.previewUrl}
                  alt={item.fileName}
                  fill
                  sizes="56px"
                  className="object-cover object-center"
                  fallbackLabel={`${item.fileName} preview unavailable`}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="truncate font-medium text-[var(--brand-ink)]">{item.fileName}</p>
                {item.status === "uploading" ? <span className="text-[var(--brand-muted)]">Uploading {item.progress}%</span> : null}
                {item.status === "success" ? <span className="text-[#1b7a4d]">Uploaded</span> : null}
                {item.status === "error" ? (
                  <button
                    type="button"
                    onClick={() => clearUploadMessage(item.id)}
                    className="rounded border border-[#f2d0c8] px-2 py-1 text-[#9d3f2d]"
                  >
                    Dismiss
                  </button>
                ) : null}
              </div>
              <div className="h-1.5 overflow-hidden rounded bg-[#f1e7d3]">
                <div
                  className={`h-full transition-all ${item.status === "error" ? "bg-[#c85a47]" : "bg-[var(--brand-gold)]"}`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              {item.error ? <p className="text-[#9d3f2d]">{item.error}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {images.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image, index) => (
            <div key={`${image}-${index}`} className="rounded-xl border border-[#ebdfca] bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(56,46,32,0.1)]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#f1e7d3]">
                <OptimizedImage
                  src={image}
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover object-center"
                  fallbackLabel={`Product image ${index + 1} unavailable`}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => moveImage(index, -1)}
                  className="rounded-md border border-[#e6d7bb] px-2 py-1 text-xs hover:bg-[#f8f0df]"
                >
                  Move Left
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 1)}
                  className="rounded-md border border-[#e6d7bb] px-2 py-1 text-xs hover:bg-[#f8f0df]"
                >
                  Move Right
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="rounded-md border border-[#f2d0c8] px-2 py-1 text-xs text-[#9d3f2d]"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
