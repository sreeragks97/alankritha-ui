import { LoadingPlaceholder } from "@/components/ui/image/LoadingPlaceholder";

interface ImagePlaceholderProps {
  className?: string;
}

export function ImagePlaceholder({ className }: ImagePlaceholderProps) {
  return <LoadingPlaceholder className={className} />;
}
