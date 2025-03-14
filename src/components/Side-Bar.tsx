import Link from "next/link";
import { Button } from "./ui/button";

export const Sidebar = ({ setPage }: { setPage: (value: string) => void }) => {
  return (
    <div className="w-[205px] p-[36px] flex flex-col border-r border-gray-300">
      <div>
        <Link href={""} className="flex  items-center">
          <img src="/order.png" className="w-[36px] h-[30px]" />
          <div className="ml-2">
            <div className="text-[18px] font-semibold">NomNom</div>
            <div className="text-[12px] font-medium text-[#71717a]">
              Swift delivery
            </div>
          </div>
        </Link>
        <div className="flex flex-col gap-[8px] text-gray-700">
          <Button onClick={() => setPage("Food-menu")}>Food menu</Button>
          <Button onClick={() => setPage("Orders")}>Orders</Button>
          <Button onClick={() => setPage("Settings")}>Settings</Button>
        </div>
      </div>
    </div>
  );
};
