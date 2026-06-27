const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function run() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('urjxqkt2p', salt);
    
    await sql`UPDATE admin_users SET password_hash = ${hashedPassword} WHERE username = 'admin'`;
    console.log("Password updated successfully.");
  } catch (error) {
    console.error("Error updating password:", error);
  }
}

run();
