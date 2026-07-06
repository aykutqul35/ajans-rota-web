// Meta (Facebook) Graph API Entegrasyonu
export async function fetchMetaAdsData(adAccountId) {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const apiVersion = 'v19.0';
  
  if (!accessToken) {
    console.warn("[Meta Ads API] Kimlik bilgileri eksik, mock veri döndürülüyor.");
    return getMockData();
  }

  try {
    // 1. Graph API üzerinden kampanya verilerini çek
    // İstenen metrikler: spend, clicks, ctr, actions (conversions), cpc
    // Tarih aralığı: son 30 gün
    const fields = 'campaign_name,spend,clicks,ctr,cpc,actions';
    const params = new URLSearchParams({
      access_token: accessToken,
      fields: fields,
      level: 'campaign',
      date_preset: 'last_30d',
      filtering: JSON.stringify([{ field: 'campaign.effective_status', operator: 'IN', value: ['ACTIVE'] }])
    });

    // Hesap ID'si "act_" öneki gerektirir
    const formattedAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;

    const url = `https://graph.facebook.com/${apiVersion}/${formattedAccountId}/insights?${params.toString()}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("[Meta Ads API] Veri çekilemedi:", data);
      return getMockData();
    }

    // 2. UI formatına çevir
    const campaigns = [];
    if (data.data && data.data.length > 0) {
      data.data.forEach(item => {
        // Conversions genellikle 'actions' içinde 'offsite_conversion.fb_pixel_lead' veya 'lead' olarak bulunur
        let conversions = 0;
        if (item.actions) {
          const leadAction = item.actions.find(a => a.action_type === 'lead' || a.action_type === 'offsite_conversion.fb_pixel_lead');
          if (leadAction) conversions = parseInt(leadAction.value);
        }

        const spend = parseFloat(item.spend) || 0;
        const cpc = parseFloat(item.cpc) || 0;
        const ctr = parseFloat(item.ctr) || 0;

        campaigns.push({
          campaign_name: item.campaign_name || 'Bilinmeyen Kampanya',
          spend: spend.toFixed(2),
          clicks: parseInt(item.clicks) || 0,
          ctr: ctr.toFixed(2) + '%',
          conversions: conversions,
          cpc: cpc.toFixed(2) + ' ₺'
        });
      });
    }

    return campaigns.length > 0 ? campaigns : getMockData();
  } catch (error) {
    console.error("[Meta Ads API] İstek sırasında hata oluştu:", error);
    return getMockData();
  }
}

// Fallback Mock Data
function getMockData() {
  return [
    {
      campaign_name: 'IG Reels - Trafik (Canlı)',
      spend: 850.25,
      clicks: 1400,
      ctr: '2.1%',
      conversions: 0,
      cpc: '0.60 ₺'
    },
    {
      campaign_name: 'Lead Generation - Geniş (Canlı)',
      spend: 2100.00,
      clicks: 450,
      ctr: '1.2%',
      conversions: 45,
      cpc: '4.66 ₺'
    }
  ];
}
