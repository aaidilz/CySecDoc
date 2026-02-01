import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Anda adalah asisten AI cerdas untuk portfolio website. 
Jawab dengan ramah, profesional, dan ringkas dalam Bahasa Indonesia. 
Jika pertanyaan di luar konteks portofolio atau teknologi, tolak dengan sopan dan alihkan.`;

export async function POST(req: Request) {
  try {
    // ── 1. Validasi input ──
    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "Pesan tidak valid." },
        { status: 400 }
      );
    }

    // ── 2. Ambil API key dari env (tanpa NEXT_PUBLIC_) ──
    const apiKey = process.env.GEMINI_API_KEY;

    // DEBUG — hapus baris ini setelah chatbot jalan
    console.log("ENV KEYS yang tersedia:", Object.keys(process.env).filter(k => k.includes("GEMINI")));
    console.log("GEMINI_API_KEY value:", apiKey ? `${apiKey.slice(0, 8)}...` : "undefined");

    if (!apiKey) {
      console.error("GEMINI_API_KEY tidak ditemukan di .env.local");
      return NextResponse.json(
        { error: "Konfigurasi server tidak lengkap." },
        { status: 500 }
      );
    }

    // ── 3. Init Gemini dengan model terbaru ──
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // ── 4. Kirim dengan system prompt ──
    const result = await model.generateContent([
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      { role: "model", parts: [{ text: "Siap, saya akan membantu sesuai konteks." }] },
      { role: "user", parts: [{ text: message.trim() }] },
    ]);

    const response = await result.response;
    const text = response.text();

    if (!text) {
      return NextResponse.json(
        { error: "AI tidak berhasil menghasilkan respons." },
        { status: 500 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}