import sql from '../../lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { client_id, limit = 20 } = req.query;

    try {
      let logs;
      
      if (client_id) {
        // Belirli bir müşterinin AI loglarını getir
        logs = await sql`
          SELECT * FROM ai_logs 
          WHERE client_id = ${client_id}
          ORDER BY action_time DESC
          LIMIT ${Number(limit)}
        `;
      } else {
        // Tüm sistemdeki genel AI aksiyonlarını getir (Admin Panel için)
        logs = await sql`
          SELECT l.*, c.brand_name 
          FROM ai_logs l
          LEFT JOIN clients c ON l.client_id = c.id
          ORDER BY action_time DESC
          LIMIT ${Number(limit)}
        `;
      }
      
      res.status(200).json({ success: true, data: logs });
    } catch (error) {
      console.error('AI Logs API Error:', error);
      res.status(500).json({ success: false, error: 'Sunucu Hatası' });
    }
  } 
  else if (req.method === 'POST') {
    // Sadece iç sistemlerin veya AI Cron Job'larının buraya post atması gerekir
    const { client_id, action_type, description, platform } = req.body;
    
    if (!client_id || !description) {
      return res.status(400).json({ success: false, error: 'Eksik parametre' });
    }

    try {
      const newLog = await sql`
        INSERT INTO ai_logs (client_id, action_type, description, platform)
        VALUES (${client_id}, ${action_type || 'system'}, ${description}, ${platform || 'system'})
        RETURNING *
      `;
      
      res.status(201).json({ success: true, data: newLog[0] });
    } catch (error) {
      console.error('AI Logs API Post Error:', error);
      res.status(500).json({ success: false, error: 'Kayıt Hatası' });
    }
  } 
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
