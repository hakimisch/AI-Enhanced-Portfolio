//src/app/admin/chatbot/page.js

"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "components/DashboardLayout";
import { Pie, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ChatbotAdminPage() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [temperature, setTemperature] = useState(0.6);
  const [enabled, setEnabled] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [maxResponses, setMaxResponses] = useState(12);

  // Test Modal State
  const [testOpen, setTestOpen] = useState(false);
  const [testInput, setTestInput] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);

    const configRes = await fetch("/api/chatbot/config");
    const configData = await configRes.json();

    const analyticsRes = await fetch("/api/chatbot/analytics");
    const analyticsData = await analyticsRes.json();

    setSystemPrompt(configData.systemPrompt || "");
    setFaqs(configData.faqs || []);
    setTemperature(configData.temperature ?? 0.6);
    setEnabled(configData.enabled ?? true);
    setAnalytics(analyticsData);

    setLoading(false);
  }

  const saveSettings = async () => {
    setSaving(true);

    await fetch("/api/chatbot/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemPrompt,
        faqs,
        temperature,
        enabled,
      }),
    });

    setSaving(false);
  };

  const testPrompt = async () => {
    if (!testInput.trim()) return;

    setTesting(true);

    const res = await fetch("/api/chatbot/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: testInput }),
    });

    const data = await res.json();

    setTesting(false);
    setTestResponse(data.response || "No response.");
  };

  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);

  const updateFaq = (i, key, val) => {
    const updated = [...faqs];
    updated[i][key] = val;
    setFaqs(updated);
  };

  if (loading)
    return (
      <DashboardLayout isAdmin>
        <p className="p-8">Loading...</p>
      </DashboardLayout>
    );

  return (
    <DashboardLayout isAdmin>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6">Chatbot Settings & Analytics</h1>

        {/* ========= TRAINING EXPLAINER PANEL ========== */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
          <h2 className="text-xl font-semibold mb-3">How Chatbot Training Works</h2>
          <p className="text-gray-700 leading-relaxed">
            The chatbot combines three layers of knowledge:
          </p>
          <ul className="list-disc ml-6 mt-3 text-gray-700">
            <li>
              <strong>System Prompt</strong> — defines personality, rules, tone, and structure.
            </li>
            <li>
              <strong>FAQ Knowledge Base</strong> — static Q&A that the bot can use directly.
            </li>
            <li>
              <strong>LLM Temperature</strong> — controls creativity (0 = factual, 1 = creative).
            </li>
          </ul>
          <p className="text-gray-700 mt-3">
            Admins can fine-tune how the bot behaves by adjusting these settings.  
            Use the <strong>“Test Prompt”</strong> tool below to preview how the bot answers.
          </p>
        </div>

        {/* ======= UNIFIED CHATBOT SETTINGS PANEL ======= */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-6">Chatbot Settings</h2>

          {/* Enable / Disable */}
          <div className="flex items-center justify-between mb-8">
            <label className="text-lg font-medium">Chatbot Status</label>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`px-5 py-2.5 rounded-lg text-white text-sm font-medium ${
                enabled ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {enabled ? "Enabled" : "Disabled"}
            </button>
          </div>

          {/* Temperature */}
          <div className="mb-10">
            <label className="font-medium text-lg">
              LLM Temperature: <span className="text-purple-600">{temperature}</span>
            </label>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full mt-3 accent-purple-600"
            />

            <p className="text-gray-500 text-sm mt-1">
              Lower = consistent & factual. Higher = creative & expressive.
            </p>
          </div>

          {/* System Prompt */}
          <div className="mb-10">
            <label className="font-medium text-lg">System Prompt</label>
            <textarea
              className="w-full rounded-lg p-4 h-128 mt-2 bg-gray-50 shadow-inner text-sm leading-relaxed"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Define the bot's personality, tone, and behavior here..."
            />
          </div>

          {/* ========= FAQ MANAGER WITH DRAG + CATEGORIES ========= */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">FAQ Knowledge Base</h2>
              <button
                onClick={() =>
                  setFaqs([...faqs, { question: "", answer: "", category: "other" }])
                }
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                + Add FAQ
              </button>
            </div>

            <DragDropContext
              onDragEnd={(result) => {
                if (!result.destination) return;
                const reordered = Array.from(faqs);
                const [moved] = reordered.splice(result.source.index, 1);
                reordered.splice(result.destination.index, 0, moved);
                setFaqs(reordered);
              }}
            >
              <Droppable droppableId="faqList">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {faqs.map((faq, i) => (
                      <Draggable key={i} draggableId={`faq-${i}`} index={i}>
                        {(prov) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            className="p-5 bg-gray-50 rounded-xl shadow-sm mb-4 hover:shadow-md transition"
                          >
                            {/* Header with drag handle + delete */}
                            <div className="flex justify-between mb-3 items-center">
                              <div className="flex items-center gap-2">
                                <span className="cursor-grab text-gray-500">☰</span>
                                <strong className="font-boldtext-gray-800">
                                  FAQ #{i + 1}
                                </strong>
                              </div>
                              <button
                                onClick={() =>
                                  setFaqs(faqs.filter((_, idx) => idx !== i))
                                }
                                className="text-red-600 hover:underline text-sm"
                              >
                                Delete
                              </button>
                            </div>

                            {/* Category Selector */}
                            <select
                              className="shadow-inner p-2 rounded mb-3 w-full bg-white"
                              value={faq.category}
                              onChange={(e) =>
                                updateFaq(i, "category", e.target.value)
                              }
                            >
                              <option value="shipping">Shipping</option>
                              <option value="payment">Payment</option>
                              <option value="commission">Commissions</option>
                              <option value="other">Other</option>
                            </select>

                            {/* Question */}
                            <input
                              value={faq.question}
                              onChange={(e) =>
                                updateFaq(i, "question", e.target.value)
                              }
                              placeholder="Question..."
                              className="w-full shadow-inner rounded-lg p-3 mb-3 bg-white"
                            />

                            {/* Answer */}
                            <textarea
                              value={faq.answer}
                              onChange={(e) =>
                                updateFaq(i, "answer", e.target.value)
                              }
                              placeholder="Answer..."
                              className="w-full shadow-inner rounded-lg p-3 h-24 bg-white"
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-base"
            >
              {saving ? "Saving…" : "Save All Settings"}
            </button>
          </div>
        </div>


        {/* ========= TEST PROMPT MODAL BUTTON ========== */}
        <button
          onClick={() => setTestOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 mb-10"
        >
          Test Prompt
        </button>

        {/* ========= ANALYTICS ========= */}
        <h2 className="text-2xl font-semibold mb-4">Chatbot Analytics</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Intent Breakdown</h3>

            <Pie
              data={{
                labels: ["Artist", "Admin", "General"],
                datasets: [
                  {
                    data: [
                      analytics.intentCounts.artist,
                      analytics.intentCounts.admin,
                      analytics.intentCounts.general,
                    ],
                    backgroundColor: [
                      "rgba(236, 72, 153, 0.6)",
                      "rgba(59, 130, 246, 0.6)",
                      "rgba(156, 163, 175, 0.6)",
                    ],
                  },
                ],
              }}
            />
          </div>

          {/* Bar Chart */}
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Most Asked Questions</h3>

            <Bar
              data={{
                labels: analytics.topQuestions.map((q) => q._id),
                datasets: [
                  {
                    label: "Count",
                    data: analytics.topQuestions.map((q) => q.count),
                    backgroundColor: "rgba(99, 102, 241, 0.6)",
                  },
                ],
              }}
              options={{
                plugins: { legend: { display: false } },
                responsive: true,
              }}
            />
          </div>
        </div>
        

        {/* ========= TEST PROMPT MODAL ========= */}
        {testOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-200 max-h-[80vh] overflow-y-auto">

            <h2 className="text-xl font-semibold mb-4">Test Your Prompt</h2>

            <textarea
              className="w-full border p-3 rounded-lg mb-3"
              placeholder="Type message to test..."
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
            />

            <button
              onClick={testPrompt}
              disabled={testing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {testing ? "Testing..." : "Run Test"}
            </button>

            {testResponse && (
              <div className="mt-4 p-3 border rounded bg-gray-50 whitespace-pre-wrap">
                <strong>Bot Response:</strong>
                <p className="mt-2 text-gray-700">{testResponse}</p>
              </div>
            )}

            <button
              onClick={() => setTestOpen(false)}
              className="mt-4 text-gray-600 hover:text-gray-900 w-full text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}
