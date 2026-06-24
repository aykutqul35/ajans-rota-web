import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Sadece POST isteklerine izin ver
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Kullanıcı adı ve şifre zorunludur.' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Veritabanından kullanıcıyı bul
    const users = await sql`SELECT * FROM admin_users WHERE username = ${username}`;
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
    }

    const user = users[0];

    // Şifreyi doğrula
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
    }

    // Başarılı giriş - Token oluştur (basit JWT)
    const token = jwt.sign(
      { userId: user.id, username: user.username }, 
      process.env.JWT_SECRET || 'ajansrota_fallback_secret', 
      { expiresIn: '24h' }
    );

    return res.status(200).json({ 
      success: true, 
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
}
