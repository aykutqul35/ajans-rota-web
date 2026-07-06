import { neon } from '@neondatabase/serverless';

async function migrate() {
  const sql = neon('postgresql://neondb_owner:npg_9MIs2CtHAWgr@ep-mute-morning-asy8xttd-pooler.c-4.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
  
  try {
    await sql`ALTER TABLE ai_logs ADD COLUMN IF NOT EXISTS details JSONB;`;
    console.log("Column 'details' added successfully.");
  } catch(e) {
    console.error(e);
  }
}
migrate();
