import { neon } from '@neondatabase/serverless';

// Retrieve database URL from environment or arguments
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("HATA: DATABASE_URL çevre değişkeni bulunamadı.");
  console.error("Kullanım: DATABASE_URL='neon_url_buraya' node scripts/init-db.js");
  process.exit(1);
}

const sql = neon(connectionString);

async function initDB() {
  console.log("Veritabanı tabloları oluşturuluyor (Neon DB)...");

  try {
    // 1. Clients Table (Müşteriler)
    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id VARCHAR(255) PRIMARY KEY,
        brand_name VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        logo VARCHAR(500),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("✅ clients tablosu oluşturuldu/kontrol edildi.");

    // 2. Campaigns Table (Google & Meta Ads Data)
    await sql`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        client_id VARCHAR(255) REFERENCES clients(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL, -- 'google' or 'meta'
        campaign_name VARCHAR(255) NOT NULL,
        spend NUMERIC(10, 2) DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        ctr VARCHAR(50),
        conversions INTEGER DEFAULT 0,
        roas VARCHAR(50), -- or CPL
        cpc VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("✅ campaigns tablosu oluşturuldu/kontrol edildi.");

    // 3. AI Action Logs (Yapay Zeka Aksiyon Akışı)
    await sql`
      CREATE TABLE IF NOT EXISTS ai_logs (
        id SERIAL PRIMARY KEY,
        client_id VARCHAR(255) REFERENCES clients(id) ON DELETE CASCADE,
        action_type VARCHAR(100), -- e.g., 'budget_increase', 'pause_ad', 'target_change'
        description TEXT NOT NULL,
        platform VARCHAR(50), -- 'google', 'meta', 'system'
        action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("✅ ai_logs tablosu oluşturuldu/kontrol edildi.");

    // 4. Client Settings & Plans
    await sql`
      CREATE TABLE IF NOT EXISTS client_settings (
        client_id VARCHAR(255) PRIMARY KEY REFERENCES clients(id) ON DELETE CASCADE,
        ai_health_score INTEGER DEFAULT 100,
        next_month_plan JSONB,
        custom_kpis JSONB
      );
    `;
    console.log("✅ client_settings tablosu oluşturuldu/kontrol edildi.");

    console.log("🎉 Tüm veritabanı tabloları başarıyla hazırlandı!");

  } catch (error) {
    console.error("❌ Veritabanı oluşturulurken hata oluştu:", error);
  }
}

initDB();
