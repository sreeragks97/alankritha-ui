import { PageLoader } from "@/components/ui/loading/PageLoader";
import { SkeletonCard } from "@/components/ui/loading/SkeletonCard";
import { SkeletonTable } from "@/components/ui/loading/SkeletonTable";

export function DashboardSkeleton() {
  return (
    <PageLoader label="Loading admin dashboard">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-hidden>
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} className="h-28 w-full rounded-2xl" />
          ))}
        </div>

        <SkeletonTable rows={6} columns={5} />
      </div>
    </PageLoader>
  );
}
