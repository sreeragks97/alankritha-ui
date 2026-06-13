"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ToastItem } from "@/hooks/useToast";

interface ToastNotificationProps {
  items: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastNotification({ items, onDismiss }: ToastNotificationProps) {
  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-2 right-2 z-[60] space-y-2 sm:left-auto sm:right-5">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="w-[min(22rem,calc(100vw-1rem))] rounded-xl border border-[#e8dcc3] bg-white p-3 shadow-lg"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--brand-ink)]">{item.title}</p>
                {item.description ? <p className="mt-1 text-xs text-[var(--brand-muted)]">{item.description}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(item.id)}
                className="inline-flex min-h-9 items-center rounded-md border border-[#ece1cf] px-2 py-1 text-xs hover:bg-[#f8f0df]"
              >
                Close
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
