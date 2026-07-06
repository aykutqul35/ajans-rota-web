import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const sql = neon(process.env.DATABASE_URL);
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Ticket ID gerekli' });
  }

  try {
    const { sender, text } = req.body;
    const now = new Date().toISOString();

    const newMessage = {
      sender: sender || 'admin',
      text,
      timestamp: now
    };

    // Append new message to JSONB array using || with array wrapper
    await sql`
      UPDATE tickets
      SET messages = COALESCE(messages, '[]'::jsonb) || ${JSON.stringify([newMessage])}::jsonb,
          updated_at = ${now}
      WHERE id = ${id}
    `;

    return res.status(200).json({ success: true, data: newMessage });
  } catch (error) {
    console.error("POST Message Error:", error);
    return res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
}
