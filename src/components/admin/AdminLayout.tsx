"use client";

import { useState } from "react";
import { AdminTopBar } from "./AdminTopBar";
import { Sidebar } from "../Side-Bar";

export default function AdminLayout({
  children,
  setPage,
}: {
  children: React.ReactNode;
  setPage: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-[220px] border-r">
        <Sidebar setPage={setPage} />
      </aside>

      {/* Top bar (mobile + desktop) */}
      <AdminTopBar onMenu={() => setOpen(true)} />

      {/* Mobile drawer */}
      <Sidebar
        setPage={setPage}
        isMobile
        open={open}
        onClose={() => setOpen(false)}
      />

      <main className="flex-1 pt-14 md:pt-4 p-4">{children}</main>
    </div>
  );
}
