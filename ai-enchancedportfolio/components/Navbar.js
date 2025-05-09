"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user?.isAdmin) {
      setIsAdmin(true)
    }
    if (user) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setIsAdmin(false)
    setIsLoggedIn(false)
    // Optionally redirect to home or login page after logging out
    window.location.href = "/"
  }

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">🎨 Artfolio</h1>
      <div className="space-x-4">
        <Link href="/" className="text-gray-700 hover:text-blue-500">Home</Link>
        <Link href="/about" className="text-gray-700 hover:text-blue-500">About</Link>
        <Link href="/contact" className="text-gray-700 hover:text-blue-500">Contact</Link>
        
        {/* Show the Admin link only if the user is an admin */}
        {isAdmin && (
          <Link href="/admin" className="text-gray-700 hover:text-blue-500">Admin</Link>
        )}

        {/* Show Login and Register links only if the user is not logged in */}
        {!isLoggedIn ? (
          <>
            <Link href="/auth/login" className="text-gray-700 hover:text-blue-500">Login</Link>
            <Link href="/auth/register" className="text-gray-700 hover:text-blue-500">Register</Link>
          </>
        ) : (
          // Optionally, show a Logout link if the user is logged in
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-blue-500"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}