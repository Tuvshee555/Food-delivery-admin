"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "./AuthProvider";
import { Suspense, useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryclient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryclient}>
      <AuthProvider>
        <Suspense>{children}</Suspense>
      </AuthProvider>
    </QueryClientProvider>
  );
}
