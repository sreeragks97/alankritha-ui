import { SkeletonGrid } from "@/components/ui/loading/SkeletonGrid";

interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export function ProductGridSkeleton({ count = 6, className }: ProductGridSkeletonProps) {
  return <SkeletonGrid count={count} variant="product" className={className} />;
}
