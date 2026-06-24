import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', exception => {
    console.log(`[BROWSER UNCAUGHT EXCEPTION] ${exception.stack || exception.message}`);
  });

  try {
    console.log('Visiting http://localhost:5175/admin ...');
    await page.goto('http://localhost:5175/admin');
    await page.waitForTimeout(1000);

    console.log('Entering password...');
    await page.fill('input[type="password"]', 'rota2026admin');
    
    console.log('Submitting login form...');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    console.log('Clicking Genel Ayarlar tab...');
    const settingsTabButton = page.locator('button:has-text("Genel Ayarlar")');
    if (await settingsTabButton.count() > 0) {
      await settingsTabButton.click();
      await page.waitForTimeout(1500);
      
      console.log('1. Testing About Subtabs...');
      const subTabs = ['Giriş & Kahraman', 'Hikaye & Anlayış', 'Kültür & Kurallar', 'Kahve Daveti'];
      for (const tab of subTabs) {
        console.log(`Clicking subtab: ${tab}`);
        await page.click(`button:has-text("${tab}")`);
        await page.waitForTimeout(500);
      }

      console.log('2. Testing Contact Subtabs...');
      const contactTabs = ['Genel & Sayfa Girişi', 'İletişim Bilgileri', 'Mesai Saatleri & Tatiller'];
      for (const tab of contactTabs) {
        console.log(`Clicking contact subtab: ${tab}`);
        await page.click(`button:has-text("${tab}")`);
        await page.waitForTimeout(500);
      }

      console.log('3. Testing Legal Subtabs...');
      const legalTabs = ['Gizlilik Politikası', 'Kullanım Koşulları', 'KVKK Aydınlatma Metni', 'Çerez Politikası'];
      for (const tab of legalTabs) {
        console.log(`Clicking legal subtab: ${tab}`);
        await page.click(`button:has-text("${tab}")`);
        await page.waitForTimeout(500);
      }

      console.log('4. Testing Save Form...');
      // Click the first save button (inside form) or the main save button in header
      const mainSaveButton = page.locator('button:has-text("Değişiklikleri Kaydet")');
      if (await mainSaveButton.count() > 0) {
        console.log('Clicking main Save button in header...');
        await mainSaveButton.click();
        await page.waitForTimeout(2000);
      } else {
        console.log('Main save button not found.');
      }
      
      console.log('Dumping complete body text...');
      const bodyText = await page.evaluate(() => document.body.innerText);
      console.log('--- BODY TEXT START ---');
      console.log(bodyText);
      console.log('--- BODY TEXT END ---');
    } else {
      console.log('Genel Ayarlar tab button not found!');
    }
  } catch (error) {
    console.error('Script error:', error);
  } finally {
    await browser.close();
  }
}

run();
