const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to desktop size
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    console.log('Navigating to localhost:3000...');
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    console.log('Taking screenshot...');
    await page.screenshot({ 
      path: 'homepage-screenshot.png', 
      fullPage: true 
    });
    
    console.log('Screenshot saved as homepage-screenshot.png');
    
    // Also take a mobile screenshot
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'homepage-mobile-screenshot.png', 
      fullPage: true 
    });
    
    console.log('Mobile screenshot saved as homepage-mobile-screenshot.png');
    
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
})();