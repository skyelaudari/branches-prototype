// Local dev API server — run alongside Vite with: node server.js
// Proxies /api/chat to Anthropic's API using your ANTHROPIC_API_KEY
// Proxies /api/files/:fileId to Anthropic's Files API for document downloads

import { readFileSync } from "fs";
import express from "express";
import cors from "cors";
import handler from "./api/chat.js";

// Load .env manually so `node server.js` works without --env-file flag
try {
  const envFile = readFileSync(".env", "utf8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq > 0) process.env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
} catch {}


const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Adapt the Vercel-style handler to Express
app.post("/api/chat", (req, res) => {
  // Add Vercel-compatible setHeader method
  const originalSetHeader = res.setHeader.bind(res);
  res.setHeader = originalSetHeader;
  return handler(req, res);
});

// File download proxy — fetches files from Anthropic's Files API and streams to browser
app.get("/api/files/:fileId", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  const { fileId } = req.params;
  const betaHeader = "files-api-2025-04-14";

  try {
    // Fetch file metadata to get the filename
    const metaRes = await fetch(`https://api.anthropic.com/v1/files/${fileId}`, {
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": betaHeader,
      },
    });

    if (!metaRes.ok) {
      const err = await metaRes.json().catch(() => ({}));
      return res.status(metaRes.status).json(err);
    }

    const meta = await metaRes.json();
    const filename = meta.filename || `file-${fileId}`;

    // Fetch the actual file content
    const contentRes = await fetch(
      `https://api.anthropic.com/v1/files/${fileId}/content`,
      {
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-beta": betaHeader,
        },
      }
    );

    if (!contentRes.ok) {
      const err = await contentRes.json().catch(() => ({}));
      return res.status(contentRes.status).json(err);
    }

    // Set download headers
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    const contentType = contentRes.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);

    // Stream the response body to the client
    const reader = contentRes.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) { res.end(); return; }
        res.write(Buffer.from(value));
      }
    };
    await pump();
  } catch (err) {
    res.status(500).json({ error: `File fetch failed: ${err.message}` });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API proxy running at http://localhost:${PORT}`);
  console.log(`  POST /api/chat — Claude Messages API`);
  console.log(`  GET  /api/files/:id — File download proxy`);
});
