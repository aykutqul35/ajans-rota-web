import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const SITEMAP_PATH = path.resolve(DIST_DIR, 'sitemap.xml');
const PORT = 5174;
const BASE_URL = `http://localhost:${PORT}`;

async function startServer() {
  const app = express();
  
  app.use(express.static(DIST_DIR));
  const indexHtml = fs.readFileSync(path.resolve(DIST_DIR, 'index.html'), 'utf8');
  app.use((req, res) => {
    res.send(indexHtml);
  });

  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      resolve(server);
    });
  });
}

function parseSitemapUrls() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error('sitemap.xml not found in dist. Ensure build script generated it.');
    process.exit(1);
  }
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const locRegex = /<loc>(.*?)<\/loc>/g;
  const urls = [];
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    const url = match[1];
    const localUrl = url.replace('https://ajansrota.com', BASE_URL);
    urls.push({ original: url, local: localUrl });
  }
  return urls;
}

async function prerender() {
  console.log('Starting prerender process...');
  const server = await startServer();
  console.log(`Local static server running on ${BASE_URL}`);

  const urls = parseSitemapUrls();
  console.log(`Found ${urls.length} URLs in sitemap.xml to prerender.`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });
  } catch (error) {
    console.warn('⚠️ WARNING: Puppeteer failed to launch in this environment. Skipping prerender.');
    console.warn('Error details:', error.message);
    server.close();
    return; // gracefully exit without failing the build
  }
  
  const page = await browser.newPage();
  
  // Abort network requests that don't affect HTML output (CSS, images) to speed up SSR
  // But for accurate SEO prerendering, styles might be needed if they are CSS-in-JS.
  // Tailwind works via CSS files, so it's safe to block them for speed, but letting them load ensures 100% correct DOM if JS depends on dimensions.
  // Let's just let it load everything to be completely safe, but maybe block images/media.
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const resourceType = req.resourceType();
    if (['image', 'media', 'font'].includes(resourceType)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  for (const { original, local } of urls) {
    if (local === BASE_URL || local === `${BASE_URL}/`) {
      continue;
    }
    
    console.log(`Prerendering: ${original}`);
    try {
      await page.goto(local, { waitUntil: 'networkidle0', timeout: 30000 });
      await new Promise(r => setTimeout(r, 500)); // allow React to hydrate fully
      
      const html = await page.evaluate(() => document.documentElement.outerHTML);
      const doctypeHtml = `<!DOCTYPE html>\n<html lang="tr">\n${html}`;

      const urlPath = new URL(local).pathname;
      const saveDir = path.join(DIST_DIR, urlPath);
      const savePath = path.join(saveDir, 'index.html');

      if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true });
      }

      fs.writeFileSync(savePath, doctypeHtml, 'utf8');
    } catch (err) {
      console.error(`Failed to prerender ${original}:`, err.message);
    }
  }

  console.log('Prerendering completed successfully.');
  await browser.close();
  server.close();
}

prerender().catch(err => {
  console.error('Fatal error during prerender:', err);
  process.exit(1);
});
