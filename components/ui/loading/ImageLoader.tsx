import { cn } from "@/lib/cn";
import { Shimmer } from "@/components/ui/loading/Shimmer";

interface ImageLoaderProps {
  className?: string;
}

export function ImageLoader({ className }: ImageLoaderProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)} aria-hidden>
      <Shimmer className="h-full w-full rounded-[inherit]" />
    </div>
  );
}
