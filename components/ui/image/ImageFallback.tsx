import { ImageErrorState } from "@/components/ui/image/ImageErrorState";
import { MissingImageState } from "@/components/ui/image/MissingImageState";

interface ImageFallbackProps {
  variant?: "missing" | "error";
  label?: string;
}

export function ImageFallback({ variant = "missing", label }: ImageFallbackProps) {
  if (variant === "error") {
    return <ImageErrorState label={label} />;
  }

  return <MissingImageState label={label} />;
}
