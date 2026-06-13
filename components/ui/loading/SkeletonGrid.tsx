import { SkeletonCard } from "@/components/ui/loading/SkeletonCard";
import { SkeletonProduct } from "@/components/ui/loading/SkeletonProduct";

interface SkeletonGridProps {
  count?: number;
  variant?: "product" | "card";
  className?: string;
}

export function SkeletonGrid({ count = 6, variant = "product", className }: SkeletonGridProps) {
  const items = Array.from({ length: count });

  return (
    <div className={className}>
      {items.map((_, index) =>
        variant === "product" ? <SkeletonProduct key={index} /> : <SkeletonCard key={index} className="h-36 w-full rounded-2xl" />,
      )}
    </div>
  );
}
