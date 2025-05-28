'use client';

import { StoreProvider } from "../context/StoreContext";

export default function RootLayout({ children }) {
  return (
    <StoreProvider>
      {children}
    </StoreProvider>
  );
}