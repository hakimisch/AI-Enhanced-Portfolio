import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatSession from "@/app/models/ChatSession";
import dbConnect from "@/app/libs/mongoose";
import ChatbotConfig from "@/app/models/ChatbotConfig";

export async function POST(req) {
  try {
    await dbConnect();

    const { message, sessionKey } = await req.json();

    // --------------------------
    // SESSION IDENTIFIER
    // --------------------------
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0];
    const key =
      sessionKey ||
      (ip ? `anon_${ip.replace(/\./g, "_")}` : `anon_${Math.random()}`);

    // --------------------------
    // LOAD SESSION
    // --------------------------
    let session = await ChatSession.findOne({ sessionKey: key });

    if (!session) {
      session = await ChatSession.create({
        sessionKey: key,
        messages: [],
      });
    }

    const recentMessages = session.messages.slice(-12);

    // --------------------------
    // SET UP GEMINI
    // --------------------------
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    // --------------------------
    // LOAD CONFIG + BUILD SYSTEM MESSAGE
    // --------------------------
    const config = await ChatbotConfig.findOne();

    const configSystemPrompt =
      config?.systemPrompt ||
      "You are ArtSpace Support Bot. Answer clearly and concisely.";

    const faqText =
      config?.faqs
        ?.map((f) => `Q: ${f.question}\nA: ${f.answer}`)
        .join("\n\n") || "";

    // old rules merged into config system prompt
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

    // --------------------------
    // FORMAT HISTORY FOR GEMINI
    // --------------------------
    const formattedHistory = recentMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [systemMessage, ...formattedHistory],
    });

    // --------------------------
    // CUT OFF TOO-LONG CHATS
    // --------------------------
    if (recentMessages.length >= 12) {
      return NextResponse.json({
        response: "This session has ended. Please contact support or an artist.",
        intent: "general",
        ended: true,
      });
    }

    // --------------------------
    // SEND MESSAGE TO LLM
    // --------------------------
    const result = await chat.sendMessage(message);
    const raw = result.response.text().trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { reply: raw, intent: "general" };
    }

    // --------------------------
    // SAVE MESSAGES TO DATABASE
    // --------------------------
    session.messages.push({ role: "user", content: message });
    session.messages.push({
      role: "assistant",
      content: parsed.reply,
      intent: parsed.intent,
    });
    await session.save();

    // --------------------------
    // AUTO-CLEAN OLD SESSIONS
    // --------------------------
    ChatSession.deleteMany({
      updatedAt: { $lt: new Date(Date.now() - 48 * 60 * 60 * 1000) },
    }).catch(() => {});

    // --------------------------
    // SEND RESPONSE TO FRONTEND
    // --------------------------
    return NextResponse.json({
      response: parsed.reply,
      intent: parsed.intent,
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