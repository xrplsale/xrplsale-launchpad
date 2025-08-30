import { test, expect, type Page } from '@playwright/test';

// Test data and selectors for reusability
const SELECTORS = {
  navigation: {
    logo: '[data-testid="logo"], .logo, img[alt*="logo" i], img[alt*="xrpl" i]',
    menuButton: '[data-testid="menu-button"], .menu-button, button[aria-label*="menu" i]',
    navLinks: 'nav a, .navigation a, [role="navigation"] a',
    mobileMenu: '[data-testid="mobile-menu"], .mobile-menu, .menu-overlay'
  },
  hero: {
    heroSection: '[data-testid="hero"], .hero, main section:first-child',
    heroTitle: 'h1, [data-testid="hero-title"]',
    heroSubtitle: '.hero-subtitle, .subtitle, p:first-of-type',
    ctaButtons: '.cta-button, [data-testid="cta"], button[class*="primary"]'
  },
  content: {
    sections: 'main section, [data-testid="section"]',
    cards: '.card, [data-testid="card"], .project-card',
    buttons: 'button, .btn, [role="button"]',
    forms: 'form, [data-testid="form"]',
    inputs: 'input, textarea, select'
  }
};

// Helper function to wait for page to be fully loaded
async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => document.readyState === 'complete');
}

// Helper function to check if element is visible and interactable
async function checkElementAccessibility(page: Page, selector: string, elementName: string) {
  try {
    const element = page.locator(selector).first();
    await expect(element).toBeVisible({ timeout: 5000 });
    
    // Check if element has proper accessibility attributes
    const hasAriaLabel = await element.getAttribute('aria-label');
    const hasAlt = await element.getAttribute('alt');
    const hasTitle = await element.getAttribute('title');
    const tagName = await element.evaluate(el => el.tagName.toLowerCase());
    
    // Interactive elements should have some form of accessible name
    if (['button', 'a', 'input'].includes(tagName)) {
      const hasAccessibleName = hasAriaLabel || hasAlt || hasTitle || 
        await element.textContent() || 
        await element.getAttribute('value');
      
      if (!hasAccessibleName) {
        console.warn(`${elementName} may lack accessible name`);
      }
    }
    
    return true;
  } catch (error) {
    console.warn(`${elementName} not found or not accessible:`, error.message);
    return false;
  }
}

