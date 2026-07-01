export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

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
