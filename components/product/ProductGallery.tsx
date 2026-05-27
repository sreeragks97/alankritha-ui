"use client";

import { useMemo, useState } from "react";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const safeImages = useMemo(() => (images.length ? images : ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80"]), [images]);

  return (
    <div>
      <div className="md:hidden">
        <div className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl">
          {safeImages.map((image, index) => (
            <div key={image + index} className="w-full shrink-0 snap-center">
              <div className="aspect-[4/5] w-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} aria-label={alt} />
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
              className={`aspect-square w-full overflow-hidden rounded-xl border ${
                index === active ? "border-[var(--brand-gold)]" : "border-[#e3d8c1]"
              }`}
            >
              <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
            </button>
          ))}
        </div>
        <div className="card-luxury overflow-hidden">
          <div
            className="aspect-[4/5] w-full bg-cover bg-center transition-transform duration-500 hover:scale-110"
            style={{ backgroundImage: `url(${safeImages[active]})` }}
            aria-label={alt}
          />
        </div>
      </div>
    </div>
  );
}
