"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    
    // Redirect to home if the user is not an admin
    if (!user?.isAdmin) {
      router.push("/")  // Redirect to the home page if not an admin
    }
  }, [router])

  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold mb-4">Admin Dashboard</h2>
      <p>Welcome, admin! Manage artworks, users, and merch here.</p>
    </div>
  )
}