test.describe('Homepage UX/UI Analysis', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage with performance monitoring
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForPageLoad(page);
    const loadTime = Date.now() - startTime;
    
    console.log(`Page load time: ${loadTime}ms`);
    
    // Take initial screenshot for reference
    await page.screenshot({ 
      path: `test-results/homepage-initial-${Date.now()}.png`,
      fullPage: true 
    });
  });

  test('Homepage loads successfully with proper structure', async ({ page }) => {
    // Check basic page structure
    await expect(page).toHaveTitle(/XRPL/i);
    
    // Verify essential elements are present
    const logo = page.locator(SELECTORS.navigation.logo).first();
    await expect(logo).toBeVisible();
    
    // Check for main content area
    const main = page.locator('main').first();
    await expect(main).toBeVisible();
    
    // Verify page has proper heading structure
    const h1Elements = await page.locator('h1').count();
    expect(h1Elements).toBeGreaterThan(0);
    expect(h1Elements).toBeLessThan(3); // Should have 1-2 h1 elements max
  });

  test('Navigation UX/UI testing', async ({ page }) => {
    // Test logo visibility and functionality
    const logo = page.locator(SELECTORS.navigation.logo).first();
    await checkElementAccessibility(page, SELECTORS.navigation.logo, 'Logo');
    
    // Test navigation links
    const navLinks = page.locator(SELECTORS.navigation.navLinks);
    const linkCount = await navLinks.count();
    console.log(`Found ${linkCount} navigation links`);
    
    if (linkCount > 0) {
      // Test each navigation link
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = navLinks.nth(i);
        await expect(link).toBeVisible();
        
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        console.log(`Nav link ${i}: "${text}" -> "${href}"`);
        
        // Test hover state
        await link.hover();
        await page.waitForTimeout(500);
        
        // Take screenshot of hover state
        await page.screenshot({ 
          path: `test-results/nav-hover-${i}-${Date.now()}.png`,
          clip: await link.boundingBox() || undefined
        });
      }
    }
    
    // Test mobile navigation if present
    const menuButton = page.locator(SELECTORS.navigation.menuButton).first();
    const isMenuButtonVisible = await menuButton.isVisible().catch(() => false);
    
    if (isMenuButtonVisible) {
      console.log('Testing mobile menu functionality');
      await menuButton.click();
      await page.waitForTimeout(500);
      
      // Check if mobile menu opened
      const mobileMenu = page.locator(SELECTORS.navigation.mobileMenu).first();
      const isMobileMenuVisible = await mobileMenu.isVisible().catch(() => false);
      
      if (isMobileMenuVisible) {
        await page.screenshot({ 
          path: `test-results/mobile-menu-open-${Date.now()}.png`,
          fullPage: true 
        });
        
        // Close mobile menu
        await menuButton.click();
      }
    }
  });

  test('Hero section UX/UI analysis', async ({ page }) => {
    // Find and analyze hero section
    const heroSection = page.locator(SELECTORS.hero.heroSection).first();
    
    if (await heroSection.isVisible().catch(() => false)) {
      console.log('Analyzing hero section');
      
      // Check hero title
      const heroTitle = page.locator(SELECTORS.hero.heroTitle).first();
      await checkElementAccessibility(page, SELECTORS.hero.heroTitle, 'Hero Title');
      
      const titleText = await heroTitle.textContent().catch(() => '');
      console.log(`Hero title: "${titleText}"`);
      
      // Check hero subtitle/description
      const heroSubtitle = page.locator(SELECTORS.hero.heroSubtitle).first();
      if (await heroSubtitle.isVisible().catch(() => false)) {
        const subtitleText = await heroSubtitle.textContent().catch(() => '');
        console.log(`Hero subtitle: "${subtitleText}"`);
      }
      
      // Test CTA buttons in hero
      const ctaButtons = page.locator(SELECTORS.hero.ctaButtons);
      const ctaCount = await ctaButtons.count();
      console.log(`Found ${ctaCount} CTA buttons in hero`);
      
      for (let i = 0; i < Math.min(ctaCount, 3); i++) {
        const button = ctaButtons.nth(i);
        await expect(button).toBeVisible();
        
        const buttonText = await button.textContent();
        console.log(`CTA button ${i}: "${buttonText}"`);
        
        // Test button hover state
        await button.hover();
        await page.waitForTimeout(300);
        
        // Take screenshot of button hover state
        await page.screenshot({ 
          path: `test-results/cta-hover-${i}-${Date.now()}.png`,
          clip: await button.boundingBox() || undefined
        });
      }
      
      // Take full hero section screenshot
      await page.screenshot({ 
        path: `test-results/hero-section-${Date.now()}.png`,
        clip: await heroSection.boundingBox() || undefined
      });
    }
  });

  test('Interactive elements testing', async ({ page }) => {
    // Test all buttons on the page
    const buttons = page.locator(SELECTORS.content.buttons);
    const buttonCount = await buttons.count();
    console.log(`Found ${buttonCount} interactive buttons`);
    
    // Test first 10 buttons to avoid excessive testing
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      
      if (await button.isVisible().catch(() => false)) {
        const buttonText = await button.textContent().catch(() => '');
        const isDisabled = await button.isDisabled().catch(() => false);
        
        console.log(`Testing button ${i}: "${buttonText}" (disabled: ${isDisabled})`);
        
        if (!isDisabled) {
          // Test hover state
          await button.hover();
          await page.waitForTimeout(200);
          
          // Test focus state
          await button.focus();
          await page.waitForTimeout(200);
        }
      }
    }
    
    // Test form elements if present
    const forms = page.locator(SELECTORS.content.forms);
    const formCount = await forms.count();
    
    if (formCount > 0) {
      console.log(`Found ${formCount} forms`);
      
      const inputs = page.locator(SELECTORS.content.inputs);
      const inputCount = await inputs.count();
      console.log(`Found ${inputCount} input elements`);
      
      // Test first few inputs
      for (let i = 0; i < Math.min(inputCount, 5); i++) {
        const input = inputs.nth(i);
        
        if (await input.isVisible().catch(() => false)) {
          const inputType = await input.getAttribute('type').catch(() => '');
          const placeholder = await input.getAttribute('placeholder').catch(() => '');
          
          console.log(`Testing input ${i}: type="${inputType}", placeholder="${placeholder}"`);
          
          // Test focus state
          await input.focus();
          await page.waitForTimeout(200);
          
          // Test typing if it's a text input
          if (['text', 'email', 'search', ''].includes(inputType)) {
            await input.fill('test');
            await page.waitForTimeout(200);
            await input.clear();
          }
        }
      }
    }
  });

  test('Scroll behavior and animations testing', async ({ page }) => {
    // Test page scroll behavior
    const initialViewport = page.viewportSize();
    
    if (initialViewport) {
      // Scroll down in steps and observe behavior
      const steps = 5;
      const stepSize = initialViewport.height;
      
      for (let i = 1; i <= steps; i++) {
        await page.evaluate((scrollY) => {
          window.scrollTo({ top: scrollY, behavior: 'smooth' });
        }, stepSize * i);
        
        await page.waitForTimeout(500);
        
        // Take screenshot at each scroll position
        await page.screenshot({ 
          path: `test-results/scroll-position-${i}-${Date.now()}.png`,
          fullPage: false 
        });
      }
      
      // Test scroll to top
      await page.evaluate(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      
      await page.waitForTimeout(500);
    }
    
    // Check for sticky elements
    const header = page.locator('header, .header, nav').first();
    if (await header.isVisible().catch(() => false)) {
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);
      
      const isSticky = await header.isVisible();
      console.log(`Header remains visible when scrolled: ${isSticky}`);
    }
  });

  test('Visual consistency and design system', async ({ page }) => {
    // Check color scheme consistency
    const bodyStyles = await page.evaluate(() => {
      const styles = window.getComputedStyle(document.body);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontFamily: styles.fontFamily
      };
    });
    
    console.log('Body styles:', bodyStyles);
    
    // Check heading hierarchy
    const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const headingStyles = {};
    
    for (const heading of headings) {
      const elements = page.locator(heading);
      const count = await elements.count();
      
      if (count > 0) {
        const firstElement = elements.first();
        const styles = await firstElement.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            fontSize: computed.fontSize,
            fontWeight: computed.fontWeight,
            color: computed.color,
            marginTop: computed.marginTop,
            marginBottom: computed.marginBottom
          };
        });
        
        headingStyles[heading] = { count, styles };
        console.log(`${heading}: ${count} elements`, styles);
      }
    }
    
    // Check button consistency
    const buttons = page.locator('button, .btn, [role="button"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const buttonVariants = new Set();
      
      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i);
        
        if (await button.isVisible().catch(() => false)) {
          const styles = await button.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              backgroundColor: computed.backgroundColor,
              color: computed.color,
              borderRadius: computed.borderRadius,
              padding: computed.padding,
              fontSize: computed.fontSize
            };
          });
          
          buttonVariants.add(JSON.stringify(styles));
        }
      }
      
      console.log(`Found ${buttonVariants.size} button style variants out of ${buttonCount} buttons`);
    }
  });

  test('Performance and loading states', async ({ page }) => {
    // Monitor network activity
    let requestCount = 0;
    let slowRequests = 0;
    
    page.on('request', () => requestCount++);
    page.on('response', (response) => {
      const responseTime = response.timing()?.receiveHeadersEnd || 0;
      if (responseTime > 3000) {
        slowRequests++;
        console.warn(`Slow request: ${response.url()} took ${responseTime}ms`);
      }
    });
    
    // Test page reload performance
    await page.reload({ waitUntil: 'domcontentloaded' });
    await waitForPageLoad(page);
    
    console.log(`Total requests: ${requestCount}, Slow requests: ${slowRequests}`);
    
    // Check for loading spinners or skeleton states
    const loadingElements = page.locator('.loading, .spinner, .skeleton, [data-testid*="loading"]');
    const loadingCount = await loadingElements.count();
    
    if (loadingCount > 0) {
      console.log(`Found ${loadingCount} loading state elements`);
      
      // Take screenshot of loading states
      await page.screenshot({ 
        path: `test-results/loading-states-${Date.now()}.png`,
        fullPage: true 
      });
    }
    
    // Test image loading
    const images = page.locator('img');
    const imageCount = await images.count();
    console.log(`Found ${imageCount} images`);
    
    let loadedImages = 0;
    let failedImages = 0;
    
    for (let i = 0; i < Math.min(imageCount, 10); i++) {
      const img = images.nth(i);
      
      try {
        await expect(img).toBeVisible();
        const isLoaded = await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalHeight !== 0);
        
        if (isLoaded) {
          loadedImages++;
        } else {
          failedImages++;
          const src = await img.getAttribute('src');
          console.warn(`Failed to load image: ${src}`);
        }
      } catch (error) {
        failedImages++;
      }
    }
    
    console.log(`Images loaded: ${loadedImages}, Failed: ${failedImages}`);
  });

  test('Error handling and edge cases', async ({ page }) => {
    // Test 404 error handling by trying non-existent page
    const response = await page.goto('/non-existent-page', { 
      waitUntil: 'domcontentloaded' 
    }).catch(() => null);
    
    if (response) {
      console.log(`404 page status: ${response.status()}`);
      
      // Check if custom 404 page exists
      const has404Content = await page.locator('*').filter({ hasText: /404|not found/i }).count();
      console.log(`Has 404 content: ${has404Content > 0}`);
      
      if (has404Content > 0) {
        await page.screenshot({ 
          path: `test-results/404-page-${Date.now()}.png`,
          fullPage: true 
        });
      }
    }
    
    // Return to homepage
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Test JavaScript error handling
    await page.evaluate(() => {
      // Intentionally trigger a small error to see if it's handled gracefully
      try {
        (window as any).nonExistentFunction();
      } catch (e) {
        console.log('Error caught by page JavaScript');
      }
    });
    
    // Test offline behavior (if service worker is present)
    const hasServiceWorker = await page.evaluate(() => 'serviceWorker' in navigator);
    console.log(`Service worker supported: ${hasServiceWorker}`);
    
    if (hasServiceWorker) {
      const swRegistrations = await page.evaluate(async () => {
        const registrations = await navigator.serviceWorker.getRegistrations();
        return registrations.length;
      });
      console.log(`Service worker registrations: ${swRegistrations}`);
    }
  });
});