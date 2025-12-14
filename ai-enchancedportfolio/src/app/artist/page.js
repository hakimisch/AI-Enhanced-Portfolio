//src/app/artist/page.js

"use client";

import { useSession } from "next-auth/react";
import { useEffect, useReducer, useState } from "react";
import { Bar } from "react-chartjs-2";
import Link from "next/link";
import DashboardLayout from "components/DashboardLayout";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  DollarSign,
  ShoppingCart,
  Image as ArtIcon,
  Package,
  MessageCircle,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ArtistDashboard() {
  const { data: session } = useSession();

  const [{ loading, summary }, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "FETCH_REQUEST":
          return { ...state, loading: true };
        case "FETCH_SUCCESS":
          return { loading: false, summary: action.payload };
        default:
          return state;
      }
    },
    { loading: true, summary: {} }
  );

  const [range, setRange] = useState("30d");

  useEffect(() => {
    if (!session?.user?.email) return;

    async function loadSummary() {
      dispatch({ type: "FETCH_REQUEST" });
      const res = await fetch(`/api/artist/summary?range=${range}`);
      const data = await res.json();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    }

    loadSummary();
  }, [session, range]);

  if (loading)
    return (
      <DashboardLayout>
        <p className="p-8">Loading dashboard…</p>
      </DashboardLayout>
    );

  const chartData = {
    labels: summary.salesData?.map((d) => d._id) || [],
    datasets: [
      {
        label: "Sales (RM)",
        data: summary.salesData?.map((d) => d.totalSales) || [],
        backgroundColor: "rgba(99,102,241,0.6)",
      },
    ],
  };

  const cards = [
    {
      title: "Total Sales",
      value: `RM${summary.totalSales || 0}`,
      icon: <DollarSign className="text-green-500" />,
      href: "/artist/merchandise/orders",
    },
    {
      title: "Orders",
      value: summary.ordersCount || 0,
      icon: <ShoppingCart className="text-blue-500" />,
      href: "/artist/merchandise/orders",
    },
    {
      title: "Unfulfilled Orders",
      value: summary.unfulfilledOrdersCount || 0,
      icon: <AlertTriangle className="text-red-500" />,
      href: "/artist/merchandise/orders",
      danger: true,
    },
    {
      title: "Products",
      value: summary.productsCount || 0,
      icon: <Package className="text-purple-500" />,
      href: "/artist/merchandise/products",
    },
    {
      title: "Artworks",
      value: summary.artworksCount || 0,
      icon: <ArtIcon className="text-pink-500" />,
      href: "/artist/artworks",
    },
    {
      title: "Messages",
      value: summary.messagesOpen || 0,
      icon: <MessageCircle className="text-orange-500" />,
      href: "/artist/contact",
    },
    {
      title: "Commissions Inquiries",
      value: summary.commissionCount || 0,
      icon: <ClipboardList className="text-indigo-500" />,
      href: "/artist/contact",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">

        <h1 className="text-3xl font-semibold mb-6">Artist Dashboard</h1>

        {/* CARDS */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {cards.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className={`bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition flex gap-4 items-center ${
                c.danger ? "border border-red-200" : ""
              }`}
            >
              <div className="p-3 bg-gray-50 rounded-full">{c.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{c.title}</p>
                <p className="text-2xl font-semibold">{c.value}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* SALES CHART */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Sales Overview</h2>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="border rounded-lg px-3 py-1 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All time</option>
            </select>
          </div>

          <div className="h-[260px]">
            <Bar data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* TOP PRODUCTS */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Best Selling Products</h2>

          {summary.topProducts?.length > 0 ? (
            <ul className="space-y-3 text-sm">
              {summary.topProducts.map((p) => (
                <li key={p._id} className="flex justify-between">
                  <span>{p._id}</span>
                  <span className="font-medium">RM{p.totalSales}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No product sales yet</p>
          )}
        </div>

        {/* MONTHLY EARNINGS */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Monthly Earnings</h2>

          {summary.monthlyEarnings?.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {summary.monthlyEarnings.map((m) => (
                <li key={m._id} className="flex justify-between">
                  <span>{m._id}</span>
                  <span className="font-medium">RM{m.totalSales}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No earnings data</p>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
