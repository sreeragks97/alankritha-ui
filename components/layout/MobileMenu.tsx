"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND } from "@/lib/constants";
import type { Category } from "@/types/product";

interface MobileMenuProps {
  categories: Category[];
}

export function MobileMenu({ categories }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuTransition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="touch-target inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d7c9ab] bg-white/85 text-lg text-[#6c5631] shadow-[0_8px_18px_rgba(33,28,20,0.08)] md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-catalog-menu"
      >
        ☰
      </button>

      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.button
              type="button"
              className="absolute inset-0 bg-[rgba(29,26,22,0.34)] backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={menuTransition}
            />
            <motion.aside
              id="mobile-catalog-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Browse menu"
              className="absolute right-0 top-0 h-full w-[min(22rem,92vw)] overflow-y-auto bg-[#fffdf8] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl"
              initial={{ x: 28, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 28, opacity: 0 }}
              transition={menuTransition}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="kicker">Navigation</p>
                  <p className="font-heading text-xl text-[#2f281d]">Browse Categories</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="touch-target inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e3d5bb] text-lg text-[#5d4b2b]"
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>
              <nav className="flex flex-col gap-1.5" aria-label="Mobile navigation">
                <Link
                  className="touch-target inline-flex min-h-11 items-center rounded-xl px-3 py-2.5 text-[0.96rem] text-[#4d412f] hover:bg-[#f5efdf]"
                  href="/"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    className="touch-target inline-flex min-h-11 items-center rounded-xl px-3 py-2.5 text-[0.96rem] text-[#4d412f] hover:bg-[#f5efdf]"
                    href={`/category/${category.slug}`}
                    onClick={() => setOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
                <Link className="touch-target inline-flex min-h-11 items-center rounded-xl px-3 py-2.5 text-[0.96rem] text-[#4d412f] hover:bg-[#f5efdf]" href="/lookbook" onClick={() => setOpen(false)}>
                  Lookbook
                </Link>
                <Link className="touch-target inline-flex min-h-11 items-center rounded-xl px-3 py-2.5 text-[0.96rem] text-[#4d412f] hover:bg-[#f5efdf]" href="/about" onClick={() => setOpen(false)}>
                  About
                </Link>
                <Link className="touch-target inline-flex min-h-11 items-center rounded-xl px-3 py-2.5 text-[0.96rem] text-[#4d412f] hover:bg-[#f5efdf]" href="/contact" onClick={() => setOpen(false)}>
                  Contact
                </Link>
              </nav>

              <a
                href={`https://wa.me/${BRAND.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#1FAF5D] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_22px_rgba(31,175,93,0.24)]"
              >
                Enquire on WhatsApp
              </a>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
