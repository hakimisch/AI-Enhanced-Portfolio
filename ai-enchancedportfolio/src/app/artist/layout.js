"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ArtistLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    // ✅ Allow only logged-in artists
    if (!session?.user?.isArtist) {
      router.push("/");
    }
  }, [status, session, router]);

  return <>{children}</>;
}