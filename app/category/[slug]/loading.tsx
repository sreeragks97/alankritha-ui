import { SkeletonLoader } from "@/components/common/SkeletonLoader";

export default function LoadingCategory() {
  return (
    <div className="container-shell py-8">
      <SkeletonLoader className="mb-6 h-8 w-56" />
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <SkeletonLoader className="h-[420px] w-full rounded-2xl" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-2xl bg-white p-4">
              <SkeletonLoader className="aspect-[4/5] w-full" />
              <SkeletonLoader className="h-5 w-2/3" />
              <SkeletonLoader className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
