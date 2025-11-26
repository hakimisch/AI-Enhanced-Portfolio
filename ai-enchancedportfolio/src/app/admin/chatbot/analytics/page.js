"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "components/DashboardLayout";

export default function ChatbotAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/chatbot/analytics")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  return (
    <div className="p-8">
        <DashboardLayout isAdmin>
      <h1 className="text-2xl font-semibold mb-6">Chatbot Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Total Sessions</h2>
          <p className="text-3xl">{data.totalSessions}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Unique Users</h2>
          <p className="text-3xl">{data.uniqueUsers}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Intent Breakdown</h2>

          {data.intents.map((i) => (
            <p key={i._id}>
              <strong>{i._id || "general"}:</strong> {i.count}
            </p>
          ))}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">Popular Questions</h2>
      <ul className="list-disc list-inside bg-white p-4 rounded shadow">
        {data.popularQuestions.map((q) => (
          <li key={q._id}>
            {q._id} — <span className="text-gray-600">{q.count} times</span>
          </li>
        ))}
      </ul>
      </DashboardLayout>
    </div>
  );
}
