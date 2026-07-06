import { neon } from '@neondatabase/serverless';

async function seedAiLogs() {
  const sql = neon('postgresql://neondb_owner:npg_9MIs2CtHAWgr@ep-mute-morning-asy8xttd-pooler.c-4.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
  
  try {
    const clients = await sql`SELECT id FROM clients LIMIT 1`;
    if (clients.length === 0) {
      console.log('No clients found. Assuming test client for demo.');
    }
    const clientId = clients.length > 0 ? clients[0].id : null;

    await sql`DELETE FROM ai_logs`;

    const logs = [
      {
        client_id: clientId,
        platform: 'google',
        action_type: 'budget_increase',
        description: 'Maksimum Performans (PMax) kampanyası hedefin %12 üzerinde ROAS getirdiği için günlük bütçe %20 artırıldı.',
        details: JSON.stringify({
          campaign_name: "PMax - Tüm Ürünler - TR",
          metric_focus: "ROAS (Hedef: %350, Gerçekleşen: %410)",
          old_value: "5.000 ₺ / gün",
          new_value: "6.000 ₺ / gün",
          status: "OTONOM UYGULANDI"
        })
      },
      {
        client_id: clientId,
        platform: 'meta',
        action_type: 'campaign_paused',
        description: 'Yeniden Pazarlama kampanyasında maliyet/dönüşüm (CAC) sınırı aşıldığı için kampanya durduruldu. Yeni kreatife ihtiyaç var.',
        details: JSON.stringify({
          campaign_name: "Retargeting - Sepeti Terk Edenler",
          metric_focus: "CAC (Sınır: 150 ₺, Gerçekleşen: 215 ₺)",
          old_value: "Aktif",
          new_value: "Durduruldu",
          status: "ONAY BEKLİYOR"
        })
      },
      {
        client_id: clientId,
        platform: 'google',
        action_type: 'new_campaign_suggestion',
        description: 'Arama Ağı: Son 7 günde "yapay zeka danışmanlık" kelimesinde %45 arama hacmi artışı tespit edildi. Yeni bir arama ağı kampanyası açılması öneriliyor.',
        details: JSON.stringify({
          campaign_name: "Search - AI Danışmanlık (Öneri)",
          metric_focus: "Arama Hacmi Trendi (Yükseliş: %45)",
          old_value: "Yok",
          new_value: "Taslak Oluşturuldu",
          status: "ONAY BEKLİYOR"
        })
      }
    ];

    for (const log of logs) {
      if (log.client_id) {
        await sql`INSERT INTO ai_logs (client_id, platform, action_type, description, details) VALUES (${log.client_id}, ${log.platform}, ${log.action_type}, ${log.description}, ${log.details})`;
      } else {
        await sql`INSERT INTO ai_logs (platform, action_type, description, details) VALUES (${log.platform}, ${log.action_type}, ${log.description}, ${log.details})`;
      }
    }
    
    console.log("✅ Mock AI logs with details seeded successfully!");
  } catch (error) {
    console.error('Error seeding AI logs:', error);
  }
}
seedAiLogs();
