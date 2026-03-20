// Vercel serverless function: /api/state
// GET — returns saved state or { useSeeds: true } if no DB configured
// PUT — saves full app state (projects + nodes)

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // No database configured — signal frontend to use seed data
  if (!process.env.DATABASE_URL) {
    return res.status(200).json({ useSeeds: true });
  }

  // Dynamic import so it doesn't fail when the package isn't needed
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL);

  // Ensure table exists
  await sql`
    CREATE TABLE IF NOT EXISTS app_state (
      id INTEGER PRIMARY KEY DEFAULT 1,
      projects JSONB NOT NULL DEFAULT '[]'::jsonb,
      nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  if (req.method === "GET") {
    const rows = await sql`SELECT projects, nodes FROM app_state WHERE id = 1`;
    if (rows.length === 0) {
      return res.status(200).json({ projects: [], nodes: [] });
    }
    return res.status(200).json(rows[0]);
  }

  if (req.method === "PUT" || req.method === "POST") {
    const { projects, nodes } = req.body;
    await sql`
      INSERT INTO app_state (id, projects, nodes, updated_at)
      VALUES (1, ${JSON.stringify(projects)}::jsonb, ${JSON.stringify(nodes)}::jsonb, NOW())
      ON CONFLICT (id) DO UPDATE SET
        projects = ${JSON.stringify(projects)}::jsonb,
        nodes = ${JSON.stringify(nodes)}::jsonb,
        updated_at = NOW()
    `;
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
