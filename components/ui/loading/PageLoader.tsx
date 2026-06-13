import type { ReactNode } from "react";

interface PageLoaderProps {
  label?: string;
  children: ReactNode;
}

export function PageLoader({ label = "Loading content", children }: PageLoaderProps) {
  return (
    <section role="status" aria-live="polite" aria-atomic="true">
      <span className="sr-only">{label}</span>
      {children}
    </section>
  );
}
