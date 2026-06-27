const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const res = await pool.query('SELECT custom_head_code, custom_body_code FROM site_settings LIMIT 1');
    console.log("Settings:", res.rows[0]);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
check();
