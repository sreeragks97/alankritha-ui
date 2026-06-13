import { PageLoader } from "@/components/ui/loading/PageLoader";
import { RelatedProductsSkeleton } from "@/components/ui/loading/RelatedProductsSkeleton";
import { Shimmer } from "@/components/ui/loading/Shimmer";
import { ImageLoader } from "@/components/ui/loading/ImageLoader";

export function ProductPageSkeleton() {
  return (
    <PageLoader label="Loading product details">
      <div className="container-shell py-8 sm:py-10 md:py-12">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-2 lg:gap-10" aria-hidden>
          <ImageLoader className="aspect-[4/5] w-full rounded-2xl" />
          <div className="card-luxury space-y-4 p-5 sm:p-7 md:p-8">
            <Shimmer className="h-6 w-28 rounded-full" />
            <Shimmer className="h-10 w-4/5" />
            <Shimmer className="h-6 w-1/3" />
            <Shimmer className="h-20 w-full" />
            <Shimmer className="h-11 w-full rounded-full" />
          </div>
        </div>

        <div className="mt-12 sm:mt-16">
          <RelatedProductsSkeleton />
        </div>
      </div>
    </PageLoader>
  );
}
