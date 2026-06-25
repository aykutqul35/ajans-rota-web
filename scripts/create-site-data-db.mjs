import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

async function initDb() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS site_data (
        id VARCHAR(255) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Table 'site_data' created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
}
initDb();
