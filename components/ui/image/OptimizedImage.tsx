"use client";

import { useMemo, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";
import { ImageFallback } from "@/components/ui/image/ImageFallback";
import { ImagePlaceholder } from "@/components/ui/image/ImagePlaceholder";

type ResolvedSrc = ImageProps["src"] | null | undefined;

interface OptimizedImageProps extends Omit<ImageProps, "src" | "alt" | "placeholder" | "blurDataURL"> {
  src?: ResolvedSrc;
  alt?: string;
  containerClassName?: string;
  fallbackLabel?: string;
  showLoadingPlaceholder?: boolean;
}

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PScxNic+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2JyBmaWxsPScjZjJlYWRhJy8+PC9zdmc+";

function hasUsableSource(src: ResolvedSrc): src is ImageProps["src"] {
  if (typeof src === "string") {
    return src.trim().length > 0;
  }

  return Boolean(src);
}

export function OptimizedImage({
  src,
  alt = "",
  className,
  containerClassName,
  fallbackLabel,
  showLoadingPlaceholder = true,
  sizes = "100vw",
  quality = 86,
  priority = false,
  ...rest
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const statusLabel = useMemo(() => {
    if (fallbackLabel) return fallbackLabel;
    if (alt.trim().length > 0) return alt;
    return "Image unavailable";
  }, [alt, fallbackLabel]);

  if (!hasUsableSource(src)) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden", containerClassName)}>
        <ImageFallback variant="missing" label={statusLabel} />
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden", containerClassName)}>
      {showLoadingPlaceholder && !hasError && !isLoaded ? <ImagePlaceholder /> : null}

      {hasError ? (
        <ImageFallback variant="error" label={statusLabel} />
      ) : (
        <Image
          {...rest}
          src={src}
          alt={alt}
          sizes={sizes}
          quality={quality}
          priority={priority}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            "transition-opacity duration-500 ease-out",
            isLoaded ? "opacity-100" : "opacity-0",
            className,
          )}
        />
      )}
    </div>
  );
}
