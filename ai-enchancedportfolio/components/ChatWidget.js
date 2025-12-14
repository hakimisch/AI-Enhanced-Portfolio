//ChatWidget.js

"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

// Clean bot replies even if Gemini returns JSON text
function cleanBotMessage(text) {
  if (!text) return "";

  text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

  if (text.startsWith("{") && text.endsWith("}")) {
    try {
      const obj = JSON.parse(text);
      if (obj.reply) return obj.reply;
    } catch {}
  }

  return text;
}

// Intent-aware follow-up suggestions
const FOLLOW_UP_SUGGESTIONS = {
  general: [
    "Show me artworks",
    "Browse artists",
    "View the shop",
    "Read latest blogs",
  ],
  artist: [
    "How do commissions work?",
    "Contact an artist",
    "Browse artist portfolios",
  ],
  admin: [
    "Where is my order?",
    "Payment issues",
    "Shipping information",
    "Contact support",
  ],
  default: [
    "What can you help me with?",
    "How does ArtSpace work?",
    "Show me popular artworks",
  ],
};

export default function ChatWidget() {
  const { data: session } = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [lastIntent, setLastIntent] = useState("general");

  const chatRef = useRef(null);

  // Safe route map (AI NEVER controls URLs)
  const ACTION_ROUTES = {
    shop: "/e-commerce",
    artworks: "/artworks",
    blogs: "/blog",
    artists: "/artists",
    support: "/contact/support",
    "become-artist": "/artists",
  };

  // Fetch chatbot enabled state
  useEffect(() => {
    fetch("/api/chatbot/config")
      .then((res) => res.json())
      .then((cfg) => setEnabled(cfg.enabled))
      .catch(() => setEnabled(true));
  }, []);

  // Welcome message when chat opens
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Hi! I’m the ArtSpace Assistant 🤍 How can I help you today?",
          intent: "general",
        },
      ]);
      setLastIntent("general");
    }
  }, [open]);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (textOverride) => {
    if (loading || ended) return;

    const userInput = textOverride || input;
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          sessionKey: session?.user?.email || undefined,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.ended) setEnded(true);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: cleanBotMessage(data.response),
          intent: data.intent,
          action: data.action || null,
        },
      ]);

      setLastIntent(data.intent || "default");
    } catch (err) {
      console.error("Chatbot error:", err);
      setLoading(false);
    }
  };

  if (!enabled) return null;

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-purple-500 text-white p-4 rounded-full shadow-lg hover:bg-purple-600 transition"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 bg-white w-80 h-[520px] shadow-xl rounded-xl flex flex-col border border-gray-200">
          {/* Header */}
          <div className="p-4 bg-purple-500 text-white flex justify-between items-center rounded-t-xl">
            <h2 className="text-lg font-semibold">ArtSpace Assistant</h2>
            <button onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className="flex flex-col">
                <div
                  className={`p-2 rounded-lg text-sm whitespace-pre-wrap max-w-[80%] ${
                    m.role === "user"
                      ? "bg-purple-500 text-white self-end ml-auto"
                      : "bg-gray-100 text-gray-800 self-start mr-auto"
                  }`}
                >
                  {m.content}
                </div>

                {/* Action button */}
                {m.role === "assistant" &&
                  m.action?.type === "link" &&
                  ACTION_ROUTES[m.action.target] && (
                    <button
                      onClick={() =>
                        router.push(ACTION_ROUTES[m.action.target])
                      }
                      className="mt-2 text-xs bg-indigo-600 text-white py-1.5 px-3 rounded self-start hover:bg-indigo-700"
                    >
                      {m.action.label} →
                    </button>
                  )}

                {/* Fallback intent buttons */}
                {m.role === "assistant" &&
                  m.intent === "artist" &&
                  !m.action && (
                    <button
                      onClick={() => router.push("/artists")}
                      className="mt-2 text-xs bg-pink-500 text-white py-1.5 px-3 rounded self-start hover:bg-pink-600"
                    >
                      Browse Artists →
                    </button>
                  )}

                {m.role === "assistant" &&
                  m.intent === "admin" &&
                  !m.action && (
                    <button
                      onClick={() => router.push("/contact/support")}
                      className="mt-2 text-xs bg-blue-500 text-white py-1.5 px-3 rounded self-start hover:bg-blue-600"
                    >
                      Contact Support →
                    </button>
                  )}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex gap-1 text-gray-400 text-xs">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
              </div>
            )}

            {/* Smart Suggestions */}
            {!loading && !ended && (
              <div className="flex flex-wrap gap-2 mt-3">
                {(FOLLOW_UP_SUGGESTIONS[lastIntent] ||
                  FOLLOW_UP_SUGGESTIONS.default
                ).map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-100 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {ended && (
              <div className="text-gray-500 text-xs italic">
                Chat ended — please contact support or an artist.
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 flex gap-2 border-t">
            <input
              type="text"
              value={input}
              disabled={loading || ended}
              onChange={(e) => setInput(e.target.value)}
              placeholder={ended ? "Chat ended" : "Type your message…"}
              className="flex-1 border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || ended}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
