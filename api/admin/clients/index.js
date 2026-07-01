import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  if (req.method === 'GET') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer admin-mock-token')) {
        return res.status(401).json({ success: false, message: 'Yetkisiz erişim.' });
      }

      // Get all clients
      const clients = await sql`SELECT * FROM "Client"`;
      return res.status(200).json({ success: true, data: clients });
    } catch (error) {
      console.error("GET Clients Error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }

  if (req.method === 'POST') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer admin-mock-token')) {
        return res.status(401).json({ success: false, message: 'Yetkisiz erişim.' });
      }

      const { clerkId, email, brandName, reportData } = req.body;
      const id = 'c_' + Date.now();
      const now = new Date().toISOString();

      await sql`
        INSERT INTO "Client" (id, "clerkId", email, "brandName", "reportData", "createdAt", "updatedAt")
        VALUES (${id}, ${clerkId}, ${email}, ${brandName}, ${JSON.stringify(reportData)}, ${now}, ${now})
      `;

      return res.status(201).json({ success: true, data: { id, clerkId } });
    } catch (error) {
      console.error("POST Client Error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
