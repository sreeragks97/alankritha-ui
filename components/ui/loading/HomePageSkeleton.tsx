import { PageLoader } from "@/components/ui/loading/PageLoader";
import { SkeletonBanner } from "@/components/ui/loading/SkeletonBanner";
import { FeaturedSectionSkeleton } from "@/components/ui/loading/FeaturedSectionSkeleton";
import { SkeletonGrid } from "@/components/ui/loading/SkeletonGrid";
import { Shimmer } from "@/components/ui/loading/Shimmer";

export function HomePageSkeleton() {
  return (
    <PageLoader label="Loading homepage">
      <div className="container-shell space-y-12 py-6 sm:space-y-16 sm:py-10 md:space-y-20">
        <SkeletonBanner />

        <section className="space-y-4" aria-hidden>
          <div className="space-y-2">
            <Shimmer className="h-7 w-44" />
            <Shimmer className="h-4 w-72" />
          </div>
          <SkeletonGrid className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5" count={5} variant="card" />
        </section>

        <FeaturedSectionSkeleton />
        <FeaturedSectionSkeleton />

        <section className="card-luxury p-6 sm:p-10" aria-hidden>
          <div className="space-y-3">
            <Shimmer className="mx-auto h-8 w-2/3" />
            <Shimmer className="mx-auto h-4 w-4/5" />
            <Shimmer className="mx-auto h-11 w-48 rounded-full" />
          </div>
        </section>
      </div>
    </PageLoader>
  );
}
