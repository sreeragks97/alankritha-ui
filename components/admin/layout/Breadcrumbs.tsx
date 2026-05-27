"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const titleMap: Record<string, string> = {
  admin: "Dashboard",
  products: "Products",
  categories: "Categories",
  banners: "Banners",
  "media-library": "Media Library",
  "whatsapp-leads": "WhatsApp Leads",
  settings: "Settings",
  new: "New",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = titleMap[segment] ?? segment.toUpperCase();
    return { href, label };
  });

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.12em] text-[var(--brand-muted)]">
      {crumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-2">
          {index === crumbs.length - 1 ? (
            <span className="text-[var(--brand-gold-deep)]">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-[var(--brand-ink)]">
              {crumb.label}
            </Link>
          )}
          {index !== crumbs.length - 1 ? <span>/</span> : null}
        </div>
      ))}
    </div>
  );
}
