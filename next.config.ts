import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      // "images.unsplash.com",
      "images.remotePatterns",
      "res.cloudinary.com",
    ],
  },
};

export default nextConfig;
