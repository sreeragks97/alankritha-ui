import { PageLoader } from "@/components/ui/loading/PageLoader";
import { ProductGridSkeleton } from "@/components/ui/loading/ProductGridSkeleton";
import { SkeletonCard } from "@/components/ui/loading/SkeletonCard";
import { Shimmer } from "@/components/ui/loading/Shimmer";

export function CategoryPageSkeleton() {
  return (
    <PageLoader label="Loading category products">
      <div className="container-shell py-8 sm:py-10 md:py-12">
        <div className="mb-5 space-y-2" aria-hidden>
          <Shimmer className="h-8 w-44" />
          <Shimmer className="h-4 w-64" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
          <div className="hidden lg:block" aria-hidden>
            <SkeletonCard className="h-[440px] w-full rounded-2xl" />
          </div>

          <ProductGridSkeleton className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4" count={8} />
        </div>
      </div>
    </PageLoader>
  );
}
