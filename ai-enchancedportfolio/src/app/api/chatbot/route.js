//api/api/chatbot/route.js

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatSession from "@/app/models/ChatSession";
import ChatbotConfig from "@/app/models/ChatbotConfig";
import dbConnect from "@/app/libs/mongoose";

export async function POST(req) {
  try {
    await dbConnect();

    // ---------------------------------------------------
    // LOAD CHATBOT CONFIG (SINGLE SOURCE OF TRUTH)
    // ---------------------------------------------------
    const config = await ChatbotConfig.findOne();

    // 🔒 CHATBOT ENABLED CHECK
    if (config && config.enabled === false) {
      return NextResponse.json({
        response: "The chatbot is currently disabled by admin.",
        intent: "general",
        ended: true,
      });
    }

    // ---------------------------------------------------
    // ADMIN-CONTROLLED MAX RESPONSES
    // ---------------------------------------------------
    const maxResponses =
      typeof config?.maxResponsesPerSession === "number"
        ? config.maxResponsesPerSession
        : 12;

    // ---------------------------------------------------
    // REQUEST BODY + SESSION KEY
    // ---------------------------------------------------
    const { message, sessionKey } = await req.json();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0];

    const key =
      sessionKey ||
      (ip ? `anon_${ip.replace(/\./g, "_")}` : `anon_${Math.random()}`);

    // ---------------------------------------------------
    // LOAD OR CREATE CHAT SESSION
    // ---------------------------------------------------
    let session = await ChatSession.findOne({ sessionKey: key });

    if (!session) {
      session = await ChatSession.create({
        sessionKey: key,
        messages: [],
      });
    }

    // ---------------------------------------------------
    // SESSION RESPONSE LIMIT ENFORCEMENT
    // ---------------------------------------------------
    const assistantReplies = session.messages.filter(
      (m) => m.role === "assistant"
    );

    if (assistantReplies.length >= maxResponses) {
      return NextResponse.json({
        response:
          "This session has reached the maximum number of responses. Please contact support or an artist.",
        intent: "general",
        ended: true,
      });
    }

    // ---------------------------------------------------
    // SET UP GEMINI
    // ---------------------------------------------------
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // ---------------------------------------------------
    // SYSTEM PROMPT + FAQ CONTEXT
    // ---------------------------------------------------
    const systemPrompt =
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
5. Return ONLY valid JSON.

Intent keywords:
- commission, custom art, hire artist → "artist"
- order, shipping, payment, refund → "admin"

Response format:
{
  "reply": "...",
  "intent": "general" | "artist" | "admin",
  "action": { "type": "link", "label": "...", "target": "artist" | "support" | "shop" } | null
}
`;

    const systemMessage = {
      role: "user",
      parts: [
        {
          text: `
${systemPrompt}

${intentRules}

FAQs:
${faqText}
`,
        },
      ],
    };

    // ---------------------------------------------------
    // FORMAT CHAT HISTORY (LIMITED)
    // ---------------------------------------------------
    const formattedHistory = session.messages
      .slice(-maxResponses * 2)
      .map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

    const chat = model.startChat({
      history: [systemMessage, ...formattedHistory],
    });

    // ---------------------------------------------------
    // SEND MESSAGE TO LLM
    // ---------------------------------------------------
    const result = await chat.sendMessage(message);
    const raw = result.response.text().trim();

    // ---------------------------------------------------
    // PARSE JSON RESPONSE SAFELY
    // ---------------------------------------------------
    let parsed;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        const temp = JSON.parse(jsonMatch[0]);
        parsed = {
          reply: temp.reply || raw,
          intent: temp.intent || "general",
          action: temp.action || null,
        };
      } catch {
        parsed = { reply: raw, intent: "general", action: null };
      }
    } else {
      parsed = { reply: raw, intent: "general", action: null };
    }

    // ---------------------------------------------------
    // SAVE MESSAGE PAIR
    // ---------------------------------------------------
    session.messages.push({ role: "user", content: message });
    session.messages.push({
      role: "assistant",
      content: parsed.reply,
      intent: parsed.intent,
      action: parsed.action,
    });

    await session.save();

    // ---------------------------------------------------
    // AUTO CLEAN OLD SESSIONS (48H)
    // ---------------------------------------------------
    ChatSession.deleteMany({
      updatedAt: { $lt: new Date(Date.now() - 48 * 60 * 60 * 1000) },
    }).catch(() => {});

    // ---------------------------------------------------
    // RETURN TO CLIENT
    // ---------------------------------------------------
    return NextResponse.json({
      response: parsed.reply,
      intent: parsed.intent,
      action: parsed.action,
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
