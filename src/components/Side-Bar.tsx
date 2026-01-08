/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type Props = {
  setPage: (value: string) => void;
  isMobile?: boolean;
  open?: boolean;
  onClose?: () => void;
};

export const Sidebar = ({ setPage, isMobile, open, onClose }: Props) => {
  const { t } = useI18n();
  const [activePage, setActivePage] = useState("Food-menu");

  const handleClick = (page: string) => {
    setActivePage(page);
    setPage(page);
    onClose?.();
  };

  const itemClass = (page: string) =>
    `
      h-[44px]
      justify-start
      rounded-md
      ${
        activePage === page
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted"
      }
    `;

  const content = (
    <aside className="w-[220px] h-full px-6 py-8 bg-background border-r">
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
          {t("sidebar.food_menu")}
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

  if (!isMobile) return content;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/40 ${open ? "block" : "hidden"}`}
      onClick={onClose}
    >
      <div className="h-full" onClick={(e) => e.stopPropagation()}>
        {content}
      </div>
    </div>
  );
};
