const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function run() {
  const sql = neon(process.env.DATABASE_URL);
  const users = await sql`SELECT * FROM admin_users`;
  for (const u of users) {
    const isMatch = await bcrypt.compare('urjxqkt2p', u.password_hash);
    console.log(`User ${u.username} match for 'urjxqkt2p':`, isMatch);
  }
}
run();
