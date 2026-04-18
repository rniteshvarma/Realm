import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' });
    console.log("Page loaded. Waiting for loading ritual to complete...");
    await new Promise(r => setTimeout(r, 6000));
    
    console.log("Trying to click INITIATE SEQUENCE...");
    await page.click('.loading-ritual__enter');
    console.log("Clicked! Waiting a bit...");
    await new Promise(r => setTimeout(r, 3000));
    
  } catch (err) {
    console.log("NODE SCRIPT ERROR:", err.message);
  } finally {
    await browser.close();
  }
})();
