/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type User = {
  email: string;
  password: string;
  repassword: string;
  role?: string;
};

type UserType = {
  setUser: React.Dispatch<React.SetStateAction<User>>;
  nextStep: () => void;
  user: User;
};

export const CreateEmail = ({ nextStep, user, setUser }: UserType) => {
  const router = useRouter();

  return (
    <div className="h-screen w-screen bg-white flex items-center justify-center gap-12">
      <div className="flex flex-col gap-6 w-[416px]">
        <ChevronLeft className="bg-white rounded-[6px] hover:cursor-pointer" />

        <h1 className="text-[24px] font-semibold text-black">
          Create your account
        </h1>
        <p className="text-[16px] text-[#71717a]">
          Sign up to explore your favorite dishes.
        </p>

        <input
          value={user.email}
          onChange={(e) =>
            setUser((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="Enter your email address"
          className="border-2 rounded-[8px] p-[6px] text-[#71717b]"
        />

        <button
          className="h-[36px] w-full rounded-[8px] text-white bg-[#d1d1d1] hover:bg-black"
          onClick={nextStep}
        >
          Lets go
        </button>

        <div className="flex gap-3 justify-center">
          <p className="text-[16px] text-[#71717a]">Already have an account?</p>
          <p
            className="text-[16px] text-[#2762ea] hover:cursor-pointer"
            onClick={() => router.push("/log-in")}
          >
            Log in
          </p>
        </div>
      </div>

      <img src="/deliverM.png" className="w-[860px] h-[900px]" />
    </div>
  );
};
