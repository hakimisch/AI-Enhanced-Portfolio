"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "components/DashboardLayout";

export default function ChatbotSettings() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      const res = await fetch("/api/chatbot/config");
      const data = await res.json();
      setSystemPrompt(data.systemPrompt || "");
      setFaqs(data.faqs || []);
      setLoading(false);
    }
    loadConfig();
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    await fetch("/api/chatbot/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemPrompt, faqs }),
    });
    setSaving(false);
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const updateFaq = (index, key, value) => {
    const updated = [...faqs];
    updated[index][key] = value;
    setFaqs(updated);
  };

  return (
    <DashboardLayout isAdmin>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6">Chatbot Settings</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* System Prompt */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-3">
                System Prompt (Chatbot Personality & Rules)
              </h2>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full border rounded-lg p-4 h-40"
              />
            </div>

            {/* FAQ List */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold mb-3">FAQ Knowledge</h2>
                <button
                  onClick={addFaq}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  + Add FAQ
                </button>
              </div>

              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="border p-4 rounded-lg mb-4 bg-gray-50"
                >
                  <input
                    value={faq.question}
                    onChange={(e) =>
                      updateFaq(i, "question", e.target.value)
                    }
                    className="w-full border p-2 mb-2 rounded"
                    placeholder="Question..."
                  />
                  <textarea
                    value={faq.answer}
                    onChange={(e) =>
                      updateFaq(i, "answer", e.target.value)
                    }
                    className="w-full border p-2 rounded h-20"
                    placeholder="Answer..."
                  />
                </div>
              ))}
            </div>

            {/* Save Button */}
            <button
              onClick={saveSettings}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
