"use client";

export function MobileAdminHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-14 flex items-center gap-3 px-4 border-b bg-background md:hidden z-50">
      <button
        onClick={onMenu}
        className="h-[44px] w-[44px] flex items-center justify-center text-xl"
      >
        ☰
      </button>
      <span className="font-semibold">Admin</span>
    </div>
  );
}
