const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://www.tsoft.com.tr/Assets/img/t-soft-logo.svg');
  let svg = await page.evaluate(() => document.documentElement.outerHTML);
  if (svg.includes('<svg')) {
      const match = svg.match(/<svg[^>]*>[\s\S]*<\/svg>/);
      if(match) fs.writeFileSync('public/images/partners/tsoft.svg', match[0]);
  }

  await page.goto('https://upload.wikimedia.org/wikipedia/tr/b/bd/Ciceksepeti-logo.png');
  // Since it's a PNG, we shouldn't save SVG. Wait, I can just write an SVG for ciceksepeti, it's just text!
  
  await browser.close();
})();
