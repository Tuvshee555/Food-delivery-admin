"use client";

import axios from "axios";
import { useState } from "react";

export const PostUser = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    repassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handlePostUser = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:4000/user`, {
        email: user.email,
        password: user.password,
        user: "ADMIN",
      });
      setLoading(false);
      console.log("Created admin", response.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-[20px] text-black">Loading...</div>;
  return (
    <div>
      <input
        value={user.email}
        onChange={(e) =>
          setUser((prev) => ({ ...prev, email: e.target.value }))
        }
        placeholder="email"
      ></input>
      <input
        value={user.password}
        onChange={(e) =>
          setUser((prev) => ({ ...prev, password: e.target.value }))
        }
        placeholder="password"
      ></input>
      <input
        value={user.repassword}
        onChange={(e) =>
          setUser((prev) => ({ ...prev, repassword: e.target.value }))
        }
        placeholder="confirm password"
      ></input>
      <div
        onClick={() => handlePostUser()}
        className="h-10 w-30 bg-red rounded-sm"
      ></div>
    </div>
  );
};
