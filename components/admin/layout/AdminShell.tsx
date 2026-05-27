"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/admin/layout/Sidebar";
import { Topbar } from "@/components/admin/layout/Topbar";
import { Drawer } from "@/components/admin/ui/Drawer";

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(120%_80%_at_10%_0%,#fffdf8_0%,#f9f2e4_52%,#f4ead6_100%)]">
      <div className="flex min-h-screen">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Admin Menu">
          <Sidebar compact onNavigate={() => setDrawerOpen(false)} />
        </Drawer>

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenMenu={() => setDrawerOpen(true)} />
          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
