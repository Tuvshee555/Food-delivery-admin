import { UserType } from "@/type/type";

export const CreatePassword = ({
  setUser,
  nextStep,
  stepBack,
  user,
}: UserType) => {
  return (
    <div>
      <div
        className="flex bg-green-900 h-10 w-10 align-center justify-center"
        onClick={stepBack}
      >
        STEP BACK
      </div>
      <input
        type="password"
        value={user.password}
        onChange={(e) =>
          setUser((prev) => ({ ...prev, password: e.target.value }))
        }
        placeholder="password"
        className="w-[399px] h-[100px] border-solid"
      />
      {/* {error ? } */}
      <input
        type="password"
        value={user.repassword}
        onChange={(e) =>
          setUser((prev) => ({ ...prev, repassword: e.target.value }))
        }
        placeholder="confirm password"
        className="w-[399px] h-[100px] border-solid"
      />
      <div
        onClick={nextStep}
        className="w-[399px] h-[100px] border-solid bg-red-600 flex items-center justify-center text-white cursor-pointer"
      >
        Create Admin
      </div>
    </div>
  );
};
