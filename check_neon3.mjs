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
    const res = await sql`SELECT global_settings FROM site_data LIMIT 1`;
    console.log("global_settings:", res[0].global_settings);
  } catch (e) {
    console.error(e);
  }
}
check();
