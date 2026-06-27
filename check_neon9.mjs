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
    const settings = res[0].data.settings;
    console.log("gtm_id:", settings.gtm_id);
    console.log("fb_pixel_custom_script:", settings.fb_pixel_custom_script);
    console.log("google_ads_event_script:", settings.google_ads_event_script);
    console.log("tiktok_pixel_custom_script:", settings.tiktok_pixel_custom_script);
  } catch (e) {
    console.error(e);
  }
}
check();
