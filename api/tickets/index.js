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
    // Table likely already exists
  }

  // Helper: normalize DB rows to camelCase
  const normalize = (rows) => rows.map(t => ({
    id: t.id,
    clientId: t.client_id,
    subject: t.subject,
    department: t.department,
    text: t.text,
    status: t.status,
    messages: typeof t.messages === 'string' ? JSON.parse(t.messages) : (t.messages || []),
    createdAt: t.created_at,
    updatedAt: t.updated_at
  }));

  // ──────────────────────────────────────
  // GET: List tickets (optionally by client_id)
  // ──────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const { client_id } = req.query;
      let tickets;
      if (client_id) {
        tickets = await sql`SELECT * FROM tickets WHERE client_id = ${client_id} ORDER BY created_at DESC`;
      } else {
        tickets = await sql`SELECT * FROM tickets ORDER BY created_at DESC`;
      }
      return res.status(200).json({ success: true, data: normalize(tickets) });
    } catch (error) {
      console.error("GET Tickets Error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }

  // ──────────────────────────────────────
  // POST: Create ticket OR add message
  // Uses "action" query param to differentiate
  // POST /api/tickets              → create new ticket
  // POST /api/tickets?action=message&id=xxx  → add message
  // ──────────────────────────────────────
  if (req.method === 'POST') {
    const { action, id: ticketId } = req.query;

    // ── Add message to existing ticket ──
    if (action === 'message' && ticketId) {
      try {
        const { sender, text } = req.body;
        const now = new Date().toISOString();
        const newMessage = { sender: sender || 'admin', text, timestamp: now };

        await sql`
          UPDATE tickets
          SET messages = COALESCE(messages, '[]'::jsonb) || ${JSON.stringify([newMessage])}::jsonb,
              updated_at = ${now}
          WHERE id = ${ticketId}
        `;
        return res.status(200).json({ success: true, data: newMessage });
      } catch (error) {
        console.error("POST Message Error:", error);
        return res.status(500).json({ success: false, message: "Mesaj gönderilemedi" });
      }
    }

    // ── Create new ticket ──
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
      return res.status(500).json({ success: false, message: "Talep oluşturulamadı" });
    }
  }

  // ──────────────────────────────────────
  // PUT: Update ticket status
  // PUT /api/tickets?id=xxx
  // ──────────────────────────────────────
  if (req.method === 'PUT') {
    const { id: ticketId } = req.query;
    if (!ticketId) return res.status(400).json({ success: false, message: 'Ticket ID gerekli' });

    try {
      const { status } = req.body;
      const now = new Date().toISOString();

      await sql`
        UPDATE tickets
        SET status = ${status}, updated_at = ${now}
        WHERE id = ${ticketId}
      `;
      return res.status(200).json({ success: true, message: 'Durum güncellendi' });
    } catch (error) {
      console.error("PUT Status Error:", error);
      return res.status(500).json({ success: false, message: "Durum güncellenemedi" });
    }
  }

  // ──────────────────────────────────────
  // DELETE: Delete a ticket
  // DELETE /api/tickets?id=xxx
  // ──────────────────────────────────────
  if (req.method === 'DELETE') {
    const { id: ticketId } = req.query;
    if (!ticketId) return res.status(400).json({ success: false, message: 'Ticket ID gerekli' });

    try {
      await sql`DELETE FROM tickets WHERE id = ${ticketId}`;
      return res.status(200).json({ success: true, message: 'Talep silindi' });
    } catch (error) {
      console.error("DELETE Ticket Error:", error);
      return res.status(500).json({ success: false, message: "Talep silinemedi" });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
