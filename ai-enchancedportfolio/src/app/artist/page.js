"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Palette, ShoppingBag, BookOpen, User } from "lucide-react";
import DashboardLayout from "components/DashboardLayout";

export default function ArtistDashboard() {
  const { data: session, status } = useSession();
  if (status === "loading") return <p className="p-8 text-center">Loading...</p>;
  if (!session) return <p className="text-center text-red-500 p-8">Please log in as an artist.</p>;

  const username = session.user.username || session.user.name || "Artist";

  const cards = [
    {
      title: "My Artworks",
      desc: "Upload, edit, or remove your portfolio pieces.",
      icon: <Palette className="text-blue-500" size={28} />,
      href: "/artist/artworks",
    },
    {
      title: "My Merchandise",
      desc: "Manage your products for sale in the shop.",
      icon: <ShoppingBag className="text-green-500" size={28} />,
      href: "/artist/merchandise/products",
    },
    {
      title: "My Blog / Events",
      desc: "Share your updates, stories, and announcements.",
      icon: <BookOpen className="text-purple-500" size={28} />,
      href: "/artist/blog",
    },
    {
      title: "My Profile",
      desc: "Edit your About Me and profile details.",
      icon: <User className="text-orange-500" size={28} />,
      href: "/artist/profile",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, <span className="text-blue-600">{username}</span> 🎨
          </h1>
          <p className="text-gray-600">
            Manage your portfolio, shop, and blog all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group bg-white p-6 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-start"
            >
              <div className="mb-4 bg-gray-100 p-4 rounded-full group-hover:bg-gray-200 transition">
                {card.icon}
              </div>
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                {card.title}
              </h2>
              <p className="text-gray-500 text-sm mt-2">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}