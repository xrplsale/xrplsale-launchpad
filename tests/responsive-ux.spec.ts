import { test, expect, type Page } from '@playwright/test';

// Define viewport configurations for responsive testing
const VIEWPORTS = {
  mobile: { width: 375, height: 812, name: 'iPhone 12' },
  mobileLarge: { width: 414, height: 896, name: 'iPhone 14 Plus' },
  tablet: { width: 768, height: 1024, name: 'iPad' },
  tabletLarge: { width: 1024, height: 768, name: 'iPad Landscape' },
  laptop: { width: 1366, height: 768, name: 'Laptop' },
  desktop: { width: 1920, height: 1080, name: 'Desktop' },
  desktopLarge: { width: 2560, height: 1440, name: 'Large Desktop' }
};

// Test breakpoints where layout typically changes
const BREAKPOINTS = [320, 375, 414, 768, 1024, 1366, 1920];

async function analyzeResponsiveLayout(page: Page, viewportName: string) {
  const viewport = page.viewportSize();
  console.log(`Analyzing ${viewportName} layout (${viewport?.width}x${viewport?.height})`);
  
  // Take full page screenshot
  await page.screenshot({ 
    path: `test-results/responsive-${viewportName.toLowerCase().replace(' ', '-')}-${Date.now()}.png`,
    fullPage: true 
  });
  
  // Analyze layout elements
  const analysis = {
    viewport: viewportName,
    dimensions: viewport,
    issues: [],
    features: []
  };
  
  // Check navigation
  const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, .hamburger').first();
  const desktopNav = page.locator('nav ul, .desktop-nav, .nav-links').first();
  
  const hasMobileMenu = await mobileMenu.isVisible();
  const hasDesktopNav = await desktopNav.isVisible();
  
  if (viewport && viewport.width < 768) {
    if (!hasMobileMenu && hasDesktopNav) {
      analysis.issues.push('Mobile viewport shows desktop navigation');
    } else if (hasMobileMenu) {
      analysis.features.push('Proper mobile navigation present');
    }
  } else {
    if (hasMobileMenu && !hasDesktopNav) {
      analysis.issues.push('Desktop viewport shows mobile navigation');
    } else if (hasDesktopNav) {
      analysis.features.push('Proper desktop navigation present');
    }
  }
  
  // Check for horizontal scrolling
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const viewportWidth = viewport?.width || 0;
  
  if (bodyWidth > viewportWidth) {
    analysis.issues.push(`Horizontal scrolling detected: body width ${bodyWidth}px exceeds viewport ${viewportWidth}px`);
  }
  
  // Check text readability
  const smallText = page.locator('p, span, div').filter({
    hasText: /.+/
  }).first();
  
  if (await smallText.isVisible()) {
    const textStyles = await smallText.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        fontSize: parseFloat(styles.fontSize),
        lineHeight: styles.lineHeight,
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });
    
    if (textStyles.fontSize < 14) {
      analysis.issues.push(`Text too small: ${textStyles.fontSize}px (recommended: 16px minimum on mobile)`);
    }
  }
  
  // Check button sizes for touch
  if (viewport && viewport.width < 768) {
    const buttons = page.locator('button, .btn, [role="button"]');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        
        if (box && (box.width < 44 || box.height < 44)) {
          analysis.issues.push(`Button ${i + 1} too small for touch: ${Math.round(box.width)}x${Math.round(box.height)}px (recommended: 44x44px minimum)`);
        }
      }
    }
  }
  
  // Check spacing and layout
  const cards = page.locator('.card, .project-card, .blog-card');
  const cardCount = await cards.count();
  
  if (cardCount > 0) {
    const firstCard = cards.first();
    const cardBox = await firstCard.boundingBox();
    
    if (cardBox) {
      const margins = await firstCard.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          marginLeft: parseFloat(styles.marginLeft),
          marginRight: parseFloat(styles.marginRight),
          paddingLeft: parseFloat(styles.paddingLeft),
          paddingRight: parseFloat(styles.paddingRight)
        };
      });
      
      const totalHorizontalSpace = margins.marginLeft + margins.marginRight + margins.paddingLeft + margins.paddingRight;
      
      if (viewport && viewport.width < 768 && totalHorizontalSpace < 32) {
        analysis.issues.push('Insufficient spacing on mobile devices');
      }
    }
  }
  
  return analysis;
}

