const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://upload.wikimedia.org/wikipedia/commons/4/41/N11_Logo.svg');
  let svg = await page.evaluate(() => document.documentElement.outerHTML);
  if (svg.includes('<svg')) {
      const match = svg.match(/<svg[^>]*>[\s\S]*<\/svg>/);
      if(match) fs.writeFileSync('public/images/partners/n11.svg', match[0]);
  }

  await page.goto('https://www.ideasoft.com.tr/wp-content/themes/ideasoft2022/img/ideasoft-logo.svg');
  svg = await page.evaluate(() => document.documentElement.outerHTML);
  if (svg.includes('<svg')) {
      const match = svg.match(/<svg[^>]*>[\s\S]*<\/svg>/);
      if(match) fs.writeFileSync('public/images/partners/ideasoft.svg', match[0]);
  }
  
  await browser.close();
})();
