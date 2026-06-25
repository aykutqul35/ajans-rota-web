import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const sql = neon(process.env.DATABASE_URL);
  const dataPayload = { test: 123 };
  const id = 'main_db';
  try {
    await sql`
      INSERT INTO site_data (id, data, updated_at)
      VALUES (${id}, ${JSON.stringify(dataPayload)}::jsonb, NOW())
      ON CONFLICT (id) DO UPDATE 
      SET data = EXCLUDED.data, updated_at = NOW()
    `;
    console.log("Success!");
  } catch (err) {
    console.error("Failed:", err.message);
  }
}
test();
