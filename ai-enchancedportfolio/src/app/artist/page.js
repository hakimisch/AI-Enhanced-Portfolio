"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Palette, ShoppingBag, BookOpen, User } from "lucide-react";

export default function ArtistDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p className="text-center mt-10">Loading...</p>;
  if (!session) return <p className="text-center mt-10 text-red-500">You must be logged in as an artist.</p>;

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
      desc: "Edit your About Me section and profile details.",
      icon: <User className="text-orange-500" size={28} />,
      href: "/artist/profile",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-2 text-center text-gray-800">
          Welcome back, <span className="text-blue-600">{username}</span> 🎨
        </h1>
        <p className="text-gray-600 text-center mb-10">
          Manage your portfolio, shop, and blog all in one place.
        </p>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group bg-white p-6 rounded-2xl shadow hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center"
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
    </div>
  );
}