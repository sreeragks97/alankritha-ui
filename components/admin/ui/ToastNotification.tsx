"use client";

import type { ToastItem } from "@/hooks/useToast";

interface ToastNotificationProps {
  items: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastNotification({ items, onDismiss }: ToastNotificationProps) {
  return (
    <div className="fixed bottom-5 right-5 z-[60] space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="w-72 rounded-xl border border-[#e8dcc3] bg-white p-3 shadow-lg"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--brand-ink)]">{item.title}</p>
              {item.description ? <p className="mt-1 text-xs text-[var(--brand-muted)]">{item.description}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(item.id)}
              className="rounded-md border border-[#ece1cf] px-2 py-1 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
