import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password, token_login, token } = req.body;

  if (token_login && token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ajansrota_fallback_secret');
      if (decoded && decoded.clientId) {
        const sql = neon(process.env.DATABASE_URL);
        const clients = await sql`SELECT id, username, brand_name, report_data FROM client_accounts WHERE id = ${decoded.clientId}`;
        if (clients.length > 0) {
          const client = clients[0];
          return res.status(200).json({ 
            success: true, 
            data: {
              id: client.id,
              username: client.username,
              brand_name: client.brand_name,
              report_data: client.report_data
            }
          });
        }
      }
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Geçersiz token.' });
    }
  }

  if (!username || !password) {
    return res.status(400).json({ message: 'Kullanıcı adı ve şifre zorunludur.' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    const clients = await sql`SELECT id, username, password_hash, brand_name, report_data FROM client_accounts WHERE username = ${username}`;
    
    if (clients.length === 0) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
    }

    const client = clients[0];

    // Check if the password is plain text (legacy) or hashed
    let isPasswordValid = false;
    if (client.password_hash === password) {
       // Legacy plain text match
       isPasswordValid = true;
       // We should ideally upgrade it to hash here, but let's keep it simple
    } else {
       // Check bcrypt hash
       isPasswordValid = await bcrypt.compare(password, client.password_hash).catch(() => false);
    }
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
    }

    const token = jwt.sign(
      { clientId: client.id, username: client.username, role: 'client' }, 
      process.env.JWT_SECRET || 'ajansrota_fallback_secret', 
      { expiresIn: '24h' }
    );

    return res.status(200).json({ 
      success: true, 
      token,
      data: {
        id: client.id,
        username: client.username,
        brand_name: client.brand_name,
        report_data: client.report_data
      }
    });

  } catch (error) {
    console.error('Client Login Error:', error);
    return res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
}
