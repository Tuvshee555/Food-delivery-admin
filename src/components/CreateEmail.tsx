/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
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
  return (
    <div>
      <div>
        <input
          value={user.email}
          onChange={(e) =>
            setUser((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="email"
          className="w-[399px] h-[100px] border border-gray-400 p-2"
        />
        <div
          className="flex bg-green-900 h-10 w-10 align-center justify-center"
          onClick={nextStep}
        >
          Next Step
        </div>
      </div>
      <img src="/deliverM.png" className="w-[856px] h-[904px]" />
    </div>
  );
};
