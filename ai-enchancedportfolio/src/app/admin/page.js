//app/admin/page.js

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useReducer, useState } from "react";
import { Bar } from "react-chartjs-2";
import Link from "next/link";
import DashboardLayout from "components/DashboardLayout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  ShoppingCart,
  DollarSign,
  Users,
  Image as ArtIcon,
  Package,
} from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [{ loading, error, summary }, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "FETCH_REQUEST":
          return { ...state, loading: true, error: "" };
        case "FETCH_SUCCESS":
          return { ...state, loading: false, summary: action.payload };
        case "FETCH_FAIL":
          return { ...state, loading: false, error: action.payload };
        default:
          return state;
      }
    },
    { loading: true, summary: {}, error: "" }
  );

  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.isAdmin) router.push("/");

    const fetchSummary = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res = await fetch(`/api/admin/summary?range=${timeRange}`);
        const data = await res.json();
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchSummary();
  }, [status, session, router, timeRange]);

  if (loading) return <p className="p-8 text-gray-500">Loading dashboard...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  const chartData = {
    labels: summary.salesData?.map((x) => x._id) || [],
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgba(37, 99, 235, 0.6)",
        borderColor: "rgba(37, 99, 235, 1)",
        borderWidth: 1,
        data: summary.salesData?.map((x) => x.totalSales) || [],
      },
    ],
  };

  const cards = [
    {
      title: "Total Sales",
      value: `RM${summary.ordersPrice || 0}`,
      icon: <DollarSign className="text-green-500" size={26} />,
      href: "/admin/orders",
    },
    {
      title: "Orders",
      value: summary.ordersCount || 0,
      icon: <ShoppingCart className="text-blue-500" size={26} />,
      href: "/admin/orders",
    },
    {
      title: "Products",
      value: summary.productsCount || 0,
      icon: <Package className="text-purple-500" size={26} />,
      href: "/admin/products",
    },
    {
      title: "Users",
      value: summary.usersCount || 0,
      icon: <Users className="text-orange-500" size={26} />,
      href: "/admin/users",
    },
  ];

  return (
    <DashboardLayout isAdmin>
      {/* ✅ Responsive padding + spacing */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          Admin Dashboard
        </h1>

        {/* ✅ Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 flex items-center gap-4"
            >
              <div className="p-3 bg-gray-50 rounded-full">{card.icon}</div>
              <div>
                <p className="text-gray-600 text-sm">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {card.value}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* ✅ Sales Overview Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-10 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Sales Overview
            </h2>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All time</option>
            </select>
          </div>
            {/* ✅ FIXED HEIGHT CONTAINER */}
          <div className="h-64 sm:h-80">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { ticks: { color: "#4B5563" } },
                  y: { ticks: { color: "#4B5563" }, beginAtZero: true },
                },
              }}
            />
          </div>
        </div>

        {/* ✅ Top Artists + Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Top Artists */}
          <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Top Artists Sales
            </h2>
            {summary.topArtists?.length > 0 ? (
              <div className="space-y-6">
                <Bar
                  data={{
                    labels: summary.topArtists.map((a) => a.artistName),
                    datasets: [
                      {
                        label: "Sales (RM)",
                        data: summary.topArtists.map((a) => a.totalSales),
                        backgroundColor: "rgba(99, 102, 241, 0.6)",
                      },
                    ],
                  }}
                  options={{
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { ticks: { color: "#4B5563" } },
                      y: { ticks: { color: "#4B5563" }, beginAtZero: true },
                    },
                  }}
                />
                <ul className="space-y-3">
                  {summary.topArtists.map((artist, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center border-b last:border-none pb-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="font-medium text-gray-700">
                          {artist.artistName}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        RM{artist.totalSales}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-400 italic">No artist data available</p>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Top Products
            </h2>
            {summary.topProducts?.length > 0 ? (
              <div className="space-y-6">
                <Bar
                  data={{
                    labels: summary.topProducts.map((p) => p._id),
                    datasets: [
                      {
                        label: "Sales (RM)",
                        data: summary.topProducts.map((p) => p.totalSales),
                        backgroundColor: "rgba(59, 130, 246, 0.6)",
                      },
                    ],
                  }}
                  options={{
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { ticks: { color: "#4B5563" } },
                      y: { ticks: { color: "#4B5563" }, beginAtZero: true },
                    },
                  }}
                />
                <ul className="space-y-3">
                  {summary.topProducts.map((p, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center border-b last:border-none pb-2"
                    >
                      <div className="flex items-center gap-3">
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p._id}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <span className="font-medium text-gray-700">
                          {p._id}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        RM{p.totalSales}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-400 italic">No product data available</p>
            )}
          </div>
        </div>

        {/* ✅ Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Recent Activity
          </h2>
          <ul className="space-y-2 text-sm text-gray-600">
            {summary.recentOrders?.length > 0 ? (
              summary.recentOrders.map((o) => (
                <li
                  key={o._id}
                  className="flex justify-between items-center border-b last:border-none pb-2"
                >
                  <span>
                    <strong>{o.customerName}</strong> placed an order —{" "}
                    <span
                      className={`${
                        o.fulfillmentStatus === "fulfilled"
                          ? "text-green-600"
                          : "text-yellow-600"
                      } font-medium`}
                    >
                      {o.fulfillmentStatus}
                    </span>
                  </span>
                  <span className="text-gray-400 text-xs">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-gray-400 italic">No recent orders</p>
            )}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
