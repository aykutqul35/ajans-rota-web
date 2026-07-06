import sql from '../../lib/db.js';

export default async function handler(req, res) {
  // Sadece yetkili erişime izin ver (Şimdilik basit bir kontrol)
  // İleride JWT eklenebilir.

  if (req.method === 'GET') {
    try {
      // Tüm müşterileri ve ilgili ayarlarını çek
      const clients = await sql`
        SELECT 
          c.id, c.brand_name, c.name, c.logo, c.status,
          s.ai_health_score, s.next_month_plan, s.custom_kpis
        FROM clients c
        LEFT JOIN client_settings s ON c.id = s.client_id
        WHERE c.status = 'active'
        ORDER BY c.created_at DESC
      `;
      
      // Her müşteri için kampanyaları (Google & Meta) da çekebiliriz,
      // ancak şimdilik temel bilgileri dönelim, kampanyalar ayrı bir route'dan veya join ile gelebilir.
      
      res.status(200).json({ success: true, data: clients });
    } catch (error) {
      console.error('Clients API Error:', error);
      res.status(500).json({ success: false, error: 'Sunucu Hatası' });
    }
  } 
  else if (req.method === 'POST') {
    const { id, brand_name, name, logo } = req.body;
    
    if (!id || !brand_name || !name) {
      return res.status(400).json({ success: false, error: 'Eksik parametre' });
    }

    try {
      // 1. Müşteriyi oluştur
      const newClient = await sql`
        INSERT INTO clients (id, brand_name, name, logo)
        VALUES (${id}, ${brand_name}, ${name}, ${logo || null})
        RETURNING *
      `;
      
      // 2. Varsayılan ayarları oluştur
      await sql`
        INSERT INTO client_settings (client_id, ai_health_score, next_month_plan, custom_kpis)
        VALUES (${id}, 100, '[]'::jsonb, '[]'::jsonb)
      `;

      res.status(201).json({ success: true, data: newClient[0] });
    } catch (error) {
      console.error('Clients API Post Error:', error);
      res.status(500).json({ success: false, error: 'Kayıt Hatası' });
    }
  } 
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
