const fs = require('fs');
let code = fs.readFileSync('api/clients/index.js', 'utf8');

if (!code.includes("import jwt from 'jsonwebtoken';")) {
  code = code.replace("import bcrypt from 'bcryptjs';", "import bcrypt from 'bcryptjs';\nimport jwt from 'jsonwebtoken';");
}

const oldGet = `  if (req.method === 'GET') {
    try {
      // Get all clients with their reports
      const clients = await sql\`
        SELECT c.id, c.username, c.brand_name, r.report_data 
        FROM client_accounts c
        LEFT JOIN client_reports r ON c.id = r.client_id
      \`;
      
      return res.status(200).json({ success: true, data: clients });
    } catch (error) {
      console.error("GET Clients Error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }`;

const newGet = `  if (req.method === 'GET') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Yetkisiz erişim.' });
      }

      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ajansrota_fallback_secret');
        // İsteği yapan Admin olmalı (çünkü tüm müşterileri çekiyor)
        if (decoded.role === 'client') {
           return res.status(403).json({ success: false, message: 'Erişim reddedildi.' });
        }
      } catch (err) {
        return res.status(401).json({ success: false, message: 'Geçersiz token.' });
      }

      // Get all clients with their reports
      const clients = await sql\`
        SELECT c.id, c.username, c.brand_name, r.report_data 
        FROM client_accounts c
        LEFT JOIN client_reports r ON c.id = r.client_id
      \`;
      
      return res.status(200).json({ success: true, data: clients });
    } catch (error) {
      console.error("GET Clients Error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }`;

code = code.replace(oldGet, newGet);
fs.writeFileSync('api/clients/index.js', code);
console.log("Patched api/clients/index.js GET auth");
