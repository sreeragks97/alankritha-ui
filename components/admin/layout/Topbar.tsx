"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Breadcrumbs } from "@/components/admin/layout/Breadcrumbs";

interface TopbarProps {
  onOpenMenu: () => void;
}

export function Topbar({ onOpenMenu }: TopbarProps) {
  const [open, setOpen] = useState(false);
  const menuTransition = { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <header className="sticky top-0 z-20 border-b border-[#e8dcc3] bg-[#fff9ef]/90 backdrop-blur-lg">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="rounded-lg border border-[#dcc9a2] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-ink)] shadow-[0_8px_16px_rgba(49,39,23,0.08)] lg:hidden"
          >
            Menu
          </button>
          <div className="min-w-0">
            <p className="truncate font-heading text-xl text-[var(--brand-ink)] sm:text-2xl">Admin Workspace</p>
            <Breadcrumbs />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden rounded-xl border border-[#e8dcc3] bg-white px-3 py-2 text-sm text-[var(--brand-muted)] sm:block">Notifications 3</div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="rounded-xl border border-[#e8dcc3] bg-white px-3 py-2 text-sm font-medium text-[var(--brand-ink)] shadow-[0_8px_16px_rgba(49,39,23,0.08)]"
              aria-expanded={open}
              aria-controls="admin-user-menu"
            >
              Ananya S
            </button>
            <AnimatePresence>
              {open ? (
                <motion.div
                  id="admin-user-menu"
                  className="absolute right-0 mt-2 w-44 rounded-xl border border-[#e8dcc3] bg-white p-2 text-sm shadow-lg"
                  role="menu"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={menuTransition}
                >
                  <button type="button" className="w-full rounded-lg px-3 py-2 text-left hover:bg-[#f6efde]" role="menuitem">
                    My Profile
                  </button>
                  <button type="button" className="w-full rounded-lg px-3 py-2 text-left hover:bg-[#f6efde]" role="menuitem">
                    Preferences
                  </button>
                  <button type="button" className="w-full rounded-lg px-3 py-2 text-left text-[#9d3f2d] hover:bg-[#fceee9]" role="menuitem">
                    Sign Out
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
