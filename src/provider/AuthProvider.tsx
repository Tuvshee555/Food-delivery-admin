"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJwt } from "react-jwt";
import { toast } from "sonner";

type UserType = {
  userId?: string;
  id?: string;
  role?: string;
};

type AuthContextType = {
  userId?: string;
  role?: string;
  token?: string | null;
  setAuthToken: (newToken: string | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const { decodedToken, reEvaluateToken, isExpired } = useJwt<UserType>(
    token || ""
  );

  // Load token from storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.push("/log-in");
      return;
    }

    setToken(storedToken);
    reEvaluateToken(storedToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect when token becomes expired (fires whenever isExpired changes)
  useEffect(() => {
    if (isExpired) {
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
      router.push("/log-in");
    }
  }, [isExpired, router]);

  useEffect(() => {
    if (token && decodedToken && decodedToken.role !== "ADMIN") {
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
      setToken(null);
      toast.error("Admin access required");
      router.push("/log-in");
    }
  }, [decodedToken, router, token]);

  const setAuthToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      // Write a non-httpOnly cookie so Next.js middleware can read it for
      // server-side route protection (localStorage is not accessible in middleware)
      document.cookie = `token=${newToken}; path=/; SameSite=Strict`;
      setToken(newToken);
      reEvaluateToken(newToken);
    } else {
      localStorage.removeItem("token");
      // Clear the middleware cookie on logout
      document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
      setToken(null);
      router.push("/log-in");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userId: decodedToken?.userId ?? decodedToken?.id,
        role: decodedToken?.role,
        token,
        setAuthToken,
      }}
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
