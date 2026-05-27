import { SkeletonLoader } from "@/components/common/SkeletonLoader";

export default function Loading() {
  return (
    <div className="container-shell space-y-6 py-8">
      <SkeletonLoader className="h-72 w-full" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3 rounded-2xl bg-white p-4">
            <SkeletonLoader className="aspect-[4/5] w-full" />
            <SkeletonLoader className="h-5 w-2/3" />
            <SkeletonLoader className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
