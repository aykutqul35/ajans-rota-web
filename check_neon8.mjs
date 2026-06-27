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
    const res = await sql`SELECT data FROM site_data LIMIT 1`;
    console.log(Object.keys(res[0].data));
    if (res[0].data.globalBrandData) {
      console.log("globalBrandData Keys:", Object.keys(res[0].data.globalBrandData));
      console.log("gtm_id:", res[0].data.globalBrandData.gtm_id);
    }
    // maybe camelCase?
  } catch (e) {
    console.error(e);
  }
}
check();
