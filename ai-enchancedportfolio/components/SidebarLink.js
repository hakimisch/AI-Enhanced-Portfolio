"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Palette,
  ShoppingBag,
  BookOpen,
  User,
  BarChart3,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardLayout({ children, isAdmin = false }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = isAdmin
    ? [
        { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { href: "/admin/artworks", label: "Artworks", icon: <Palette size={20} /> },
        { href: "/admin/products", label: "Products", icon: <ShoppingBag size={20} /> },
        { href: "/admin/orders", label: "Orders", icon: <BarChart3 size={20} /> },
        { href: "/admin/blogs", label: "Blogs", icon: <BookOpen size={20} /> },
        { href: "/admin/users", label: "Users", icon: <Users size={20} /> },
        { href: "/admin/reports", label: "Reports", icon: <BarChart3 size={20} /> },
      ]
    : [
        { href: "/artist", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { href: "/artist/artworks", label: "My Artworks", icon: <Palette size={20} /> },
        { href: "/artist/merchandise/products", label: "My Merchandise", icon: <ShoppingBag size={20} /> },
        { href: "/artist/blog", label: "My Blog", icon: <BookOpen size={20} /> },
        { href: "/artist/profile", label: "My Profile", icon: <User size={20} /> },
      ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 📱 Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white shadow z-40 flex justify-between items-center px-4 py-3">
        <h1 className="text-xl font-bold text-blue-600">
          {isAdmin ? "Admin Panel" : "Artist Hub"}
        </h1>
        <button onClick={() => setIsOpen(true)}>
          <Menu size={24} className="text-gray-700" />
        </button>
      </div>

      {/* 🧭 Sidebar */}
      <AnimatePresence>
        {(isOpen || typeof window === "undefined") && (
          <>
            {/* Overlay for mobile */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar panel */}
            <motion.aside
              key="sidebar"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="fixed lg:static z-50 top-0 left-0 h-full w-64 bg-white shadow-lg flex flex-col justify-between p-6"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-blue-600">
                    {isAdmin ? "Admin Panel" : "Artist Hub"}
                  </h1>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden text-gray-600"
                  >
                    <X size={22} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                        pathname === link.href
                          ? "bg-blue-100 text-blue-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg mt-8 text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
              >
                <LogOut size={20} />
                Logout
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-8 mt-16 lg:mt-0 lg:ml-64 overflow-y-auto transition-all">
        {children}
      </main>
    </div>
  );
}