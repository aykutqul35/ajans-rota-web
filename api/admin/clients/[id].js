import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer admin-mock-token')) {
        return res.status(401).json({ success: false, message: 'Yetkisiz erişim.' });
      }

      const { email, brandName, reportData } = req.body;
      const now = new Date().toISOString();

      await sql`
        UPDATE "Client"
        SET email = ${email}, "brandName" = ${brandName}, "reportData" = ${JSON.stringify(reportData)}, "updatedAt" = ${now}
        WHERE id = ${id}
      `;

      return res.status(200).json({ success: true, message: 'Client updated successfully' });
    } catch (error) {
      console.error("PUT Client Error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer admin-mock-token')) {
        return res.status(401).json({ success: false, message: 'Yetkisiz erişim.' });
      }

      await sql`
        DELETE FROM "Client"
        WHERE id = ${id}
      `;

      return res.status(200).json({ success: true, message: 'Client deleted successfully' });
    } catch (error) {
      console.error("DELETE Client Error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
