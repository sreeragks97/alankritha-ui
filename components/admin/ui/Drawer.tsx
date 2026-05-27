"use client";

import type { ReactNode } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Drawer({ open, onClose, title, children }: DrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close drawer" />
      <div className="absolute left-0 top-0 h-full w-[86vw] max-w-sm bg-[var(--brand-card)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e8dcc3] px-4 py-4">
          <p className="font-heading text-xl">{title}</p>
          <button type="button" className="rounded-md border border-[#e8dcc3] px-2 py-1 text-xs" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="h-[calc(100%-65px)] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
