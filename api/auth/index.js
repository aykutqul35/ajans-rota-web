import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const action = req.query.action || req.body.action;

  if (action === 'login') {
    // Basic mock login kept intact as per previous login.js
    const { username, password } = req.body || {};
    if (username === 'admin' && password === '12345') {
      return res.status(200).json({
        success: true,
        token: 'admin-mock-token-12345',
        user: { username: 'admin' }
      });
    } else {
      return res.status(401).json({ success: false, message: 'Hatalı kullanıcı adı veya şifre' });
    }
  }

  if (action === 'change-password') {
    // Change password logic
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Yetkisiz erişim.' });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'ajansrota_fallback_secret');
    } catch (err) {
      return res.status(401).json({ message: 'Oturum süresi dolmuş veya geçersiz token.' });
    }

    const { oldPassword, newUsername, newPassword } = req.body;

    if (!oldPassword || (!newUsername && !newPassword)) {
      return res.status(400).json({ message: 'Lütfen mevcut şifrenizi ve değiştirmek istediğiniz yeni bilgileri girin.' });
    }

    try {
      const sql = neon(process.env.DATABASE_URL);
      const userId = decodedToken.userId;

      const users = await sql`SELECT * FROM admin_users WHERE id = ${userId}`;
      if (users.length === 0) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
      }

      const user = users[0];
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Mevcut şifreniz yanlış.' });
      }

      let updateQueries = [];
      const targetUsername = newUsername && newUsername.trim() !== '' ? newUsername.trim() : user.username;
      
      if (newPassword && newPassword.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        await sql`
          UPDATE admin_users 
          SET username = ${targetUsername}, password_hash = ${hashedPassword}
          WHERE id = ${userId}
        `;
      } else {
        await sql`
          UPDATE admin_users 
          SET username = ${targetUsername}
          WHERE id = ${userId}
        `;
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Hesap bilgileriniz başarıyla güncellendi!' 
      });

    } catch (error) {
      console.error('Change Password Error:', error);
      if (error.code === '23505') {
         return res.status(400).json({ message: 'Bu kullanıcı adı zaten kullanılıyor.' });
      }
      return res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
  }

  return res.status(404).json({ message: 'Not Found' });
}
