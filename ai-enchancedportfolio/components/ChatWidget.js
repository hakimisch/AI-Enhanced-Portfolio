"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

// Clean bot replies even if Gemini returns JSON text
function cleanBotMessage(text) {
  if (!text) return "";

  text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

  // If JSON, extract `reply`
  if (text.startsWith("{") && text.endsWith("}")) {
    try {
      const obj = JSON.parse(text);
      if (obj.reply) return obj.reply;
    } catch {}
  }

  return text;
}


export default function ChatWidget() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);
  const chatRef = useRef(null);
  const router = useRouter();

  // Auto-scroll on new messages
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const suggestions = [
    "How do commissions work?",
    "How do I check my order?",
    "What payment methods are available?",
    "How long is shipping?",
    "How do I become an artist?",
    "Show me available artworks",
  ];

  const sendMessage = async (textOverride) => {
    if (loading || ended) return;

    const userInput = textOverride || input;
    if (!userInput.trim()) return;

    const userMsg = { role: "user", content: userInput };
    const updatedHistory = [...messages, userMsg];

    setMessages(updatedHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          history: updatedHistory,
          sessionKey: session?.user?.email || undefined,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.ended) setEnded(true);

      const cleaned = cleanBotMessage(data.response);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: cleaned,
          intent: data.intent,
        },
      ]);
    } catch (err) {
      setLoading(false);
      console.error("Chatbot error:", err);
    }
  };

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
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {/* Suggestions if chat empty */}
            {messages.length === 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {suggestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-2 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Message bubbles */}
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

                {/* Intent Routing Buttons */}
                {m.role === "assistant" && m.intent === "artist" && (
                  <>
                    <div className="text-xs text-gray-500 mt-1">
                      Need a custom artwork or commission?
                    </div>
                    <button
                      onClick={() => router.push("/contact/artist")}
                      className="mt-1 text-xs bg-pink-500 text-white py-1 px-2 rounded self-start hover:bg-pink-600"
                    >
                      Contact Artist →
                    </button>
                  </>
                )}

                {m.role === "assistant" && m.intent === "admin" && (
                  <>
                    <div className="text-xs text-gray-500 mt-1">
                      Need help with orders or payments?
                    </div>
                    <button
                      onClick={() => router.push("/contact/support")}
                      className="mt-1 text-xs bg-blue-500 text-white py-1 px-2 rounded self-start hover:bg-blue-600"
                    >
                      Contact Support →
                    </button>
                  </>
                )}


                

              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
              </div>
            )}

            {/* Ended message */}
            {ended && (
              <div className="text-gray-500 text-xs italic mt-2">
                Chat ended — please contact support or an artist for more help.
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
              className="flex-1 border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || ended}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
