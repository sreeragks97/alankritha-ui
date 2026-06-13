import { cn } from "@/lib/cn";
import { Shimmer } from "@/components/ui/loading/Shimmer";

interface SkeletonLoaderProps {
  className?: string;
}

export function SkeletonLoader({ className }: SkeletonLoaderProps) {
  return <Shimmer className={cn("rounded-xl", className)} />;
}
