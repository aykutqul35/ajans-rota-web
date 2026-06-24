import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sql = neon(process.env.DATABASE_URL);

async function initDB() {
  console.log('Connecting to Neon PostgreSQL to initialize database...');
  try {
    // Create the admin_users table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Table admin_users checked/created successfully.');

    // Check if admin user already exists
    const users = await sql`SELECT * FROM admin_users WHERE username = 'admin'`;
    
    if (users.length === 0) {
      console.log('Admin user not found, inserting default admin user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await sql`
        INSERT INTO admin_users (username, password_hash)
        VALUES ('admin', ${hashedPassword})
      `;
      console.log('Default admin user (admin / admin123) inserted successfully.');
    } else {
      console.log('Admin user already exists in the database. No action needed.');
    }
    
    console.log('Database initialization completed.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDB();
