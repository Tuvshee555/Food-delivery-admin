"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/provider/AuthProvider";
import { loadFacebookSDK } from "@/utils/loadFacebookSDK";
import { LoginForm } from "./components/LoginForm";
import { LoginImage } from "./components/LoginImage";

declare global {
  interface Window {
    FB: fb.FacebookStatic;
  }
}

export default function LogIn() {
  const router = useRouter();
  const { setAuthToken } = useAuth();

  const [user, setUser] = useState({ email: "", password: "", role: "ADMIN" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFacebookSDK();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`,
        user
      );

      if (res.data.success) {
        const { token, user: userData } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("email", userData.email);
        localStorage.setItem("userId", userData.userId || userData.id);
        setAuthToken(token);
        toast.success("Successfully logged in!");
        router.push("/home-page");
      } else {
        setError(res.data.message);
        toast.error(res.data.message);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          err.response?.data?.message || "An error occurred while logging in.";
        setError(msg);
        toast.error(msg);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (res: CredentialResponse) => {
    if (!res.credential) return toast.error("No Google credentials received!");

    try {
      const r = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/auth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: res.credential }),
        }
      );

      const data = await r.json();
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("userId", data.user.id);
        setAuthToken(data.token);
        toast.success("Successfully logged in with Google!");
        router.push("/home-page");
      } else {
        toast.error("Google login failed!");
      }
    } catch {
      toast.error("Google login failed!");
    }
  };

  const handleFacebookLogin = () => {
    if (!window.FB) return toast.error("Facebook SDK not loaded yet!");

    window.FB.login(
      (response) => {
        if (!response.authResponse) {
          toast.error("Facebook login cancelled or failed!");
          return;
        }

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/auth/facebook`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: response.authResponse.accessToken,
          }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.token && data.user) {
              localStorage.setItem("token", data.token);
              localStorage.setItem("email", data.user.email);
              localStorage.setItem("userId", data.user.id);
              setAuthToken(data.token);
              toast.success("Successfully logged in with Facebook!");
              router.push("/home-page");
            } else {
              toast.error("Facebook login failed");
            }
          })
          .catch(() => toast.error("Facebook login failed"));
      },
      { scope: "email,public_profile" }
    );
  };

  return (
    <div
      className="
    min-h-screen
    w-full
    bg-background
    text-foreground
    flex
    items-center
    justify-center
    gap-12
    px-4
  "
    >
      <LoginForm
        user={user}
        setUser={setUser}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        error={error}
        loading={loading}
        onLogin={handleLogin}
        onGoogle={handleGoogleLogin}
        onFacebook={handleFacebookLogin}
      />

      {/* Desktop only image */}
      <div className="hidden lg:block">
        <LoginImage />
      </div>
    </div>
  );
}
