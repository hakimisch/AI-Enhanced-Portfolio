"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Palette,
  ShoppingBag,
  BookOpen,
  User,
  LayoutDashboard,
  Users,
  BarChart,
  LogOut,
  Home,
  FileText,
  Package,
  Settings,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAdmin = session?.user?.isAdmin;

  // 🧭 Sidebar links per role
  const artistLinks = [
    { href: "/artist/artworks", label: "Artworks", icon: <Palette size={20} /> },
    { href: "/artist/merchandise/products", label: "Merchandise", icon: <ShoppingBag size={20} /> },
    { href: "/artist/blog", label: "Blog / Events", icon: <BookOpen size={20} /> },
    { href: "/artist/profile", label: "Profile", icon: <User size={20} /> },
  ];

  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/admin/artworks", label: "Artworks", icon: <Palette size={20} /> },
    { href: "/admin/products", label: "Products", icon: <Package size={20} /> },
    { href: "/admin/orders", label: "Orders", icon: <FileText size={20} /> },
    { href: "/admin/users", label: "Users", icon: <Users size={20} /> },
    { href: "/admin/hero", label: "Hero Settings", icon: <Settings size={20} /> },
  ];

  const links = isAdmin ? adminLinks : artistLinks;

  // Fix mobile scroll lock when sidebar open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ✅ Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
              key="sidebar"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50 flex flex-col justify-between p-6 lg:hidden"
            >
              <SidebarContent
                links={links}
                pathname={pathname}
                isAdmin={isAdmin}
                closeMenu={() => setIsOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ✅ Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-64 fixed top-0 left-0 h-full bg-white shadow-lg p-6">
        <SidebarContent links={links} pathname={pathname} isAdmin={isAdmin} />
      </aside>    

      {/* ✅ Main Content - Scrollable, with left margin */}
  <div className="flex-1 flex flex-col lg:ml-64 min-h-screen overflow-y-auto">
    <header className="lg:hidden flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-30">
      <button onClick={() => setIsOpen(true)} className="text-gray-600">
        <Menu size={24} />
      </button>
      <h1 className="text-lg font-semibold text-gray-800">
        {isAdmin ? "Admin Dashboard" : "Artist Dashboard"}
      </h1>
    </header>

    <main className="flex-1 p-6">{children}</main>
  </div>
    </div>
  );
}

function SidebarContent({ links, pathname, isAdmin, closeMenu }) {
  return (
    <>
      <div>
        <Link
          href={isAdmin ? "/admin" : "/artist"}
          className="flex items-center gap-2 text-2xl font-bold text-blue-600 mb-10"
          onClick={closeMenu}
        >
          <Home size={22} />
          {isAdmin ? "Admin Panel" : "Artist Hub"}
        </Link>

        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  active
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={() => signOut()}
        className="mt-10 flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </>
  );
}