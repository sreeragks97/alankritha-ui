"use client";

import { useRef } from "react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const pushFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next = [...images, ...Array.from(files).map((file) => URL.createObjectURL(file))];
    onChange(next);
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
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#d7c49a] bg-[#fffaf0] px-4 py-9 text-center transition-all duration-200 hover:border-[#c8ab73] hover:bg-[#fff7e8]"
      >
        <span className="text-sm font-semibold text-[var(--brand-ink)]">Drag and drop image upload area</span>
        <span className="mt-1 text-xs text-[var(--brand-muted)]">Click to add multiple product images (mock preview only)</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => pushFiles(event.target.files)}
      />

      {images.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image, index) => (
            <div key={`${image}-${index}`} className="rounded-xl border border-[#ebdfca] bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(56,46,32,0.1)]">
              <div className="aspect-[4/3] rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
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
