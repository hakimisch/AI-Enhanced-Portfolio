"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import { Bar } from "react-chartjs-2";
import Link from "next/link";

// Chart.js setup
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: "",
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user?.isAdmin) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res = await fetch("/api/admin/summary");
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const data = await res.json();
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };

    fetchData();
  }, [status, session, router]);

  if (status === "loading" || !session?.user?.isAdmin) {
    return <p className="p-8">Checking admin access...</p>;
  }

  const chartData = {
    labels: summary.salesData.map((x) => x._id),
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgba(162, 222, 208, 1)",
        data: summary.salesData.map((x) => x.totalSales),
      },
    ],
  };

  return (
    <div>
      
      <div className="grid md:grid-cols-4 md:gap-5">
        <div className="ml-6 max-w-[80%]">
          <ul>
            <li className="py-4 hover:text-purple-800">
              <Link href="/admin/artworks" className="font-bold text-2xl">
                Dashboard
              </Link>
            </li>
            <li className="py-3 text-xl hover:text-purple-700">
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h1 className="mb-4 text-xl">Admin Dashboard</h1>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="card m-5 p-5 hover:scale-105">
                  <p className="text-3xl">RM{summary.ordersPrice}</p>
                  <p>Sales</p>
                  <Link href="/admin/orders">View sales</Link>
                </div>
                <div className="card m-5 p-5 hover:scale-105">
                  <p className="text-3xl">{summary.ordersCount}</p>
                  <p>Orders</p>
                  <Link href="/admin/orders">View orders</Link>
                </div>
                <div className="card m-5 p-5 hover:scale-105">
                  <p className="text-3xl">{summary.productsCount}</p>
                  <p>Products</p>
                  <Link href="/admin/products">View products</Link>
                </div>
                <div className="card m-5 p-5 hover:scale-105">
                  <p className="text-3xl">{summary.usersCount}</p>
                  <p>Users</p>
                  <Link href="/admin/users">View users</Link>
                </div>
              </div>

              <h2 className="text-xl mt-6 mb-2">Sales Report</h2>
              <Bar className="mr-16" options={chartOptions} data={chartData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}