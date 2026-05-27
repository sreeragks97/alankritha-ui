import { SkeletonLoader } from "@/components/admin/ui/SkeletonLoader";

export default function AdminLoading() {
  return (
    <div className="space-y-4">
      <SkeletonLoader className="h-12 w-72" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SkeletonLoader className="h-28 w-full" />
        <SkeletonLoader className="h-28 w-full" />
        <SkeletonLoader className="h-28 w-full" />
        <SkeletonLoader className="h-28 w-full" />
      </div>
      <SkeletonLoader className="h-64 w-full" />
    </div>
  );
}
