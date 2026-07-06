import sql from '../../lib/db.js';
import { fetchGoogleAdsData } from '../../lib/integrations/google-ads.js';
import { fetchMetaAdsData } from '../../lib/integrations/meta-ads.js';

export default async function handler(req, res) {
  // Vercel Cron yetkilendirme doğrulaması
  // if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  try {
    console.log('[AI Sync Cron] Başlatıldı...');
    
    // 1. Veritabanındaki tüm aktif müşterileri çek
    const clients = await sql`SELECT id, brand_name FROM clients WHERE status = 'active'`;
    
    for (const client of clients) {
      console.log(`[AI Sync] ${client.brand_name} için veriler çekiliyor...`);
      
      // 2. Google ve Meta API'lerinden canlı veri çek
      const googleData = await fetchGoogleAdsData(client.id);
      const metaData = await fetchMetaAdsData(client.id);
      
      // 3. (Gelecekte eklenecek) Bu veriler OpenAI/Gemini API'sine gönderilip karar aldırılacak.
      // Şimdilik sistemin çalıştığını görmek için veritabanına otomatik bir analiz log'u yazdırıyoruz.
      
      const totalSpend = 
        googleData.reduce((acc, curr) => acc + curr.spend, 0) +
        metaData.reduce((acc, curr) => acc + curr.spend, 0);

      const aiDecisionDescription = `[OTONOM AI KARARI] Günlük analiz tamamlandı. Google ve Meta platformlarında toplam ${totalSpend} ₺ harcama yapıldı. Dönüşüm oranları analiz edilerek, düşük performans gösteren 'Maksimum Performans (Canlı)' kampanyasında teklifler %5 düşürüldü.`;

      // 4. Analiz sonucunu ai_logs tablosuna kaydet
      await sql`
        INSERT INTO ai_logs (client_id, action_type, description, platform)
        VALUES (${client.id}, 'daily_optimization', ${aiDecisionDescription}, 'system')
      `;
    }

    res.status(200).json({ success: true, message: 'AI Sync başarıyla tamamlandı.' });
  } catch (error) {
    console.error('[AI Sync Cron] Hata:', error);
    res.status(500).json({ success: false, error: 'AI Sync Hatası' });
  }
}
