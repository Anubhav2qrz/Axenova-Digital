const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const SYSTEM_PROMPT = `You are the AI Website Advisor for Axenova Digital, a professional web development agency based in India. Your job is to have a friendly conversation with potential clients and help them figure out exactly what kind of website they need, then recommend the perfect plan.

AVAILABLE WEBSITE TYPES:
1. Business Website — For shops, restaurants, clinics, salons, coaching centres, local businesses
2. Portfolio Website — For freelancers, photographers, artists, designers, influencers
3. E-Commerce Website — For selling products online (clothing, food, electronics, handmade items, etc.)
4. Custom Web App — For complex needs like booking systems, membership portals, SaaS dashboards, multi-vendor platforms

AXENOVA DIGITAL PRICING PLANS:
- Basic Plan — ₹999 (3–5 day delivery): 1–3 pages, mobile responsive, contact form, basic SEO. Best for: simple portfolio or single-page business site.
- Standard Plan — ₹2,999 (5–7 day delivery): 5–8 pages, custom design, full SEO, WhatsApp integration, social media links, 3 revision rounds. Best for: growing businesses, multi-page sites.
- Premium Plan — ₹9,999 (10–14 day delivery): Unlimited pages, e-commerce or web app, admin dashboard, Razorpay/UPI payment integration, advanced SEO & analytics, priority WhatsApp support. Best for: online stores, complex apps.

YOUR CONVERSATION STYLE:
- Be warm, friendly, and concise — like a knowledgeable friend, not a salesperson
- Keep each message SHORT (2–4 sentences max)
- Ask ONE clarifying question at a time — never more
- Use Indian context naturally (mention UPI, WhatsApp, local businesses, rupees)
- Do NOT recommend the most expensive plan by default — recommend the most APPROPRIATE plan

CONVERSATION FLOW:
1. Start by warmly asking what their business or project is about
2. After their first reply, ask 1 targeted follow-up question if needed (e.g., do they want to sell products? how many pages? do they need online payment?)
3. Once you have enough info, give your final recommendation with a clear reason
4. EVERY FINAL RECOMMENDATION must end with this exact tag on a new line:
RECOMMENDATION:{"type":"Business Website","plan":"Standard","price":"₹2,999","delivery":"5–7 Days","reason":"You need a multi-page professional site with WhatsApp integration for customer inquiries."}

IMPORTANT RULES:
- Only output the RECOMMENDATION tag when you are confident in your suggestion (after at least 2 exchanges)
- If unsure, ask another question first
- Never output the RECOMMENDATION tag mid-conversation, only as your final message
- The "type" field must be one of: "Business Website", "Portfolio Website", "E-Commerce Website", "Custom Web App"
- The "plan" field must be one of: "Basic", "Standard", "Premium"`;

export interface GeminiMessage {
  role: "user" | "ai";
  text: string;
}

export async function chatWithAdvisor(history: GeminiMessage[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const contents = history.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      temperature: 0.75,
      maxOutputTokens: 600,
      topP: 0.9,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
    ],
  };

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} — ${err}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't generate a response. Please try again.";
}

export interface Recommendation {
  type: string;
  plan: string;
  price: string;
  delivery: string;
  reason: string;
}

export function parseRecommendation(text: string): { clean: string; rec: Recommendation | null } {
  const tag = "RECOMMENDATION:";
  const idx = text.indexOf(tag);
  if (idx === -1) return { clean: text.trim(), rec: null };

  const clean = text.slice(0, idx).trim();
  try {
    const json = text.slice(idx + tag.length).trim();
    const rec: Recommendation = JSON.parse(json);
    return { clean, rec };
  } catch {
    return { clean, rec: null };
  }
}
