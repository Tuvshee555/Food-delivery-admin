/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";

export const Sidebar = ({ setPage }: { setPage: (value: string) => void }) => {
  const [activePage, setActivePage] = useState<string>("");

  const handleClick = (page: string) => {
    setActivePage(page); // Set the active page when a button is clicked
    setPage(page); // Pass the active page to the parent component
  };

  return (
    <div className="w-[205px] p-[36px] flex flex-col border-r border-gray-300">
      <div>
        <Link href={""} className="flex items-center">
          <img src="/order.png" className="w-[36px] h-[30px]" />
          <div className="ml-2">
            <div className="text-[18px] font-semibold">NomNom</div>
            <div className="text-[12px] font-medium text-[#71717a]">
              Swift delivery
            </div>
          </div>
        </Link>
        <div className="flex flex-col gap-[8px] text-gray-700">
          <Button
            onClick={() => handleClick("Food-menu")}
            className={
              activePage === "Food-menu"
                ? "bg-blue-500 text-white rounded-[6px]"
                : "rounded-[6px]"
            }
          >
            Food menu
          </Button>
          <Button
            onClick={() => handleClick("Orders")}
            className={
              activePage === "Orders"
                ? "bg-blue-500 text-white rounded-[6px]"
                : "rounded-[6px]"
            }
          >
            Orders
          </Button>
        </div>
      </div>
    </div>
  );
};
