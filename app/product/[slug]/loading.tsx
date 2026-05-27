import { SkeletonLoader } from "@/components/common/SkeletonLoader";

export default function LoadingProduct() {
  return (
    <div className="container-shell py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <SkeletonLoader className="aspect-[4/5] w-full" />
        <div className="space-y-3">
          <SkeletonLoader className="h-8 w-2/3" />
          <SkeletonLoader className="h-5 w-1/3" />
          <SkeletonLoader className="h-32 w-full" />
          <SkeletonLoader className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}
