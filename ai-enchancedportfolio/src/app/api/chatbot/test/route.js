import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ response: "No message provided." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a test instance of the ArtSpace Chatbot. Reply directly." }],
        },
      ],
    });

    const result = await chat.sendMessage(message);

    return NextResponse.json({
      response: result.response.text(),
    });

  } catch (err) {
    console.error("Test chatbot error:", err);
    return NextResponse.json(
      { response: "Test failed: " + err.message },
      { status: 500 }
    );
  }
}
