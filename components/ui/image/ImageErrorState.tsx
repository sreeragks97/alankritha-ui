import { cn } from "@/lib/cn";

interface ImageErrorStateProps {
  label?: string;
  className?: string;
}

export function ImageErrorState({ label = "Failed to load image", className }: ImageErrorStateProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-[inherit] border border-dashed border-[#e3c5ba] bg-[#fff4f1] px-3 text-center",
        className,
      )}
      role="img"
      aria-label={label}
    >
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8a4b3a]">{label}</p>
    </div>
  );
}
