"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const safeImages = useMemo(() => (images.length ? images : ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80"]), [images]);
  const transition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div>
      <div className="md:hidden">
        <div className="flex snap-x snap-mandatory overflow-x-auto rounded-[1.25rem] border border-[#e6dac2] bg-white/70 p-1">
          {safeImages.map((image, index) => (
            <div key={image + index} className="w-full shrink-0 snap-center">
              <div className="aspect-[4/5] w-full rounded-[1rem] bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} aria-label={alt} />
            </div>
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
                index === active
                  ? "border-[var(--brand-gold)] shadow-[0_10px_20px_rgba(176,139,70,0.22)]"
                  : "border-[#e3d8c1] hover:border-[#d2bb8f]"
              }`}
              aria-label={`View image ${index + 1}`}
              aria-pressed={index === active}
            >
              <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
            </button>
          ))}
        </div>
        <div className="card-luxury overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={safeImages[active]}
              className="aspect-[4/5] w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${safeImages[active]})` }}
              aria-label={alt}
              initial={{ opacity: 0.55, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.45, scale: 1.01 }}
              transition={transition}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
