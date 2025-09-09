"use client";

import { useAuth } from "@/provider/AuthProvider";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogIn() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { setAuthToken } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:4000/user/login`, {
        email: user.email,
        password: user.password,
      });

      if (response.data.success) {
        const { token, user: loggedInUser } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("email", loggedInUser.email);
        localStorage.setItem("userId", loggedInUser.userId);

        setAuthToken(token);
        router.push("/food-menu"); // ✅ fixed path
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="items-center justify-center">Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="text-black mb-4">HElloooo</div>

      <input
        value={user.email}
        onChange={(e) =>
          setUser((prev) => ({ ...prev, email: e.target.value }))
        } // ✅ fixed
        placeholder="Email"
        className="border p-2 mb-2 block"
      />

      <input
        value={user.password}
        type="password"
        onChange={(e) =>
          setUser((prev) => ({ ...prev, password: e.target.value }))
        } // ✅ fixed
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
