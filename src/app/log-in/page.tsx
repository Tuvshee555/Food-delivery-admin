"use client";

import { useAuth } from "@/provider/AuthProvider";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LogIn() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    role: "ADMIN",
  });
  const [loading, setLoading] = useState(false);

  const { setAuthToken } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:4000/user/login`,
        user
      );

      if (response.data.success) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("email", user.email);
        localStorage.setItem("userId", user.userId || user.user_id);

        setAuthToken(token);
        router.push("/home-page");
      }
    } catch (error) {
      console.log(error);
      console.log(loading);
    } finally {
      setLoading(false);
      toast.success("Succesfully logged in");
    }
  };

  return (
    <div className="p-4">
      <div className="text-black mb-4">HElloooo</div>

      <input
        value={user.email}
        onChange={(e) =>
          setUser((prev) => ({ ...prev, email: e.target.value }))
        }
        placeholder="Email"
        className="border p-2 mb-2 block"
      />

      <input
        value={user.password}
        type="password"
        onChange={(e) =>
          setUser((prev) => ({ ...prev, password: e.target.value }))
        }
        placeholder="Password"
        className="border p-2 mb-2 block"
      />

      <button
        className="h-10 w-20 bg-red-600 text-white rounded"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}