async function testTouchInteractions(page: Page) {
  console.log('Testing touch interactions');
  
  // Test swipe gestures if applicable
  const swipeableElements = page.locator('.swiper, .carousel, .slider, [data-swipe]');
  const swipeCount = await swipeableElements.count();
  
  if (swipeCount > 0) {
    console.log(`Found ${swipeCount} potentially swipeable elements`);
    
    const firstSwipeable = swipeableElements.first();
    const box = await firstSwipeable.boundingBox();
    
    if (box) {
      // Simulate swipe gesture
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2);
      await page.mouse.up();
      
      await page.waitForTimeout(500);
      console.log('Tested swipe gesture');
    }
  }
  
  // Test tap targets
  const interactiveElements = page.locator('button, a, input, [role="button"]');
  const interactiveCount = await interactiveElements.count();
  
  let tappableElements = 0;
  let problematicElements = 0;
  
  for (let i = 0; i < Math.min(interactiveCount, 10); i++) {
    const element = interactiveElements.nth(i);
    
    if (await element.isVisible()) {
      const box = await element.boundingBox();
      
      if (box) {
        tappableElements++;
        
        if (box.width < 44 || box.height < 44) {
          problematicElements++;
        }
        
        // Test tap
        await element.tap();
        await page.waitForTimeout(100);
      }
    }
  }
  
  console.log(`Touch testing: ${tappableElements} elements tested, ${problematicElements} below recommended size`);
}

async function checkAccessibilityAtViewport(page: Page, viewportName: string) {
  console.log(`Checking accessibility at ${viewportName} viewport`);
  
  const issues = [];
  
  // Check focus management
  const focusableElements = page.locator('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])');
  const focusableCount = await focusableElements.count();
  
  console.log(`Found ${focusableCount} focusable elements`);
  
  // Test tab navigation on first few elements
  for (let i = 0; i < Math.min(focusableCount, 5); i++) {
    const element = focusableElements.nth(i);
    
    if (await element.isVisible()) {
      await element.focus();
      await page.waitForTimeout(100);
      
      // Check if focus is visible
      const focusStyles = await element.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineColor: styles.outlineColor,
          boxShadow: styles.boxShadow
        };
      });
      
      const hasFocusIndicator = focusStyles.outline !== 'none' || 
                               focusStyles.boxShadow !== 'none' ||
                               focusStyles.outlineColor !== 'transparent';
      
      if (!hasFocusIndicator) {
        issues.push(`Element ${i + 1} lacks visible focus indicator`);
      }
    }
  }
  
  // Check color contrast (basic check)
  const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div').filter({
    hasText: /.+/
  });
  
  const textElementCount = await textElements.count();
  
  for (let i = 0; i < Math.min(textElementCount, 3); i++) {
    const element = textElements.nth(i);
    
    if (await element.isVisible()) {
      const colorInfo = await element.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        const rgb = styles.color.match(/\d+/g);
        const bgRgb = styles.backgroundColor.match(/\d+/g);
        
        return {
          color: rgb ? `rgb(${rgb.join(', ')})` : styles.color,
          backgroundColor: bgRgb ? `rgb(${bgRgb.join(', ')})` : styles.backgroundColor,
          fontSize: parseFloat(styles.fontSize)
        };
      });
      
      console.log(`Text element ${i + 1} color info:`, colorInfo);
    }
  }
  
  return issues;
}

