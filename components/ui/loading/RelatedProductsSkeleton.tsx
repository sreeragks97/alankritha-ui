import { ProductGridSkeleton } from "@/components/ui/loading/ProductGridSkeleton";
import { Shimmer } from "@/components/ui/loading/Shimmer";

export function RelatedProductsSkeleton() {
  return (
    <section className="space-y-4" aria-hidden>
      <div className="space-y-2">
        <Shimmer className="h-7 w-48" />
        <Shimmer className="h-4 w-64" />
      </div>
      <ProductGridSkeleton className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4" count={4} />
    </section>
  );
}
