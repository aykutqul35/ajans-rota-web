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

const fullData = {
  ecommerce: {
      username: "ege",
      password: "ege123",
      brandName: "Ege Naturel Zeytinyağları A.Ş.",
      industry: "E-Ticaret / Gıda",
      kpis: [{
        label: "Harcanan Bütçe",
        value: "48.240 TL",
        change: "+12% geçen ay",
        icon: "fa-solid fa-wallet",
        color: "var(--primary)"
      }, {
        label: "Toplam Satış (Adet)",
        value: "984 Adet",
        change: "+18% geçen ay",
        icon: "fa-solid fa-cart-shopping",
        color: "var(--secondary)"
      }, {
        label: "ROAS (Ciro / Reklam)",
        value: "6,92x",
        change: "Hedef: 6,00x",
        icon: "fa-solid fa-arrow-trend-up",
        color: "#16a34a"
      }, {
        label: "Toplam Elde Edilen Ciro",
        value: "333.820 TL",
        change: "+24% geçen ay",
        icon: "fa-solid fa-turkish-lira-sign",
        color: "var(--primary)"
      }],
      googleAds: [{
        name: "PMax - Soğuk Sıkım Dönüşüm",
        spend: "14.250 TL",
        clicks: "4.820",
        ctr: "3,15%",
        conversions: "312",
        roas: "7,8x"
      }, {
        name: "Search - Marka Kelimeleri",
        spend: "3.100 TL",
        clicks: "1.240",
        ctr: "15,40%",
        conversions: "145",
        roas: "12,4x"
      }, {
        name: "Search - Sızma Zeytinyağı",
        spend: "8.650 TL",
        clicks: "2.150",
        ctr: "4,80%",
        conversions: "114",
        roas: "4,6x"
      }],
      metaAds: [{
        name: "Katalog Satış - DPA",
        spend: "12.800 TL",
        clicks: "5.120",
        ctr: "2,10%",
        conversions: "264",
        roas: "7,2x",
        status: "Aktif"
      }, {
        name: "Video - Urla Hasat Kreatif",
        spend: "6.400 TL",
        clicks: "2.880",
        ctr: "1,85%",
        conversions: "102",
        roas: "5,8x",
        status: "Aktif"
      }, {
        name: "Görsel - Sağlık & Gurme Setleri",
        spend: "3.040 TL",
        clicks: "1.120",
        ctr: "1,45%",
        conversions: "47",
        roas: "4,1x",
        status: "Duraklatıldı"
      }],
      seo: [{
        keyword: "soğuk sıkım zeytinyağı",
        rank: "1. Sıra",
        volume: "8.100",
        monthlyClicks: "2.450",
        trend: "up"
      }, {
        keyword: "organik sızma zeytinyağı",
        rank: "2. Sıra",
        volume: "4.400",
        monthlyClicks: "980",
        trend: "stable"
      }, {
        keyword: "ege naturel zeytinyağı",
        rank: "1. Sıra",
        volume: "1.200",
        monthlyClicks: "740",
        trend: "stable"
      }, {
        keyword: "taş baskı zeytinyağı satın al",
        rank: "3. Sıra",
        volume: "2.900",
        monthlyClicks: "410",
        trend: "up"
      }],
      timeline: [{
        date: "21 Haziran 2026",
        title: "Google Search Negatif Kelime Temizliği",
        desc: "\"ucuz zeytinyağı\", \"ücretsiz yağ\" gibi marka kalitesine uymayan 112 adet negatif kelime elendi. Bütçe verimliliği %9 artırıldı.",
        author: "Yiğit K. (SEO & Google Ads)"
      }, {
        date: "18 Haziran 2026",
        title: "Meta Ads Urla Hasat Video Kreatif Testi",
        desc: "Urla bahçelerindeki hasat sürecini anlatan 2 yeni Reels dikey videosu yayına alındı. CTR ortalaması %1,2'den %1,85'e fırladı.",
        author: "Melis S. (Kreatif Direktör)"
      }, {
        date: "15 Haziran 2026",
        title: "Checkout Funnel Hız Optimizasyonu",
        desc: "E-ticaret sitesinde ödeme adımındaki görseller sıkıştırıldı, gereksiz JS kütüphaneleri ertelendi. Sepetten dönme oranı %4 düşürüldü.",
        author: "Emre T. (Web Developer)"
      }, {
        date: "12 Haziran 2026",
        title: "Haftalık Durum & ROAS Optimizasyon Toplantısı",
        desc: "Müşteri yönetim ekibiyle ROAS hedeflerinin 6,9x düzeyine ulaşması değerlendirildi. Gelecek haftanın bütçe dağılımı onaylandı.",
        author: "Selin Y. (Müşteri İlişkileri)"
      }, {
        date: "08 Haziran 2026",
        title: "Google PMax Kampanyasında Bütçe Ölçekleme",
        desc: "Performansı yüksek seyreden Soğuk Sıkım PMax kampanyasının bütçesi ROI korunarak %15 oranında kontrollü şekilde artırıldı.",
        author: "Yiğit K. (SEO & Google Ads)"
      }],
      creatives: [],
      files: []
  },
  b2b: {
      username: "liman",
      password: "liman123",
      brandName: "İzmir Global Liman Hizmetleri A.Ş.",
      industry: "B2B / Lojistik & Gümrükleme",
      kpis: [{
        label: "Harcanan Bütçe",
        value: "31.500 TL",
        change: "+5% geçen ay",
        icon: "fa-solid fa-wallet",
        color: "var(--primary)"
      }, {
        label: "Nitelikli Form (Lead)",
        value: "192 Form",
        change: "+22% geçen ay",
        icon: "fa-solid fa-id-card",
        color: "var(--secondary)"
      }, {
        label: "Form Başı Maliyet (CPL)",
        value: "164,06 TL",
        change: "-14% geçen ay",
        icon: "fa-solid fa-tags",
        color: "#16a34a"
      }, {
        label: "Tahmini Fırsat Değeri",
        value: "850.000 TL",
        change: "Dönüşüm Oranı: %12",
        icon: "fa-solid fa-turkish-lira-sign",
        color: "var(--primary)"
      }],
      googleAds: [{
        name: "Search - Liman Depolama",
        spend: "12.800 TL",
        clicks: "1.150",
        ctr: "8,90%",
        conversions: "78",
        roas: "164 TL CPL"
      }, {
        name: "Search - Gümrükleme Hizmetleri",
        spend: "11.200 TL",
        clicks: "940",
        ctr: "7,45%",
        conversions: "65",
        roas: "172 TL CPL"
      }, {
        name: "Display - Yeniden Pazarlama",
        spend: "2.100 TL",
        clicks: "410",
        ctr: "1,15%",
        conversions: "14",
        roas: "150 TL CPL"
      }],
      metaAds: [{
        name: "Lead Form - İthalatçılara Özel",
        spend: "3.400 TL",
        clicks: "480",
        ctr: "1,55%",
        conversions: "21",
        roas: "161 TL CPL",
        status: "Aktif"
      }, {
        name: "Görsel - Antrepo & Depolama",
        spend: "2.000 TL",
        clicks: "290",
        ctr: "1,20%",
        conversions: "14",
        roas: "142 TL CPL",
        status: "Duraklatıldı"
      }],
      seo: [{
        keyword: "izmir antrepo depolama",
        rank: "2. Sıra",
        volume: "1.800",
        monthlyClicks: "380",
        trend: "up"
      }, {
        keyword: "izmir liman gümrükleme firmaları",
        rank: "1. Sıra",
        volume: "850",
        monthlyClicks: "290",
        trend: "stable"
      }, {
        keyword: "uluslararası konteyner nakliye",
        rank: "4. Sıra",
        volume: "3.200",
        monthlyClicks: "170",
        trend: "up"
      }, {
        keyword: "liman lojistik çözümleri",
        rank: "3. Sıra",
        volume: "600",
        monthlyClicks: "110",
        trend: "stable"
      }],
      timeline: [{
        date: "20 Haziran 2026",
        title: "B2B Google Ads Arama Terimleri Filtrelemesi",
        desc: "Bireysel nakliye arayan \"evden eve nakliyat\" gibi 89 adet ilgisiz arama terimi elendi. Kurumsal leads kalitesi %30 artırıldı.",
        author: "Yiğit K. (SEO & Google Ads)"
      }, {
        date: "16 Haziran 2026",
        title: "LinkedIn & Meta Lead Form Optimizasyonu",
        desc: "Form alanlarına \"Şirket Unvanı\" ve \"Yıllık Konteyner Hacmi\" soruları zorunlu olarak eklendi. Çöp form girdileri sıfırlandı.",
        author: "Melis S. (Kreatif Direktör)"
      }, {
        date: "11 Haziran 2026",
        title: "Liman Depolama Görsel Testleri",
        desc: "Depoların güvenliğini ve büyüklüğünü gösteren yüksek kaliteli drone fotoğrafları reklam görselleriyle değiştirildi. CPL %15 düştü.",
        author: "Melis S. (Kreatif Direktör)"
      }, {
        date: "06 Haziran 2026",
        title: "SEO: İçerik Optimizasyon Çalışması",
        desc: "\"İzmir Liman Lojistik Süreçleri\" rehber makalesi blogda yayınlandı ve hedeflenen 3 anahtar kelimede anında sıralama kazanıldı.",
        author: "Yiğit K. (SEO & Google Ads)"
      }],
      creatives: [],
      files: []
  }
};

async function run() {
  console.log('Running full Neon DB seed...');
  for (const [key, data] of Object.entries(fullData)) {
    data._key = key;
    
    // Check if client exists
    const existing = await sql`SELECT id FROM client_accounts WHERE username = ${data.username}`;
    if (existing.length > 0) {
      const clientId = existing[0].id;
      
      // Keep existing creatives/files if any
      const currentReport = await sql`SELECT report_data FROM client_reports WHERE client_id = ${clientId}`;
      if (currentReport.length > 0 && currentReport[0].report_data) {
          const currentData = currentReport[0].report_data;
          data.creatives = currentData.creatives || [];
          data.files = currentData.files || [];
      }
      
      await sql`UPDATE client_reports SET report_data = ${JSON.stringify(data)} WHERE client_id = ${clientId}`;
      console.log('Updated', key, 'with rich mock data.');
    }
  }
  console.log('Done!');
}
run();
