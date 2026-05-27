"use client";

import { Modal } from "@/components/admin/ui/Modal";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmationDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-lg border border-[#e8dcc3] px-3 py-2 text-sm">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="rounded-lg bg-[#9d3f2d] px-3 py-2 text-sm font-semibold text-white">
            Confirm Delete
          </button>
        </div>
      }
    >
      <p className="text-sm text-[var(--brand-muted)]">{message}</p>
    </Modal>
  );
}
