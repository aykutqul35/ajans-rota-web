import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sql = neon(process.env.DATABASE_URL);

async function initLeadsDb() {
  console.log('Connecting to Neon PostgreSQL to create leads table...');
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(255) PRIMARY KEY,
        full_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(255),
        company VARCHAR(255),
        service VARCHAR(255),
        message TEXT,
        traffic_source VARCHAR(255),
        status VARCHAR(50) DEFAULT 'unread',
        is_starred BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        simulator_data JSONB
      );
    `;
    console.log('Table "leads" successfully created or already exists!');
  } catch (error) {
    console.error('Error creating leads table:', error);
  }
}

initLeadsDb();
