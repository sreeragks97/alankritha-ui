import { ImageLoader } from "@/components/ui/loading/ImageLoader";
import { Shimmer } from "@/components/ui/loading/Shimmer";

export function SkeletonProduct() {
  return (
    <div className="card-luxury overflow-hidden p-3 sm:p-4" aria-hidden>
      <ImageLoader className="aspect-[4/5] w-full rounded-xl" />
      <div className="mt-3 space-y-2.5">
        <Shimmer className="h-4 w-4/5" />
        <Shimmer className="h-3.5 w-2/5" />
        <Shimmer className="h-4 w-1/3" />
      </div>
      <div className="mt-4 grid gap-2">
        <Shimmer className="h-10 w-full rounded-full" />
        <Shimmer className="h-10 w-full rounded-full" />
      </div>
    </div>
  );
}
