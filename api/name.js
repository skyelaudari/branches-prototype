// Vercel serverless function: /api/name
// Lightweight branch auto-naming — calls Haiku to summarize a message into a short label

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 30,
        system: "Generate a short label (2-5 words) summarizing the user's message. This will be used as a chat branch name. Return ONLY the label, no quotes, no punctuation at the end.",
        messages: [{ role: "user", content: req.body.message }],
      }),
    });
    const data = await response.json();
    res.json({ name: data.content?.[0]?.text?.trim() || null });
  } catch {
    res.json({ name: null });
  }
}
