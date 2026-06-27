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
    const res = await sql`SELECT global_brand_data->>'fb_pixel_custom_script' as fb, global_brand_data->>'google_ads_event_script' as ga, global_brand_data->>'tiktok_pixel_custom_script' as tk, global_brand_data->>'google_site_verification' as gsv, global_brand_data->>'google_analytics_id' as ga_id FROM site_data LIMIT 1`;
    console.log("data:", res[0]);
  } catch (e) {
    console.error(e);
  }
}
check();
