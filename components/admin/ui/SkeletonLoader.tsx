interface SkeletonLoaderProps {
  className?: string;
}

export function SkeletonLoader({ className = "h-8 w-full" }: SkeletonLoaderProps) {
  return <div className={`animate-shimmer rounded-xl ${className}`} />;
}
