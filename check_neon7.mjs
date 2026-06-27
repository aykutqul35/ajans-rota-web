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
    console.log("gtm_id:", res[0].data.global_brand_data.gtm_id);
    console.log("fb_script:", res[0].data.global_brand_data.fb_pixel_custom_script);
    console.log("ga_script:", res[0].data.global_brand_data.google_ads_event_script);
    console.log("tk_script:", res[0].data.global_brand_data.tiktok_pixel_custom_script);
  } catch (e) {
    console.error(e);
  }
}
check();
