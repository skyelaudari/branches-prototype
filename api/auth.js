// Vercel serverless function: /api/auth
// POST — verify passcode and set auth cookie
// GET — check if user is authenticated (has valid cookie or no passcode required)

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const passcode = process.env.ACCESS_PASSCODE;

  // No passcode configured — no gate needed
  if (!passcode) {
    return res.status(200).json({ authenticated: true, gateEnabled: false });
  }

  if (req.method === "GET") {
    // Check if the auth cookie is valid
    const cookies = parseCookies(req.headers.cookie || "");
    const isAuth = cookies.branches_auth === passcode;
    return res.status(200).json({ authenticated: isAuth, gateEnabled: true });
  }

  if (req.method === "POST") {
    const { passcode: submitted } = req.body || {};

    if (submitted !== passcode) {
      return res.status(401).json({ error: "Incorrect passcode" });
    }

    // Default 1 day, configurable via env
    const maxAge = parseInt(process.env.COOKIE_MAX_AGE || "86400", 10);
    res.setHeader(
      "Set-Cookie",
      `branches_auth=${passcode}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}; Secure`
    );
    return res.status(200).json({ authenticated: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

function parseCookies(cookieHeader) {
  const cookies = {};
  for (const pair of cookieHeader.split(";")) {
    const [key, ...rest] = pair.trim().split("=");
    if (key) cookies[key] = rest.join("=");
  }
  return cookies;
}
