import { cn } from "@/lib/cn";

interface ShimmerProps {
  className?: string;
  ariaHidden?: boolean;
}

export function Shimmer({ className, ariaHidden = true }: ShimmerProps) {
  return <div className={cn("animate-shimmer rounded-xl", className)} aria-hidden={ariaHidden} />;
}
