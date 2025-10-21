"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/provider/AuthProvider";

declare global {
  interface Window {
    FB: fb.FacebookStatic;
    fbAsyncInit: () => void;
  }
}

export const FacebookButton = ({ role = "USER" }: { role?: string }) => {
  const router = useRouter();
  const { setAuthToken } = useAuth();

  // Load FB SDK
  useEffect(() => {
    if (typeof window === "undefined" || window.FB) return;

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
        cookie: true,
        xfbml: true,
        version: "v20.0",
      });
    };

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleFacebookAuth = () => {
    if (!window.FB) {
      toast.error("Facebook SDK not loaded yet!");
      return;
    }

    window.FB.login(
      async (response: fb.StatusResponse) => {
        if (!response.authResponse) {
          toast.error("Facebook login cancelled or failed!");
          return;
        }

        const token = response.authResponse.accessToken;

        try {
          const res = await fetch("http://localhost:4000/user/auth/facebook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, role }),
          });

          const data = await res.json();

          if (!res.ok) {
            toast.error(data.message || "Facebook authentication failed!");
            return;
          }

          // Save token & user
          localStorage.setItem("token", data.token);
          localStorage.setItem("email", data.user.email);
          localStorage.setItem("userId", data.user._id);
          setAuthToken(data.token);

          toast.success(
            `Successfully logged in with Facebook as ${data.user.role}`
          );
          router.push("/home-page");
        } catch (err) {
          console.error("Facebook auth error:", err);
          toast.error("Facebook authentication failed!");
        }
      },
      { scope: "email,public_profile" }
    );
  };

  return (
    <button
      onClick={handleFacebookAuth}
      className="h-[36px] w-full bg-[#1877F2] text-white rounded-[8px] hover:bg-[#145dbf]"
    >
      Continue with Facebook
    </button>
  );
};
