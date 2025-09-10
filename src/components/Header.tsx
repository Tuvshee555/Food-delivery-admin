"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function Header() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const email = localStorage.getItem("email");
    setUserEmail(email);
    console.log(email, "email");
  }, []);

  const handleClick = () => {
    localStorage.removeItem("token");
    router.push("log-in");
    toast.success("Loged out successfully ");
  };

  return (
    <div className=" relative  bg-white flex h-[50px] w-screen items-center justify-center p-[10px] shadow-md">
      <div className="items-center justify-center absolute top-[5px] right-[250px]">
        <Dialog>
          <DialogTrigger>
            <div className="border-[2px] rounded-full border-black p-[5px]">
              <User />
            </div>
          </DialogTrigger>
          <DialogContent className="bg-white rounded-[20px]">
            <DialogHeader className=" gap-3">
              <DialogTitle>{userEmail}</DialogTitle>
              <Button
                className="bg-blue-500 rounded-sm"
                onClick={() => handleClick()}
              >
                Log out
              </Button>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
