export const getGeminiResponse = async (userMsg: string): Promise<string> => {
  try {
    // ── validasi di sisi client sebelum kirim ──
    const trimmed = userMsg?.trim();
    if (!trimmed) return "Ketik sesuatu dulu ya 😊";

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: trimmed }),
    });

    const data = await response.json();

    // ── cek error dari server (status non-200 ATAU body punya field error) ──
    if (!response.ok || data.error) {
      console.error("API Error:", data.error);
      return "Sistem AI lagi down, tapi Pintu Login lu tetep aman.";
    }

    // ── validasi respons ada isi ──
    if (!data.text || typeof data.text !== "string") {
      return "Hmm, AI-nya diam nih. Coba lagi sebentar ya.";
    }

    return data.text;
  } catch (error) {
    console.error("Critical Error:", error);
    return "Sistem AI lagi down, tapi Pintu Login lu tetep aman.";
  }
};