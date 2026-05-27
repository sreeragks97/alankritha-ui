"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Drawer({ open, onClose, title, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-label="Close drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="absolute left-0 top-0 h-full w-[84vw] max-w-sm bg-[var(--brand-card)] shadow-2xl"
            initial={{ x: -28, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -28, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-[#e8dcc3] px-4 py-4">
              <p className="font-heading text-xl">{title}</p>
              <button
                type="button"
                className="rounded-md border border-[#e8dcc3] px-2 py-1 text-xs hover:bg-[#f6efde]"
                onClick={onClose}
              >
                Close
              </button>
            </div>
            <div className="h-[calc(100%-65px)] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
