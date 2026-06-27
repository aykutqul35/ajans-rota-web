import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2].replace(/^"(.*)"$/, '$1');
    }
  });
}

const sql = neon(process.env.DATABASE_URL);

async function check() {
  try {
    const res = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log("Tables:", res);
    
    // Also let's try site_settings
    const res2 = await sql`SELECT custom_head_code, custom_body_code FROM site_settings LIMIT 1`;
    console.log("Settings:", res2);
  } catch (e) {
    console.error(e);
  }
}
check();
