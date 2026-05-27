"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/media-library", label: "Media Library" },
  { href: "/admin/whatsapp-leads", label: "WhatsApp Leads" },
  { href: "/admin/settings", label: "Settings" },
];

interface SidebarProps {
  compact?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ compact, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "h-full bg-[linear-gradient(180deg,#fffefb_0%,#fdf8ed_100%)]",
        compact ? "w-full" : "w-72 border-r border-[#e8dcc3]",
      )}
    >
      <div className="border-b border-[#e8dcc3] px-6 py-5">
        <p className="font-heading text-2xl tracking-[0.03em] text-[var(--brand-ink)]">Alankritha Admin</p>
        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--brand-muted)]">Jewellery Catalog Desk</p>
      </div>

      <nav className="space-y-1.5 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-[#efe3cb] text-[var(--brand-ink)] shadow-[0_10px_22px_rgba(55,44,26,0.12)]"
                  : "text-[var(--brand-muted)] hover:bg-[#f8f3e8] hover:text-[var(--brand-ink)]",
              )}
            >
              {item.label}
              {isActive ? <span className="h-2 w-2 rounded-full bg-[var(--brand-gold)]" /> : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
