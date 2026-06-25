import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const { action } = req.query;

  // Sadece save_lead ve get_leads desteklenir
  if (action === 'save_lead') {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
      const sql = neon(process.env.DATABASE_URL);
      const lead = req.body;

      // Eksik verileri doldur
      const id = lead.id || `req_${Date.now()}`;
      const fullName = lead.fullName || 'Belirtilmedi';
      const email = lead.email || '';
      const phone = lead.phone || '';
      const company = lead.company || '';
      const service = lead.service || '';
      const message = lead.message || '';
      const trafficSource = lead.trafficSource || 'Bilinmiyor';
      const status = lead.status || 'unread';
      const isStarred = lead.isStarred ? true : false;
      const createdAt = lead.date || new Date().toISOString();
      const simulatorData = lead.simulatorData ? JSON.stringify(lead.simulatorData) : null;

      await sql`
        INSERT INTO leads (id, full_name, email, phone, company, service, message, traffic_source, status, is_starred, created_at, simulator_data)
        VALUES (${id}, ${fullName}, ${email}, ${phone}, ${company}, ${service}, ${message}, ${trafficSource}, ${status}, ${isStarred}, ${createdAt}, ${simulatorData})
        ON CONFLICT (id) DO UPDATE 
        SET full_name = EXCLUDED.full_name,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            company = EXCLUDED.company,
            service = EXCLUDED.service,
            message = EXCLUDED.message,
            status = EXCLUDED.status,
            is_starred = EXCLUDED.is_starred
      `;

      return res.status(200).json({ success: true, message: 'Lead saved successfully' });
    } catch (error) {
      console.error('Error saving lead:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } 
  
  else if (action === 'get_leads') {
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
      const sql = neon(process.env.DATABASE_URL);
      const rows = await sql`
        SELECT * FROM leads ORDER BY created_at DESC
      `;
      
      // Map veritabanı yılan_case'den camelCase'e (Frontend'in beklediği yapı)
      const formattedLeads = rows.map(row => ({
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        company: row.company,
        service: row.service,
        message: row.message,
        trafficSource: row.traffic_source,
        status: row.status,
        isStarred: row.is_starred,
        date: row.created_at,
        simulatorData: row.simulator_data ? (typeof row.simulator_data === 'string' ? JSON.parse(row.simulator_data) : row.simulator_data) : null
      }));

      return res.status(200).json({ success: true, leads: formattedLeads });
    } catch (error) {
      console.error('Error fetching leads:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
  
  else if (action === 'save') {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
    try {
      const sql = neon(process.env.DATABASE_URL);
      const dataPayload = req.body; // should be the full JSON DB
      const id = 'main_db';
      await sql`
        INSERT INTO site_data (id, data, updated_at)
        VALUES (${id}, ${JSON.stringify(dataPayload)}::jsonb, NOW())
        ON CONFLICT (id) DO UPDATE 
        SET data = EXCLUDED.data, updated_at = NOW()
      `;
      return res.status(200).json({ success: true, message: 'Database saved to Neon DB successfully' });
    } catch (error) {
      console.error('Error saving db:', error);
      return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
    }
  }

  else if (action === 'get' || action === 'get_db') {
    try {
      const sql = neon(process.env.DATABASE_URL);
      const rows = await sql`SELECT data FROM site_data WHERE id = 'main_db' LIMIT 1`;
      if (rows.length > 0) {
        return res.status(200).json(rows[0].data); // return the JSON directly
      } else {
        return res.status(404).json({ success: false, message: 'No data found' });
      }
    } catch (error) {
      console.error('Error fetching db:', error);
      return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
    }
  }

  else if (action === 'delete_lead') {
     try {
        const sql = neon(process.env.DATABASE_URL);
        const { id } = req.body;
        if(!id) return res.status(400).json({ success: false, message: 'Missing ID' });
        await sql`DELETE FROM leads WHERE id = ${id}`;
        return res.status(200).json({ success: true, message: 'Lead deleted' });
     } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
     }
  }

  // Diğer tüm istekler için (şimdilik) boş cevap dönelim veya başarılı gibi yapalım.
  return res.status(200).json({ success: true, message: 'Action ignored in Vercel mode' });
}