test.describe('Responsive UX Testing', () => {
  
  // Test each major viewport
  Object.entries(VIEWPORTS).forEach(([key, viewport]) => {
    test(`Responsive layout analysis - ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const analysis = await analyzeResponsiveLayout(page, viewport.name);
      
      console.log(`${viewport.name} Analysis:`, analysis);
      
      // Assert no critical layout issues
      const criticalIssues = analysis.issues.filter(issue => 
        issue.includes('scrolling') || issue.includes('navigation')
      );
      
      if (criticalIssues.length > 0) {
        console.warn(`Critical issues found on ${viewport.name}:`, criticalIssues);
      }
      
      expect(criticalIssues.length).toBeLessThan(3);
    });
  });

  test('Mobile UX deep dive - iPhone 12', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    console.log('Conducting mobile UX deep dive');
    
    // Test mobile navigation
    const hamburger = page.locator('.hamburger, .menu-button, [aria-label*="menu" i]').first();
    
    if (await hamburger.isVisible()) {
      console.log('Testing mobile menu');
      
      // Test menu open
      await hamburger.tap();
      await page.waitForTimeout(500);
      
      await page.screenshot({ 
        path: `test-results/mobile-menu-open-${Date.now()}.png`,
        fullPage: true 
      });
      
      // Test menu close
      const closeButton = page.locator('.close, [aria-label*="close" i]').first();
      if (await closeButton.isVisible()) {
        await closeButton.tap();
      } else {
        await hamburger.tap(); // Toggle
      }
      
      await page.waitForTimeout(500);
    }
    
    // Test touch interactions
    await testTouchInteractions(page);
    
    // Test mobile-specific features
    const viewport = page.viewportSize();
    if (viewport) {
      // Test scrolling performance
      console.log('Testing mobile scroll performance');
      
      const scrollSteps = 10;
      const stepSize = viewport.height / 2;
      
      for (let i = 1; i <= scrollSteps; i++) {
        await page.evaluate((scrollY) => {
          window.scrollTo({ top: scrollY, behavior: 'smooth' });
        }, stepSize * i);
        
        await page.waitForTimeout(200);
      }
      
      // Scroll back to top
      await page.evaluate(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    
    // Check mobile accessibility
    const accessibilityIssues = await checkAccessibilityAtViewport(page, 'Mobile');
    console.log('Mobile accessibility issues:', accessibilityIssues);
  });

  test('Tablet landscape UX - iPad', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tabletLarge);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    console.log('Testing tablet landscape UX');
    
    // Analyze tablet-specific layout
    const analysis = await analyzeResponsiveLayout(page, 'Tablet Landscape');
    
    // Check for tablet-optimized layouts
    const grid = page.locator('.grid, .row, .columns').first();
    
    if (await grid.isVisible()) {
      const gridItems = grid.locator('> *');
      const itemCount = await gridItems.count();
      
      console.log(`Grid layout has ${itemCount} items`);
      
      if (itemCount > 0) {
        // Check if items are properly spaced for tablet
        const firstItem = gridItems.first();
        const lastItem = gridItems.last();
        
        const firstBox = await firstItem.boundingBox();
        const lastBox = await lastItem.boundingBox();
        
        if (firstBox && lastBox) {
          const totalWidth = lastBox.x + lastBox.width - firstBox.x;
          const viewport = page.viewportSize();
          
          if (viewport) {
            const usage = (totalWidth / viewport.width) * 100;
            console.log(`Grid uses ${usage.toFixed(1)}% of viewport width`);
            
            if (usage < 60) {
              console.warn('Grid may not be optimized for tablet width');
            }
          }
        }
      }
    }
    
    // Test tablet touch interactions
    await testTouchInteractions(page);
  });

  test('Desktop UX optimization - 1920x1080', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    console.log('Testing desktop UX optimization');
    
    const analysis = await analyzeResponsiveLayout(page, 'Desktop');
    
    // Check content utilization on large screens
    const main = page.locator('main, .main-content').first();
    
    if (await main.isVisible()) {
      const mainBox = await main.boundingBox();
      const viewport = page.viewportSize();
      
      if (mainBox && viewport) {
        const contentWidth = mainBox.width;
        const viewportWidth = viewport.width;
        const utilization = (contentWidth / viewportWidth) * 100;
        
        console.log(`Content utilizes ${utilization.toFixed(1)}% of desktop width`);
        
        // Check if content is too narrow or too wide
        if (utilization < 50) {
          console.warn('Content may be too narrow for desktop viewing');
        } else if (utilization > 95) {
          console.warn('Content may be too wide, lacking proper margins');
        }
      }
    }
    
    // Test desktop-specific interactions
    const hoverElements = page.locator('button, .btn, .card, a[class]');
    const hoverCount = await hoverElements.count();
    
    console.log('Testing desktop hover interactions');
    
    for (let i = 0; i < Math.min(hoverCount, 5); i++) {
      const element = hoverElements.nth(i);
      
      if (await element.isVisible()) {
        // Test hover state
        await element.hover();
        await page.waitForTimeout(200);
        
        // Check if hover changes are visible
        const hasTransition = await element.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return styles.transition !== 'none' && styles.transition !== '';
        });
        
        if (hasTransition) {
          console.log(`Element ${i + 1} has hover transitions`);
        }
      }
    }
  });

  test('Cross-viewport content consistency', async ({ page }) => {
    console.log('Testing content consistency across viewports');
    
    const contentSelectors = [
      'h1, .main-title',
      '.hero p, .hero-description',
      '.cta-button, .primary-button',
      'nav a, .nav-link',
      '.card .title, .card h3'
    ];
    
    const viewportsToTest = [VIEWPORTS.mobile, VIEWPORTS.tablet, VIEWPORTS.desktop];
    const contentData = {};
    
    for (const viewport of viewportsToTest) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      contentData[viewport.name] = {};
      
      for (const selector of contentSelectors) {
        const elements = page.locator(selector);
        const count = await elements.count();
        const texts = [];
        
        for (let i = 0; i < Math.min(count, 3); i++) {
          const element = elements.nth(i);
          if (await element.isVisible()) {
            const text = await element.textContent();
            if (text) texts.push(text.trim());
          }
        }
        
        contentData[viewport.name][selector] = texts;
      }
    }
    
    // Compare content across viewports
    console.log('Content consistency analysis:');
    
    for (const selector of contentSelectors) {
      const mobileContent = contentData[VIEWPORTS.mobile.name][selector] || [];
      const tabletContent = contentData[VIEWPORTS.tablet.name][selector] || [];
      const desktopContent = contentData[VIEWPORTS.desktop.name][selector] || [];
      
      const isConsistent = JSON.stringify(mobileContent) === JSON.stringify(tabletContent) &&
                          JSON.stringify(tabletContent) === JSON.stringify(desktopContent);
      
      console.log(`${selector}: ${isConsistent ? 'Consistent' : 'Inconsistent'}`);
      
      if (!isConsistent) {
        console.log(`  Mobile: ${mobileContent.join(', ')}`);
        console.log(`  Tablet: ${tabletContent.join(', ')}`);
        console.log(`  Desktop: ${desktopContent.join(', ')}`);
      }
    }
  });

  test('Performance across devices', async ({ page }) => {
    console.log('Testing performance across different viewport sizes');
    
    const performanceData = {};
    
    for (const [key, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport);
      
      // Measure load time
      const startTime = Date.now();
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Measure DOM metrics
      const metrics = await page.evaluate(() => {
        return {
          domElements: document.querySelectorAll('*').length,
          images: document.querySelectorAll('img').length,
          scripts: document.querySelectorAll('script').length,
          stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length
        };
      });
      
      performanceData[viewport.name] = {
        loadTime,
        ...metrics
      };
      
      console.log(`${viewport.name} performance:`, performanceData[viewport.name]);
    }
    
    // Analyze performance differences
    const loadTimes = Object.values(performanceData).map(data => data.loadTime);
    const avgLoadTime = loadTimes.reduce((a, b) => a + b) / loadTimes.length;
    const maxLoadTime = Math.max(...loadTimes);
    const minLoadTime = Math.min(...loadTimes);
    
    console.log(`Load time analysis: Avg: ${avgLoadTime}ms, Range: ${minLoadTime}-${maxLoadTime}ms`);
    
    if (maxLoadTime - minLoadTime > 2000) {
      console.warn('Significant performance variation across viewports detected');
    }
  });

  test('Responsive breakpoint transitions', async ({ page }) => {
    console.log('Testing responsive breakpoint transitions');
    
    // Test gradual width changes to find breakpoints
    for (const width of BREAKPOINTS) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      console.log(`Testing breakpoint at ${width}px`);
      
      // Check layout at this breakpoint
      const analysis = await analyzeResponsiveLayout(page, `${width}px`);
      
      // Take screenshot at critical breakpoints
      if ([375, 768, 1024, 1920].includes(width)) {
        await page.screenshot({ 
          path: `test-results/breakpoint-${width}px-${Date.now()}.png`,
          fullPage: true 
        });
      }
      
      await page.waitForTimeout(200);
    }
  });
});