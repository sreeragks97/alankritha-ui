import { Shimmer } from "@/components/ui/loading/Shimmer";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  const rowItems = Array.from({ length: rows });
  const columnItems = Array.from({ length: columns });

  return (
    <div className="overflow-hidden rounded-2xl border border-[#eadfc9]" aria-hidden>
      <div className="border-b border-[#eadfc9] bg-[#fff9ef] p-3">
        <Shimmer className="h-4 w-40" />
      </div>
      <div className="space-y-2 p-3">
        {rowItems.map((_, rowIndex) => (
          <div key={rowIndex} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {columnItems.map((__, columnIndex) => (
              <Shimmer key={columnIndex} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
