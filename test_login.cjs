const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function run() {
  const sql = neon(process.env.DATABASE_URL);
  const users = await sql`SELECT * FROM admin_users WHERE username = 'admin'`;
  const user = users[0];
  const isPasswordValid = await bcrypt.compare('urjxqkt2p', user.password_hash);
  console.log("Is password valid?", isPasswordValid);
}
run();
