// components/Sidebar.tsx
export const Sidebar = () => {
    return (
      <div className="w-[205px] p-[36px] flex flex-col border-r border-gray-300">
        <div>
          <div className="flex mb-[24px] items-center">
            <img src="/order.png" className="w-[36px] h-[30px]" />
            <div className="ml-2">
              <div className="text-[18px] font-semibold">NomNom</div>
              <div className="text-[12px] font-medium text-[#71717a]">
                Swift delivery
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[8px] text-gray-700">
            <div>Food menu</div>
            <div>Orders</div>
            <div>Settings</div>
          </div>
        </div>
      </div>
    );
  };
  