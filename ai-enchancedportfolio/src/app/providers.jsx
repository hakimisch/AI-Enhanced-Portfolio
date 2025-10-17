"use client";

import { SessionProvider } from "next-auth/react";
import { StoreProvider } from "./context/StoreContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <StoreProvider>
        {children}
      </StoreProvider>
    </SessionProvider>
  );
}