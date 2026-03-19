// Vercel serverless function: /api/files/:fileId
// Proxies file downloads from Anthropic's Files API

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  const { fileId } = req.query;
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

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    const contentType = contentRes.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);

    const buffer = Buffer.from(await contentRes.arrayBuffer());
    return res.send(buffer);
  } catch (err) {
    return res.status(500).json({ error: `File fetch failed: ${err.message}` });
  }
}
