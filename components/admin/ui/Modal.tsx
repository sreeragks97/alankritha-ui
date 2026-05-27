"use client";

import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close modal" />
      <div className="relative w-full max-w-xl rounded-2xl border border-[#e8dcc3] bg-[var(--brand-card)] shadow-2xl">
        <div className="border-b border-[#ede3d1] px-5 py-4">
          <h3 className="font-heading text-2xl">{title}</h3>
        </div>
        <div className="max-h-[65vh] overflow-y-auto p-5">{children}</div>
        {footer ? <div className="border-t border-[#ede3d1] px-5 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
