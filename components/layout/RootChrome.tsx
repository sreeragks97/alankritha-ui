"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloatingButton } from "@/components/common/WhatsAppFloatingButton";

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
      <Navbar />
      <main className="flex-1 pb-[calc(5.25rem+env(safe-area-inset-bottom))] md:pb-12">{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
}
