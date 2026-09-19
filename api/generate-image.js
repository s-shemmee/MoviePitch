const MAX_LENGTH = 2000;
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const hits = new Map();

function isRateLimited(req) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
  const now = Date.now();
  const timestamps = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  return timestamps.length > MAX_REQUESTS;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (isRateLimited(req)) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  const imagePrompt =
    typeof req.body?.imagePrompt === "string" ? req.body.imagePrompt.trim() : "";

  if (!imagePrompt || imagePrompt.length > MAX_LENGTH) {
    return res.status(400).json({ error: "Missing or invalid image prompt." });
  }

  const fullPrompt = `Movie poster illustration, no text or lettering anywhere in the image: ${imagePrompt}`;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`;

  try {
    const cfRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        steps: 6,
      }),
    });

    const data = await cfRes.json();

    if (!cfRes.ok || !data.success || !data.result?.image) {
      throw new Error(JSON.stringify(data.errors || data));
    }

    return res.status(200).json({
      imageUrl: `data:image/jpeg;base64,${data.result.image}`,
    });
  } catch (error) {
    console.error("generate-image error:", error);
    return res.status(502).json({ error: "Couldn't generate the poster right now. Please try again." });
  }
}