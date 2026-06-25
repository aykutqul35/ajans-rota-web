import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const { client_id, report_data } = req.body;

    if (!client_id || !report_data) {
      return res.status(400).json({ success: false, message: 'Eksik veri' });
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
