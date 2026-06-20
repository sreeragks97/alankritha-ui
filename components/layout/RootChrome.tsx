"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloatingButton } from "@/components/common/WhatsAppFloatingButton";
import type { Category } from "@/types/product";

interface RootChromeProps {
  children: ReactNode;
  categories: Category[];
}

export function RootChrome({ children, categories }: RootChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar categories={categories} />
      <main className="flex-1 pb-[calc(5.25rem+env(safe-area-inset-bottom))] md:pb-12">{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
}
