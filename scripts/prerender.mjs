import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { chromium } from 'playwright';
import { locationData } from '../src/data/locationData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const staticPages = [
  '/',
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

const routesToPrerender = [
  ...staticPages,
  ...locationData.map(loc => `/dijital-ajans/${loc.slug}`)
];

async function prerender() {
  console.log('Starting local server for prerendering...');
  const app = express();
  
  // Serve static files from dist directory, fallback to index.html for SPA routing
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  const port = 39485; // Use an arbitrary high port
  const server = app.listen(port);
  console.log(`Server listening on port ${port}`);

  console.log('Launching Playwright Chromium...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const route of routesToPrerender) {
    const url = `http://localhost:${port}${route}`;
    console.log(`Prerendering: ${url}`);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      
      // Wait for React to mount and render content inside #root
      await page.waitForFunction(() => {
        const root = document.getElementById('root');
        return root && root.innerHTML.length > 200; // Ensure some content is rendered
      }, { timeout: 10000 });

      // Get the full HTML
      const html = await page.content();

      // Determine output file path
      const routePath = route === '/' ? '/index.html' : `${route}/index.html`;
      const fullPath = path.join(distPath, routePath);
      
      // Create directory if it doesn't exist
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Save HTML file
      fs.writeFileSync(fullPath, html, 'utf8');
      console.log(`Saved static HTML to ${fullPath}`);
    } catch (err) {
      console.error(`Failed to prerender ${url}:`, err.message);
    }
  }

  console.log('Closing browser and server...');
  await browser.close();
  server.close();
  console.log('Prerendering complete!');
}

prerender().catch(err => {
  console.error(err);
  process.exit(1);
});
