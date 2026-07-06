import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  // Auto-create table if not exists
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tickets (
        id VARCHAR(255) PRIMARY KEY,
        client_id VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Açık',
        messages JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
  } catch (err) {
    console.error("Table creation error:", err);
  }

  if (req.method === 'GET') {
    try {
      const { client_id } = req.query;
      let tickets;
      
      if (client_id) {
        tickets = await sql`SELECT * FROM tickets WHERE client_id = ${client_id} ORDER BY created_at DESC`;
      } else {
        // Admin gets all tickets
        tickets = await sql`SELECT * FROM tickets ORDER BY created_at DESC`;
      }
      
      return res.status(200).json({ success: true, data: tickets });
    } catch (error) {
      console.error("GET Tickets Error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }

  if (req.method === 'POST') {
    try {
      const { client_id, clerkId, subject, department, text } = req.body;
      const id = 't_' + Date.now();
      const clientIdToUse = client_id || clerkId || 'demo';
      const now = new Date().toISOString();
      const initialMessages = JSON.stringify([{
        sender: 'client',
        text: text,
        timestamp: now
      }]);

      await sql`
        INSERT INTO tickets (id, client_id, subject, department, text, messages, created_at, updated_at)
        VALUES (${id}, ${clientIdToUse}, ${subject}, ${department}, ${text}, ${initialMessages}::jsonb, ${now}, ${now})
      `;

      return res.status(201).json({ success: true, data: { id, client_id: clientIdToUse } });
    } catch (error) {
      console.error("POST Ticket Error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
