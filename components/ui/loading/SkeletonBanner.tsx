import { Shimmer } from "@/components/ui/loading/Shimmer";

export function SkeletonBanner() {
  return (
    <div className="card-luxury relative min-h-[17rem] overflow-hidden p-5 sm:min-h-[21rem] sm:p-10" aria-hidden>
      <Shimmer className="absolute inset-0 rounded-[inherit]" />
      <div className="relative max-w-xl space-y-3">
        <Shimmer className="h-6 w-32" />
        <Shimmer className="h-9 w-5/6" />
        <Shimmer className="h-5 w-4/5" />
        <Shimmer className="h-11 w-44 rounded-full" />
      </div>
    </div>
  );
}
