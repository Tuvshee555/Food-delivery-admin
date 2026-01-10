/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Props = {
  setPage: (value: string) => void;
  isMobile?: boolean;
  open?: boolean;
  onClose?: () => void;
};

export const Sidebar = ({ setPage, isMobile, open, onClose }: Props) => {
  const { t } = useI18n();
  const [activePage, setActivePage] = useState("Home");

  const handleClick = (page: string) => {
    setActivePage(page);
    setPage(page);
    onClose?.(); // ✅ close after click
  };

  const itemClass = (page: string) =>
    `
      h-[44px]
      w-full
      justify-start
      rounded-md
      border
      border-border
      ${
        activePage === page
          ? "bg-primary text-primary-foreground border-primary"
          : "hover:bg-muted"
      }
    `;

  const content = (
    <aside className="w-[220px] h-full px-6 py-8 bg-background ">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <img src="/order.png" className="w-8 h-8" />
        <div>
          <div className="font-semibold">NomNom</div>
          <div className="text-xs text-muted-foreground">
            {t("sidebar.tagline")}
          </div>
        </div>
      </Link>

      <nav className="flex flex-col gap-2">
        <Button
          variant="ghost"
          className={itemClass("Food-menu")}
          onClick={() => handleClick("Food-menu")}
        >
          {t("sidebar.home")}
        </Button>

        <Button
          variant="ghost"
          className={itemClass("Orders")}
          onClick={() => handleClick("Orders")}
        >
          {t("sidebar.orders")}
        </Button>

        <Button
          variant="ghost"
          className={itemClass("Revenue-dashboard")}
          onClick={() => handleClick("Revenue-dashboard")}
        >
          {t("sidebar.revenue")}
        </Button>
      </nav>
    </aside>
  );

  // ✅ Desktop
  if (!isMobile) return content;

  // ✅ Mobile (shadcn Sheet)
  return (
    <Sheet open={!!open} onOpenChange={(v) => (!v ? onClose?.() : null)}>
      <SheetContent side="left" className="p-0 w-[260px]">
        {/* ✅ Required title for accessibility (no UI impact) */}
        <SheetHeader className="sr-only">
          <SheetTitle>{t("sidebar.title")}</SheetTitle>
        </SheetHeader>

        {content}
      </SheetContent>
    </Sheet>
  );
};
