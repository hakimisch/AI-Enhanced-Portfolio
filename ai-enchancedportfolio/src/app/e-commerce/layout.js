'use client';

import { StoreProvider } from "../context/StoreContext";
import Navbar from "components/Navbar";

export default function RootLayout({ children }) {
  return (
    <StoreProvider>
      <Navbar />
      {children}
    </StoreProvider>
  );
}