import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

async function initDb() {
  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log("Creating tables...");
    
    // Create client_accounts
    await sql`
      CREATE TABLE IF NOT EXISTS client_accounts (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        brand_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("Created client_accounts table.");

    // Create client_reports (JSONB storage for dynamic frontend schema)
    await sql`
      CREATE TABLE IF NOT EXISTS client_reports (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES client_accounts(id) ON DELETE CASCADE,
        report_data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("Created client_reports table.");

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

initDb();
