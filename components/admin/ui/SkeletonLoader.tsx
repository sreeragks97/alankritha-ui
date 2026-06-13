import { Shimmer } from "@/components/ui/loading/Shimmer";

interface SkeletonLoaderProps {
  className?: string;
}

export function SkeletonLoader({ className = "h-8 w-full" }: SkeletonLoaderProps) {
  return <Shimmer className={`rounded-xl ${className}`} />;
}
