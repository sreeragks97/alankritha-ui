"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/admin/layout/Breadcrumbs";

interface TopbarProps {
  onOpenMenu: () => void;
}

export function Topbar({ onOpenMenu }: TopbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-[#e8dcc3] bg-[#fff9ef]/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="rounded-lg border border-[#dcc9a2] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-ink)] lg:hidden"
          >
            Menu
          </button>
          <div>
            <p className="font-heading text-2xl text-[var(--brand-ink)]">Admin Workspace</p>
            <Breadcrumbs />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[#e8dcc3] bg-white px-3 py-2 text-sm text-[var(--brand-muted)]">Notifications 3</div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="rounded-xl border border-[#e8dcc3] bg-white px-3 py-2 text-sm font-medium text-[var(--brand-ink)]"
            >
              Ananya S
            </button>
            {open ? (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-[#e8dcc3] bg-white p-2 text-sm shadow-lg">
                <button type="button" className="w-full rounded-lg px-3 py-2 text-left hover:bg-[#f6efde]">
                  My Profile
                </button>
                <button type="button" className="w-full rounded-lg px-3 py-2 text-left hover:bg-[#f6efde]">
                  Preferences
                </button>
                <button type="button" className="w-full rounded-lg px-3 py-2 text-left text-[#9d3f2d] hover:bg-[#fceee9]">
                  Sign Out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
