import type { ReactNode } from "react";

interface DashboardCardProps {
  label: string;
  value: string | number;
  trend?: string;
  icon?: ReactNode;
}

export function DashboardCard({ label, value, trend, icon }: DashboardCardProps) {
  return (
    <article className="card-luxury rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand-muted)]">{label}</p>
          <p className="mt-2 font-heading text-3xl text-[var(--brand-ink)]">{value}</p>
        </div>
        <div className="rounded-xl bg-[#f6eddb] p-2 text-sm text-[var(--brand-gold-deep)]">{icon ?? "Stat"}</div>
      </div>
      {trend ? <p className="mt-3 text-sm text-[var(--brand-gold-deep)]">{trend}</p> : null}
    </article>
  );
}
