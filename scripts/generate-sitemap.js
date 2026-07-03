import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialServicePagesData, initialBlogPosts, categories } from '../src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://ajansrota.com';
const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml');

// Helper to format Date for XML
const formatDate = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  if (dateString.includes('.')) {
    const parts = dateString.split('.');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateString;
};

const slugify = text => {
  if (!text) return "";
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[şŞ]/g, 's')
    .replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[çÇ]/g, 'c')
    .replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

const serviceSlugsInverse = {
  'google': 'google-ads-danismanligi',
  'meta': 'meta-reklam-yonetimi',
  'seo': 'arama-motoru-optimizasyonu-seo',
  'social': 'sosyal-medya-yonetimi',
  'ecommerce': 'e-ticaret-ve-pazaryeri-yonetimi',
  'design': 'donusum-odakli-web-tasarim'
};

const generateSitemap = () => {
  console.log('Generating sitemap...');
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  const staticRoutes = [
    { url: '/', priority: 1.0, changefreq: 'weekly' },
    { url: '/hakkimizda', priority: 0.8, changefreq: 'monthly' },
    { url: '/iletisim', priority: 0.8, changefreq: 'monthly' },
    { url: '/referanslar', priority: 0.8, changefreq: 'monthly' },
    { url: '/ekiplerimiz', priority: 0.8, changefreq: 'monthly' },
    { url: '/blog', priority: 0.9, changefreq: 'daily' },
    { url: '/seo-analizi', priority: 0.7, changefreq: 'monthly' },
    { url: '/kobi-endeksi', priority: 0.7, changefreq: 'monthly' },
    { url: '/kreatif-vitrin', priority: 0.7, changefreq: 'monthly' },
    { url: '/rakip-analizi', priority: 0.7, changefreq: 'monthly' }
  ];

  staticRoutes.forEach(route => {
    xml += `  <url>
    <loc>${DOMAIN}${route.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>\n`;
  });

  Object.keys(initialServicePagesData).forEach(key => {
    const slug = serviceSlugsInverse[key] || key;
    xml += `  <url>
    <loc>${DOMAIN}/hizmetlerimiz/${slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
  });

  initialBlogPosts.forEach(post => {
    xml += `  <url>
    <loc>${DOMAIN}/blog/${slugify(post.title)}</loc>
    <lastmod>${formatDate(post.date)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  });

  xml += `</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');
  console.log(`Sitemap generated successfully at ${SITEMAP_PATH}`);
};

generateSitemap();
