import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/provider/Providers";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import { SpeedInsights } from "@vercel/speed-insights/next";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Food delivery admin",
  description: "Manage foods, categories, and orders",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId="424549876529-sln60g4usp2b71ijfihqs96o01qhogko.apps.googleusercontent.com">
          <Providers>
            {children}
            {/* <SpeedInsights /> */}
          </Providers>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
