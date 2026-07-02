import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();
const sql = neon(process.env.DATABASE_URL);
async function run() {
  const rows = await sql`SELECT data FROM site_data WHERE id = 'main_db' LIMIT 1`;
  console.log(JSON.stringify(rows[0].data, null, 2));
}
run();
