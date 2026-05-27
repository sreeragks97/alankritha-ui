import { cn } from "@/lib/cn";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const tone = status.toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
        tone === "active" || tone === "new"
          ? "bg-[#e8f8ee] text-[#1d7f4a]"
          : tone === "contacted" || tone === "quoted"
            ? "bg-[#fff2dd] text-[#996012]"
            : tone === "closed"
              ? "bg-[#eaf0ff] text-[#3250a0]"
              : tone === "draft"
                ? "bg-[#ece7f9] text-[#5b3d9a]"
                : "bg-[#f8e5e1] text-[#9d3f2d]",
      )}
    >
      {status}
    </span>
  );
}
