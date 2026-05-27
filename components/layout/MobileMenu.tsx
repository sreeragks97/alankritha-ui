"use client";

import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/types/product";

interface MobileMenuProps {
  categories: Category[];
}

export function MobileMenu({ categories }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7c9ab] text-[#6c5631] md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} aria-label="Close menu" />
          <aside className="absolute right-0 top-0 h-full w-80 max-w-[88vw] bg-[#fffdf8] p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-heading text-xl">Browse Categories</p>
              <button type="button" onClick={() => setOpen(false)} className="text-lg" aria-label="Close menu">
                ×
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              <Link className="rounded-lg px-3 py-2 hover:bg-[#f5efdf]" href="/" onClick={() => setOpen(false)}>
                Home
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  className="rounded-lg px-3 py-2 hover:bg-[#f5efdf]"
                  href={`/category/${category.slug}`}
                  onClick={() => setOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link className="rounded-lg px-3 py-2 hover:bg-[#f5efdf]" href="/lookbook" onClick={() => setOpen(false)}>
                Lookbook
              </Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-[#f5efdf]" href="/about" onClick={() => setOpen(false)}>
                About
              </Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-[#f5efdf]" href="/contact" onClick={() => setOpen(false)}>
                Contact
              </Link>
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}
