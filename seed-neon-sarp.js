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

const b2bData = {
      username: "sarp",
      password: "sarp123",
      brandName: "Sarp Lojistik",
      industry: "B2B / Lojistik",
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
};

async function run() {
  console.log('Updating Sarp Lojistik with rich data...');
  b2bData._key = 'b2b';
  
  const existing = await sql`SELECT id FROM client_accounts WHERE username = 'sarp'`;
  if (existing.length > 0) {
    const clientId = existing[0].id;
    const currentReport = await sql`SELECT report_data FROM client_reports WHERE client_id = ${clientId}`;
    if (currentReport.length > 0 && currentReport[0].report_data) {
        const currentData = currentReport[0].report_data;
        b2bData.creatives = currentData.creatives || [];
        b2bData.files = currentData.files || [];
    }
    await sql`UPDATE client_reports SET report_data = ${JSON.stringify(b2bData)} WHERE client_id = ${clientId}`;
    console.log('Updated Sarp Lojistik!');
  } else {
    console.log('Sarp not found!');
  }
}
run();
