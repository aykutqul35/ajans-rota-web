import fs from 'fs';
import { locationData } from '../src/data/locationData.js';

const baseUrl = 'https://ajansrota.com';

const staticPages = [
  '',
  '/iletisim',
  '/hizmetler',
  '/hizmetler/google',
  '/hizmetler/meta',
  '/hizmetler/seo',
  '/hizmetler/web',
  '/hizmetler/social',
  '/hizmetler/kurumsal',
  '/neden-izmir',
  '/seo-analizi',
  '/kobi-endeksi',
  '/kreatif-vitrin',
  '/seffaf-panel',
  '/akademi',
  '/rakip-analizi',
  '/kullanim-kosullari',
  '/kvkk-aydinlatma-metni',
  '/cerez-politikasi'
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add static pages
staticPages.forEach(page => {
  xml += `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
});

// Add dynamic location pages
locationData.forEach(loc => {
  xml += `  <url>\n    <loc>${baseUrl}/dijital-ajans/${loc.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
});

xml += `</urlset>`;

fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
console.log('sitemap.xml generated successfully in public folder.');
