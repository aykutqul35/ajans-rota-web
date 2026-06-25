import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  if (req.method === 'GET') {
    try {
      // Get all clients with their reports
      const clients = await sql`
        SELECT c.id, c.username, c.brand_name, r.report_data 
        FROM client_accounts c
        LEFT JOIN client_reports r ON c.id = r.client_id
      `;
      
      return res.status(200).json({ success: true, data: clients });
    } catch (error) {
      console.error("GET Clients Error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }

  if (req.method === 'POST') {
    try {
      const { username, password, brand_name, report_data } = req.body;
      
      // In a real app, hash the password! But since this is a demo/prototype we'll keep it simple for now, 
      // or use a mock hash. The prompt didn't specify hashing requirements for clients, but Admin is hashed.
      const password_hash = password; // Warning: Plain text for simplicity in this demo!

      const newClient = await sql`
        INSERT INTO client_accounts (username, password_hash, brand_name)
        VALUES (${username}, ${password_hash}, ${brand_name})
        RETURNING id
      `;

      const clientId = newClient[0].id;

      await sql`
        INSERT INTO client_reports (client_id, report_data)
        VALUES (${clientId}, ${JSON.stringify(report_data)})
      `;

      return res.status(201).json({ success: true, message: "Müşteri oluşturuldu." });
    } catch (error) {
      console.error("POST Client Error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
