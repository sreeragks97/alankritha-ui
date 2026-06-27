"use client";

import { useEffect, useSyncExternalStore } from "react";

let lockCount = 0;
let previousOverflow = "";

/**
 * Locks body scroll while `locked` is true and marks the document with a
 * `data-overlay-open` attribute. Ref-counted so multiple overlays compose
 * safely — the body is only restored once the last lock is released.
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      document.body.dataset.overlayOpen = "true";
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow;
        delete document.body.dataset.overlayOpen;
      }
    };
  }, [locked]);
}

const subscribe = () => () => {};

/**
 * Returns true only after the component has mounted on the client. Useful to
 * guard `createPortal`, which needs `document` and must not run during SSR.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
