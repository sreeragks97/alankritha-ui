"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloatingButton } from "@/components/common/WhatsAppFloatingButton";
import { categories } from "@/lib/data";

interface RootChromeProps {
  children: ReactNode;
}

export function RootChrome({ children }: RootChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar categories={categories} />
      <main className="flex-1 pb-24 md:pb-10">{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
}
