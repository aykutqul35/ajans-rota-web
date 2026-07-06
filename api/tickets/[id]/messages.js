import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);
  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      // In a real app we'd check auth here
      const { sender, text } = req.body;
      const now = new Date().toISOString();

      const newMessage = {
        sender: sender || 'admin',
        text,
        timestamp: now
      };

      // We append the new message to the existing JSONB array
      await sql`
        UPDATE tickets
        SET messages = messages || ${JSON.stringify(newMessage)}::jsonb, updated_at = ${now}
        WHERE id = ${id}
      `;

      return res.status(200).json({ success: true, data: newMessage });
    } catch (error) {
      console.error("POST Message Error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
