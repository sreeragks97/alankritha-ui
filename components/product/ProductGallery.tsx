"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OptimizedImage } from "@/components/ui/image";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const safeImages = useMemo(() => (images.length ? images : [""]), [images]);
  const activeIndex = Math.min(active, safeImages.length - 1);
  const transition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }

      if (event.key === "ArrowRight") {
        setActive((prev) => (prev + 1) % safeImages.length);
      }

      if (event.key === "ArrowLeft") {
        setActive((prev) => (prev - 1 + safeImages.length) % safeImages.length);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, safeImages.length]);

  const moveNext = () => {
    setActive((prev) => (prev + 1) % safeImages.length);
  };

  const movePrevious = () => {
    setActive((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const onTouchEnd = (endX: number) => {
    if (touchStartX === null) return;
    const delta = endX - touchStartX;

    if (Math.abs(delta) >= 40) {
      if (delta < 0) {
        moveNext();
      } else {
        movePrevious();
      }
    }

    setTouchStartX(null);
  };

  return (
    <div className="space-y-3">
      <div className="md:hidden">
        <div className="card-luxury relative overflow-hidden p-1">
          <button
            type="button"
            className="relative block w-full overflow-hidden rounded-[1rem]"
            onClick={() => setLightboxOpen(true)}
            onTouchStart={(event) => setTouchStartX(event.changedTouches[0]?.clientX ?? null)}
            onTouchEnd={(event) => onTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
            aria-label={`Open image ${activeIndex + 1} in full view`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${safeImages[activeIndex]}-mobile`}
                className="relative aspect-[4/5] w-full"
                initial={{ opacity: 0.55, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.45, scale: 1.01 }}
                transition={transition}
              >
                <OptimizedImage
                  src={safeImages[activeIndex]}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 0px"
                  className="object-cover object-center"
                  fallbackLabel={`${alt} image unavailable`}
                />
              </motion.div>
            </AnimatePresence>
          </button>

          {safeImages.length > 1 ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
              <button
                type="button"
                className="pointer-events-auto touch-target inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,255,255,0.88)] text-[#3a2f1d] shadow-[0_10px_18px_rgba(26,20,12,0.2)]"
                onClick={movePrevious}
                aria-label="View previous image"
              >
                {'<'}
              </button>
              <button
                type="button"
                className="pointer-events-auto touch-target inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,255,255,0.88)] text-[#3a2f1d] shadow-[0_10px_18px_rgba(26,20,12,0.2)]"
                onClick={moveNext}
                aria-label="View next image"
              >
                {'>'}
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 px-1">
          <p className="text-xs uppercase tracking-[0.11em] text-[var(--brand-muted)]">
            {activeIndex + 1} / {safeImages.length}
          </p>
          <div className="flex items-center gap-1.5">
            {safeImages.map((image, index) => (
              <button
                key={`${image}-dot-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all ${index === activeIndex ? "w-6 bg-[var(--brand-gold)]" : "w-2.5 bg-[#d8c9ae]"}`}
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === activeIndex}
              />
            ))}
          </div>
        </div>

        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((image, index) => (
            <button
              type="button"
              key={`${image}-mobile-thumb-${index}`}
              onClick={() => setActive(index)}
              className={`aspect-square w-14 shrink-0 overflow-hidden rounded-lg border transition-all duration-200 ${
                index === activeIndex
                  ? "border-[var(--brand-gold)] shadow-[0_8px_14px_rgba(176,139,70,0.2)]"
                  : "border-[#e3d8c1]"
              }`}
              aria-label={`Select image ${index + 1}`}
              aria-pressed={index === activeIndex}
            >
              <div className="relative h-full w-full">
                <OptimizedImage
                  src={image}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  sizes="56px"
                  className="object-cover object-center"
                  fallbackLabel={`${alt} thumbnail unavailable`}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="hidden gap-4 md:grid md:grid-cols-[88px_1fr]">
        <div className="space-y-3">
          {safeImages.map((image, index) => (
            <button
              type="button"
              key={image + index}
              onClick={() => setActive(index)}
              className={`aspect-square w-full overflow-hidden rounded-xl border transition-all duration-200 ${
                index === activeIndex
                  ? "border-[var(--brand-gold)] shadow-[0_10px_20px_rgba(176,139,70,0.22)]"
                  : "border-[#e3d8c1] hover:border-[#d2bb8f]"
              }`}
              aria-label={`View image ${index + 1}`}
              aria-pressed={index === activeIndex}
            >
              <div className="relative h-full w-full">
                <OptimizedImage
                  src={image}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  sizes="88px"
                  className="object-cover object-center"
                  fallbackLabel={`${alt} thumbnail unavailable`}
                />
              </div>
            </button>
          ))}
        </div>
        <div className="card-luxury overflow-hidden">
          <button
            type="button"
            className="w-full"
            onClick={() => setLightboxOpen(true)}
            aria-label={`Open image ${activeIndex + 1} in full view`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={safeImages[activeIndex]}
                className="relative aspect-[4/5] w-full"
                initial={{ opacity: 0.55, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.45, scale: 1.01 }}
                transition={transition}
              >
                <OptimizedImage
                  src={safeImages[activeIndex]}
                  alt={alt}
                  fill
                  sizes="(max-width: 1280px) 70vw, 820px"
                  className="object-cover object-center"
                  fallbackLabel={`${alt} image unavailable`}
                />
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(15,12,9,0.92)] p-3 sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-label="Product image lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            <button
              type="button"
              className="absolute inset-0"
              aria-label="Close image lightbox"
              onClick={() => setLightboxOpen(false)}
            />

            <motion.div
              className="relative z-10 mx-auto flex h-full w-full max-w-4xl flex-col justify-center gap-3"
              initial={{ y: 8, opacity: 0.6 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0.6 }}
              transition={transition}
            >
              <div className="flex items-center justify-between text-sm text-[#f4e9d2]">
                <p>
                  {activeIndex + 1} / {safeImages.length}
                </p>
                <button
                  type="button"
                  className="touch-target inline-flex min-h-11 items-center justify-center rounded-full border border-[#8e7a53] px-4 py-2 text-sm font-semibold"
                  onClick={() => setLightboxOpen(false)}
                >
                  Close
                </button>
              </div>

              <div className="relative">
                <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[#8a7b58] bg-[#1d1811]">
                  <div className="relative aspect-[4/5] w-full">
                    <OptimizedImage
                      src={safeImages[activeIndex]}
                      alt={alt}
                      fill
                      sizes="(max-width: 1280px) 90vw, 980px"
                      className="object-contain object-center"
                      fallbackLabel={`${alt} image unavailable`}
                    />
                  </div>
                </div>

                {safeImages.length > 1 ? (
                  <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-4">
                    <button
                      type="button"
                      className="pointer-events-auto touch-target inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#8e7a53] bg-[rgba(39,30,20,0.8)] text-[#f8eecf]"
                      onClick={movePrevious}
                      aria-label="View previous image"
                    >
                      {'<'}
                    </button>
                    <button
                      type="button"
                      className="pointer-events-auto touch-target inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#8e7a53] bg-[rgba(39,30,20,0.8)] text-[#f8eecf]"
                      onClick={moveNext}
                      aria-label="View next image"
                    >
                      {'>'}
                    </button>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
