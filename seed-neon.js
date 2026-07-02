import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Simple dotenv parser
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

async function seed() {
  console.log('Seeding Neon database with clientReports...');
  
  // To avoid circular dependencies and complex imports, we define minimal default data here
  const ecommerceData = {
    username: "ege",
    password: "ege123",
    brandName: "Ege Naturel Zeytinyağları A.Ş.",
    industry: "E-Ticaret / Gıda",
    kpis: [],
    googleAds: [],
    metaAds: [],
    seo: [],
    timeline: [],
    creatives: [],
    files: []
  };

  const b2bData = {
    username: "sarp",
    password: "sarp123",
    brandName: "Sarp Lojistik",
    industry: "B2B / Lojistik",
    kpis: [],
    googleAds: [],
    metaAds: [],
    seo: [],
    timeline: [],
    creatives: [],
    files: []
  };

  const insertClient = async (data, keyName) => {
    // Check if exists
    const existing = await sql`SELECT id FROM client_accounts WHERE username = ${data.username}`;
    if (existing.length === 0) {
      console.log(`Inserting ${data.username}...`);
      const res = await sql`
        INSERT INTO client_accounts (username, password_hash, brand_name)
        VALUES (${data.username}, ${data.password}, ${data.brandName})
        RETURNING id
      `;
      const clientId = res[0].id;
      // Also add keyName (ecommerce/b2b) to report_data for easier frontend mapping
      data._key = keyName; 
      await sql`
        INSERT INTO client_reports (client_id, report_data)
        VALUES (${clientId}, ${JSON.stringify(data)})
      `;
    } else {
      console.log(`Client ${data.username} already exists. Skipping.`);
      // Optional: Update report_data to ensure _key is set
      const clientId = existing[0].id;
      data._key = keyName; 
      await sql`
        UPDATE client_reports SET report_data = ${JSON.stringify(data)} WHERE client_id = ${clientId}
      `;
    }
  };

  await insertClient(ecommerceData, 'ecommerce');
  await insertClient(b2bData, 'b2b');

  console.log('Seeding completed.');
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
