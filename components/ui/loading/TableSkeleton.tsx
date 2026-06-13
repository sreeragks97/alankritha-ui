import { PageLoader } from "@/components/ui/loading/PageLoader";
import { SkeletonTable } from "@/components/ui/loading/SkeletonTable";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  label?: string;
}

export function TableSkeleton({ rows = 6, columns = 5, label = "Loading table data" }: TableSkeletonProps) {
  return (
    <PageLoader label={label}>
      <SkeletonTable rows={rows} columns={columns} />
    </PageLoader>
  );
}
