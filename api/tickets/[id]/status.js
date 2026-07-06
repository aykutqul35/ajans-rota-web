import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const { status } = req.body;
      const now = new Date().toISOString();

      await sql`
        UPDATE tickets
        SET status = ${status}, updated_at = ${now}
        WHERE id = ${id}
      `;

      return res.status(200).json({ success: true, message: 'Status updated' });
    } catch (error) {
      console.error("PUT Status Error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
