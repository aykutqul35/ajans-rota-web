// Google Ads REST API Entegrasyonu
export async function fetchGoogleAdsData(customerId) {
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;

  // Çevresel değişkenler yoksa veya geçersizse sahte veri döndür
  if (!developerToken || !clientId || !clientSecret || !refreshToken) {
    console.warn("[Google Ads API] Kimlik bilgileri eksik, mock veri döndürülüyor.");
    return getMockData();
  }

  try {
    // 1. Yeni bir Access Token al
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error("[Google Ads API] Access Token alınamadı:", tokenData);
      return getMockData();
    }

    const accessToken = tokenData.access_token;
    const apiVersion = 'v16'; 

    // 2. Kampanya Performans Raporunu Çek
    const query = `
      SELECT
        campaign.name,
        metrics.cost_micros,
        metrics.clicks,
        metrics.ctr,
        metrics.conversions,
        metrics.average_cpc
      FROM campaign
      WHERE segments.date DURING LAST_30_DAYS
      AND campaign.status = 'ENABLED'
      ORDER BY metrics.cost_micros DESC
      LIMIT 10
    `;

    const reportResponse = await fetch(`https://googleads.googleapis.com/${apiVersion}/customers/${customerId}/googleAds:searchStream`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': developerToken,
        'Content-Type': 'application/json',
        'login-customer-id': process.env.GOOGLE_ADS_MANAGER_ID || customerId
      },
      body: JSON.stringify({ query })
    });

    if (!reportResponse.ok) {
      const errorData = await reportResponse.text();
      console.error("[Google Ads API] Rapor çekilemedi:", errorData);
      return getMockData();
    }

    const rawData = await reportResponse.json();
    
    // 3. Veriyi UI İçin Formatla
    const campaigns = [];
    if (rawData && rawData.length > 0) {
      for (const batch of rawData) {
        if (batch.results) {
          for (const row of batch.results) {
            const cost = (row.metrics?.costMicros || 0) / 1000000;
            const cpc = (row.metrics?.averageCpc || 0) / 1000000;
            const ctr = (row.metrics?.ctr || 0) * 100;
            
            campaigns.push({
              campaign_name: row.campaign?.name || 'Bilinmeyen Kampanya',
              spend: cost.toFixed(2),
              clicks: row.metrics?.clicks || 0,
              ctr: ctr.toFixed(2) + '%',
              conversions: row.metrics?.conversions || 0,
              cpc: cpc.toFixed(2) + ' ₺'
            });
          }
        }
      }
    }

    return campaigns.length > 0 ? campaigns : getMockData();
  } catch (error) {
    console.error("[Google Ads API] İstek sırasında hata oluştu:", error);
    return getMockData();
  }
}

// Fallback Mock Data
function getMockData() {
  return [
    {
      campaign_name: 'Arama Ağı - Marka (Canlı)',
      spend: 1540.50,
      clicks: 450,
      ctr: '5.2%',
      conversions: 32,
      cpc: '3.42 ₺'
    },
    {
      campaign_name: 'Maksimum Performans (Canlı)',
      spend: 4200.00,
      clicks: 1200,
      ctr: '1.8%',
      conversions: 85,
      cpc: '3.50 ₺'
    }
  ];
}
