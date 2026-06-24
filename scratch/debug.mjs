import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });

  try {
    await page.goto('http://localhost:5173/blog', { waitUntil: 'networkidle0' });
  } catch (err) {
    console.error('Failed to load page:', err);
  }
  
  await browser.close();
})();
