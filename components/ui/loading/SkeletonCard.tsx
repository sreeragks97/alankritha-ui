import { Shimmer } from "@/components/ui/loading/Shimmer";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return <Shimmer className={className ?? "h-36 w-full rounded-2xl"} />;
}
