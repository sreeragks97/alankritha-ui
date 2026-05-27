"use client";

import { useCallback, useState } from "react";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone?: "success" | "error" | "info";
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);

    window.setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  return { toasts, showToast, removeToast };
}
