import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Yetkisiz erişim.' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'ajansrota_fallback_secret');
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Geçersiz token.' });
    }

    const sql = neon(process.env.DATABASE_URL);
    const { client_id, report_data } = req.body;

    if (!client_id || !report_data) {
      return res.status(400).json({ success: false, message: 'Eksik veri' });
    }

    // Yetki kontrolü: Admin her şeyi silebilir, müşteri sadece KENDİ ID'sini
    if (decoded.role === 'client' && decoded.clientId !== client_id) {
       return res.status(403).json({ success: false, message: 'Erişim reddedildi. Başka müşterinin verisini değiştiremezsiniz.' });
    }

    await sql`
      UPDATE client_reports 
      SET report_data = ${JSON.stringify(report_data)}, updated_at = CURRENT_TIMESTAMP
      WHERE client_id = ${client_id}
    `;

    return res.status(200).json({ success: true, message: 'Rapor güncellendi' });
  } catch (error) {
    console.error("PUT Client Error:", error);
    return res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
}
