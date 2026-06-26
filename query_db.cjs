const { neon } = require('@neondatabase/serverless');

async function run() {
  const sql = neon("postgresql://neondb_owner:npg_9MIs2CtHAWgr@ep-mute-morning-asy8xttd-pooler.c-4.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
  try {
     const users = await sql(`SELECT id, username FROM admin_users`);
     console.log("Admin users:", users);
     
     const clients = await sql(`SELECT id, username, brand_name, password_hash FROM client_accounts`);
     console.log("Client users:", clients);
  } catch(e) {
     console.error(e);
  }
}
run();
