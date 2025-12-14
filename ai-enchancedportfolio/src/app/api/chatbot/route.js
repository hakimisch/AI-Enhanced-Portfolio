//api/api/chatbot/route.js

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatSession from "@/app/models/ChatSession";
import dbConnect from "@/app/libs/mongoose";
import ChatbotConfig from "@/app/models/ChatbotConfig";

export async function POST(req) {
  try {
    await dbConnect();

    // ---------------------------------------------------
    // 🔒 CHATBOT ENABLED CHECK (NEW)
    // ---------------------------------------------------
    const cfg = await ChatbotConfig.findOne();
    if (cfg && cfg.enabled === false) {
      return NextResponse.json({
        response: "The chatbot is currently disabled by admin.",
        intent: "general",
        ended: true,
      });
    }

    // ---------------------------------------------------
    // SESSION IDENTIFIER
    // ---------------------------------------------------
    const { message, sessionKey } = await req.json();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0];
    const key =
      sessionKey ||
      (ip ? `anon_${ip.replace(/\./g, "_")}` : `anon_${Math.random()}`);

    // ---------------------------------------------------
    // LOAD SESSION
    // ---------------------------------------------------
    let session = await ChatSession.findOne({ sessionKey: key });

    if (!session) {
      session = await ChatSession.create({
        sessionKey: key,
        messages: [],
      });
    }

    const recentMessages = session.messages.slice(-12);

    // ---------------------------------------------------
    // SET UP GEMINI
    // ---------------------------------------------------
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // ---------------------------------------------------
    // LOAD CONFIG + BUILD SYSTEM MESSAGE
    // ---------------------------------------------------
    const config = await ChatbotConfig.findOne();

    const configSystemPrompt =
      config?.systemPrompt ||
      "You are ArtSpace Support Bot. Answer clearly and concisely.";

    const faqText =
      config?.faqs
        ?.map((f) => `Q: ${f.question}\nA: ${f.answer}`)
        .join("\n\n") || "";

    const intentRules = `
Rules:
1. Answer concisely.
2. If commissions → intent = "artist".
3. If shipping/payment/orders → intent = "admin".
4. Max 120 words.
5. Return ONLY valid JSON:

If the user mentions:
- "commission", "custom art", "hire artist", "artist", "become an artist", "contact artist", "artist profile"
  → intent = "artist"

- "order", "shipping", "payment", "refund", "tracking", "order status", "customer support"
  → intent = "admin"

If the user is expressing frustration, confusion, or cannot proceed,
respond normally but set intent = "admin".

{ "reply": "...", "intent": "general" | "artist" | "admin" }

You MAY optionally include an "action" field.

Action rules:
- Do NOT include raw URLs in text.
- Use actions ONLY when helpful.
- Action must be one of:

{ "type": "link", "label": "...", "target": "artist" | "support" | "become-artist" | "shop" }

Full response format:
{
  "reply": "...",
  "intent": "general" | "artist" | "admin",
  "action": { ... } | null
}
`;


    const systemMessage = {
      role: "user",
      parts: [
        {
          text: `
${configSystemPrompt}

${intentRules}

Here are FAQs:
${faqText}
`,
        },
      ],
    };

    // ---------------------------------------------------
    // FORMAT HISTORY FOR GEMINI
    // ---------------------------------------------------
    const formattedHistory = recentMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [systemMessage, ...formattedHistory],
    });

    // ---------------------------------------------------
    // CUTOFF FOR LONG SESSIONS
    // ---------------------------------------------------
    if (recentMessages.length >= 12) {
      return NextResponse.json({
        response: "This session has ended. Please contact support or an artist.",
        intent: "general",
        ended: true,
      });
    }

    // ---------------------------------------------------
    // SEND MESSAGE TO LLM
    // ---------------------------------------------------
    const result = await chat.sendMessage(message);
    const raw = result.response.text().trim();

    // --- Extract JSON inside ANY messy output ---
    let parsed = null;

    // Find JSON object inside the string
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
  try {
    const temp = JSON.parse(jsonMatch[0]);
    parsed = {
      reply: temp.reply || raw,
      intent: temp.intent || "general",
      action: temp.action || null,
    };
  } catch (e) {
    parsed = {
      reply: raw,
      intent: "general",
      action: null,
    };
  }
} else {
  parsed = {
    reply: raw,
    intent: "general",
    action: null,
  };
}

    // ---------------------------------------------------
    // SAVE MESSAGES TO DATABASE
    // ---------------------------------------------------
    session.messages.push({ role: "user", content: message });
    session.messages.push({
      role: "assistant",
      content: parsed.reply,
      intent: parsed.intent,
      action: parsed.action || null,
    });
    await session.save();

    // ---------------------------------------------------
    // AUTO-CLEAN OLD SESSIONS
    // ---------------------------------------------------
    ChatSession.deleteMany({
      updatedAt: { $lt: new Date(Date.now() - 48 * 60 * 60 * 1000) },
    }).catch(() => {});

    // ---------------------------------------------------
    // RETURN TO FRONTEND
    // ---------------------------------------------------
    return NextResponse.json({
      response: parsed.reply,
      intent: parsed.intent,
      action: parsed.action || null,
      ended: false,
      sessionKey: key,
    });
  } catch (err) {
    console.error("Chatbot error:", err);
    return NextResponse.json(
      { error: "LLM processing failed" },
      { status: 500 }
    );
  }
}
