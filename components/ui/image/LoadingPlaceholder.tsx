import { cn } from "@/lib/cn";
import { Shimmer } from "@/components/ui/loading/Shimmer";

interface LoadingPlaceholderProps {
  className?: string;
}

export function LoadingPlaceholder({ className }: LoadingPlaceholderProps) {
  return (
    <div className={cn("absolute inset-0", className)} aria-hidden>
      <Shimmer className="h-full w-full rounded-[inherit]" />
    </div>
  );
}
