"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJwt } from "react-jwt";

type UserType = {
  userId: string;
};

type AuthContextType = {
  userId?: string;
  token?: string | null;
  setAuthToken: (newToken: string | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // new state
  const { decodedToken, reEvaluateToken, isExpired } = useJwt<UserType>(
    token || ""
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.replace("/log-in");
      setLoading(false);
      return;
    }

    setToken(storedToken);
    reEvaluateToken(storedToken);

    // If expired, force logout
    if (isExpired) {
      localStorage.removeItem("token");
      router.replace("/log-in");
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAuthToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      reEvaluateToken(newToken);
    } else {
      localStorage.removeItem("token");
      setToken(null);
    }
  };

  // Prevent children from flashing before redirect
  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{ userId: decodedToken?.userId, token, setAuthToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
