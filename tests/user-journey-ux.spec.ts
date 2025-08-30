import { test, expect, type Page } from '@playwright/test';

// Common user journey paths and scenarios
const USER_JOURNEYS = {
  firstTimeVisitor: {
    name: 'First-time visitor discovery flow',
    steps: [
      { action: 'navigate', path: '/', description: 'Land on homepage' },
      { action: 'observe', description: 'Understand value proposition' },
      { action: 'explore', description: 'Browse key sections' },
      { action: 'action', description: 'Find primary call-to-action' }
    ]
  },
  projectExplorer: {
    name: 'Project exploration journey',
    steps: [
      { action: 'navigate', path: '/', description: 'Start from homepage' },
      { action: 'navigate', path: '/projects', description: 'Browse projects' },
      { action: 'interact', description: 'View project details' },
      { action: 'action', description: 'Consider participation' }
    ]
  },
  contentConsumer: {
    name: 'Content discovery journey',
    steps: [
      { action: 'navigate', path: '/', description: 'Start from homepage' },
      { action: 'navigate', path: '/blog', description: 'Access blog content' },
      { action: 'interact', description: 'Read articles' },
      { action: 'explore', description: 'Discover related content' }
    ]
  }
};

async function simulateUserBehavior(page: Page, behavior: 'fast' | 'normal' | 'slow' = 'normal') {
  const delays = {
    fast: { scroll: 100, read: 500, click: 200 },
    normal: { scroll: 300, read: 1500, click: 500 },
    slow: { scroll: 800, read: 3000, click: 1000 }
  };
  
  return delays[behavior];
}

async function trackUserEngagement(page: Page, sectionName: string) {
  const startTime = Date.now();
  
  // Simulate user reading/viewing time
  const timing = await simulateUserBehavior(page, 'normal');
  await page.waitForTimeout(timing.read);
  
  const endTime = Date.now();
  const engagement = endTime - startTime;
  
  console.log(`User engagement in ${sectionName}: ${engagement}ms`);
  return engagement;
}

async function checkUserFeedback(page: Page, actionName: string) {
  // Check for loading states, success messages, error states
  const feedbackSelectors = [
    '.loading, .spinner, [data-testid*="loading"]',
    '.success, .success-message, [data-testid*="success"]',
    '.error, .error-message, [data-testid*="error"]',
    '.toast, .notification, [data-testid*="toast"]'
  ];
  
  let feedbackFound = false;
  
  for (const selector of feedbackSelectors) {
    const elements = page.locator(selector);
    const count = await elements.count();
    
    if (count > 0) {
      feedbackFound = true;
      const firstElement = elements.first();
      
      if (await firstElement.isVisible()) {
        const text = await firstElement.textContent();
        console.log(`User feedback for ${actionName}: ${text}`);
        
        // Take screenshot of feedback
        await page.screenshot({
          path: `test-results/feedback-${actionName.replace(/\s+/g, '-')}-${Date.now()}.png`,
          clip: await firstElement.boundingBox() || undefined
        });
      }
    }
  }
  
  if (!feedbackFound) {
    console.warn(`No user feedback found for ${actionName}`);
  }
  
  return feedbackFound;
}

test.describe('User Journey UX Analysis', () => {
  
  test('First-time visitor journey', async ({ page }) => {
    console.log('Starting first-time visitor journey simulation');
    
    // Step 1: Land on homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await trackUserEngagement(page, 'Homepage initial view');
    
    // Take screenshot of first impression
    await page.screenshot({ 
      path: `test-results/first-impression-${Date.now()}.png`,
      fullPage: false 
    });
    
    // Step 2: Simulate reading hero content
    const heroTitle = page.locator('h1').first();
    if (await heroTitle.isVisible()) {
      const titleText = await heroTitle.textContent();
      console.log(`First impression: "${titleText}"`);
      
      // Check if value proposition is clear
      const hasValueProposition = titleText && (
        titleText.toLowerCase().includes('xrpl') ||
        titleText.toLowerCase().includes('presale') ||
        titleText.toLowerCase().includes('launchpad') ||
        titleText.toLowerCase().includes('invest')
      );
      
      console.log(`Value proposition clarity: ${hasValueProposition ? 'Clear' : 'Unclear'}`);
    }
    
    // Step 3: Explore key sections through scrolling
    const sections = page.locator('section, .section, main > div');
    const sectionCount = await sections.count();
    console.log(`Found ${sectionCount} main sections to explore`);
    
    for (let i = 0; i < Math.min(sectionCount, 4); i++) {
      const section = sections.nth(i);
      await section.scrollIntoViewIfNeeded();
      await trackUserEngagement(page, `Section ${i + 1}`);
      
      // Take screenshot of each section
      await page.screenshot({ 
        path: `test-results/section-${i + 1}-${Date.now()}.png`,
        clip: await section.boundingBox() || undefined
      });
    }
    
    // Step 4: Find and evaluate primary CTA
    const primaryCTAs = page.locator('button, .btn, [role="button"]').filter({
      hasText: /get started|join|participate|invest|presale|buy|start/i
    });
    
    const ctaCount = await primaryCTAs.count();
    console.log(`Found ${ctaCount} primary CTA candidates`);
    
    if (ctaCount > 0) {
      const mainCTA = primaryCTAs.first();
      await mainCTA.scrollIntoViewIfNeeded();
      
      const ctaText = await mainCTA.textContent();
      const isVisible = await mainCTA.isVisible();
      const isEnabled = !await mainCTA.isDisabled();
      
      console.log(`Primary CTA: "${ctaText}" (visible: ${isVisible}, enabled: ${isEnabled})`);
      
      // Test CTA interaction
      if (isVisible && isEnabled) {
        await mainCTA.hover();
        await page.waitForTimeout(300);
        
        // Take screenshot of CTA hover state
        await page.screenshot({ 
          path: `test-results/primary-cta-hover-${Date.now()}.png`,
          clip: await mainCTA.boundingBox() || undefined
        });
        
        // Simulate click (but don't actually submit)
        await mainCTA.focus();
        await page.waitForTimeout(200);
      }
    }
  });

  test('Project exploration journey', async ({ page }) => {
    console.log('Starting project exploration journey');
    
    // Start from homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for navigation to projects
    const projectsLink = page.locator('a').filter({
      hasText: /projects|investments|presales|launches/i
    }).first();
    
    if (await projectsLink.isVisible()) {
      console.log('Found projects navigation');
      await projectsLink.click();
      await page.waitForLoadState('networkidle');
      
      await trackUserEngagement(page, 'Projects page');
      
      // Take screenshot of projects page
      await page.screenshot({ 
        path: `test-results/projects-page-${Date.now()}.png`,
        fullPage: true 
      });
      
      // Analyze project cards/listings
      const projectCards = page.locator('.card, .project-card, [data-testid*="project"]');
      const cardCount = await projectCards.count();
      console.log(`Found ${cardCount} project cards`);
      
      if (cardCount > 0) {
        // Examine first few project cards
        for (let i = 0; i < Math.min(cardCount, 3); i++) {
          const card = projectCards.nth(i);
          await card.scrollIntoViewIfNeeded();
          
          await trackUserEngagement(page, `Project card ${i + 1}`);
          
          // Check card content
          const cardTitle = await card.locator('h1, h2, h3, .title, .name').first().textContent().catch(() => '');
          const cardDescription = await card.locator('p, .description, .summary').first().textContent().catch(() => '');
          
          console.log(`Project ${i + 1}: "${cardTitle}"`);
          
          // Test card interaction
          const cardLinks = card.locator('a, button');
          const linkCount = await cardLinks.count();
          
          if (linkCount > 0) {
            const primaryLink = cardLinks.first();
            await primaryLink.hover();
            await page.waitForTimeout(200);
            
            // Take screenshot of card hover state
            await page.screenshot({ 
              path: `test-results/project-card-${i + 1}-hover-${Date.now()}.png`,
              clip: await card.boundingBox() || undefined
            });
          }
        }
      }
    } else {
      // Try direct navigation to projects
      const projectsResponse = await page.goto('/projects').catch(() => null);
      
      if (projectsResponse && projectsResponse.status() === 200) {
        console.log('Direct navigation to /projects successful');
        await trackUserEngagement(page, 'Direct projects access');
      } else {
        console.log('Projects section not accessible - checking for embedded projects on homepage');
        
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Look for embedded project content
        const embeddedProjects = page.locator('*').filter({
          hasText: /project|presale|investment|launch/i
        });
        
        const embeddedCount = await embeddedProjects.count();
        console.log(`Found ${embeddedCount} elements with project-related content`);
      }
    }
  });

  test('Content discovery journey', async ({ page }) => {
    console.log('Starting content discovery journey');
    
    // Start from homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for blog/content navigation
    const blogLink = page.locator('a').filter({
      hasText: /blog|news|updates|articles|content/i
    }).first();
    
    if (await blogLink.isVisible()) {
      console.log('Found blog navigation');
      await blogLink.click();
      await page.waitForLoadState('networkidle');
      
      await trackUserEngagement(page, 'Blog page');
      
      // Take screenshot of blog page
      await page.screenshot({ 
        path: `test-results/blog-page-${Date.now()}.png`,
        fullPage: true 
      });
      
      // Analyze blog layout and content
      const blogPosts = page.locator('article, .post, .blog-post, .article-card');
      const postCount = await blogPosts.count();
      console.log(`Found ${postCount} blog posts`);
      
      if (postCount > 0) {
        // Examine first blog post
        const firstPost = blogPosts.first();
        await firstPost.scrollIntoViewIfNeeded();
        
        const postTitle = await firstPost.locator('h1, h2, h3, .title').first().textContent().catch(() => '');
        const postExcerpt = await firstPost.locator('p, .excerpt, .summary').first().textContent().catch(() => '');
        
        console.log(`First blog post: "${postTitle}"`);
        
        // Test reading a blog post
        const readMoreLink = firstPost.locator('a').filter({
          hasText: /read more|continue|view post/i
        }).first();
        
        if (await readMoreLink.isVisible()) {
          await readMoreLink.click();
          await page.waitForLoadState('networkidle');
          
          await trackUserEngagement(page, 'Blog post reading');
          
          // Take screenshot of full blog post
          await page.screenshot({ 
            path: `test-results/blog-post-${Date.now()}.png`,
            fullPage: true 
          });
          
          // Check blog post structure
          const postContent = page.locator('main, .content, .post-content, article');
          const hasGoodStructure = await postContent.locator('h1, h2, h3').count() > 0;
          
          console.log(`Blog post has good heading structure: ${hasGoodStructure}`);
          
          // Look for related content
          const relatedContent = page.locator('*').filter({
            hasText: /related|more posts|you might like|recommended/i
          });
          
          const hasRelatedContent = await relatedContent.count() > 0;
          console.log(`Blog post has related content suggestions: ${hasRelatedContent}`);
        }
      }
    } else {
      // Try direct navigation to blog
      const blogResponse = await page.goto('/blog').catch(() => null);
      
      if (blogResponse && blogResponse.status() === 200) {
        console.log('Direct navigation to /blog successful');
        await trackUserEngagement(page, 'Direct blog access');
      } else {
        console.log('Blog section not accessible');
      }
    }
  });

  test('Cross-page navigation and consistency', async ({ page }) => {
    console.log('Testing cross-page navigation consistency');
    
    // Start from homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get homepage header/navigation elements for comparison
    const homeHeader = page.locator('header, nav, .header, .navigation').first();
    let homeHeaderHTML = '';
    
    if (await homeHeader.isVisible()) {
      homeHeaderHTML = await homeHeader.innerHTML();
    }
    
    // List of pages to test navigation to
    const pagesToTest = ['/projects', '/blog', '/changelog', '/about'];
    const successfulPages = [];
    const failedPages = [];
    
    for (const pagePath of pagesToTest) {
      try {
        const response = await page.goto(pagePath);
        
        if (response && response.status() === 200) {
          successfulPages.push(pagePath);
          await page.waitForLoadState('networkidle');
          
          // Check navigation consistency
          const pageHeader = page.locator('header, nav, .header, .navigation').first();
          
          if (await pageHeader.isVisible()) {
            const pageHeaderHTML = await pageHeader.innerHTML();
            const isConsistent = pageHeaderHTML === homeHeaderHTML;
            
            console.log(`Navigation consistency on ${pagePath}: ${isConsistent ? 'Consistent' : 'Inconsistent'}`);
          }
          
          // Take screenshot of each page
          await page.screenshot({ 
            path: `test-results/page-${pagePath.replace('/', '')}-${Date.now()}.png`,
            fullPage: true 
          });
          
          await trackUserEngagement(page, `${pagePath} page visit`);
          
        } else {
          failedPages.push(pagePath);
        }
      } catch (error) {
        failedPages.push(pagePath);
        console.warn(`Failed to access ${pagePath}:`, error.message);
      }
    }
    
    console.log(`Successfully accessed pages: ${successfulPages.join(', ')}`);
    console.log(`Failed to access pages: ${failedPages.join(', ')}`);
    
    // Test back button functionality
    if (successfulPages.length > 0) {
      await page.goBack();
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      console.log(`Back button navigation result: ${currentUrl}`);
    }
  });

  test('User error recovery and help', async ({ page }) => {
    console.log('Testing user error recovery mechanisms');
    
    // Test broken internal links
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try to access a clearly non-existent page
    const errorResponse = await page.goto('/definitely-does-not-exist').catch(() => null);
    
    if (errorResponse) {
      console.log(`Error page status: ${errorResponse.status()}`);
      
      // Check if there's a user-friendly 404 page
      const has404Content = await page.locator('*').filter({ hasText: /404|not found|page doesn't exist/i }).count();
      const hasNavigationHelp = await page.locator('*').filter({ hasText: /home|back|navigation|menu/i }).count();
      
      console.log(`Has 404 content: ${has404Content > 0}`);
      console.log(`Has navigation help: ${hasNavigationHelp > 0}`);
      
      if (has404Content > 0 || hasNavigationHelp > 0) {
        await page.screenshot({ 
          path: `test-results/error-page-${Date.now()}.png`,
          fullPage: true 
        });
      }
      
      // Test recovery options
      const homeLink = page.locator('a').filter({ hasText: /home|back to home/i }).first();
      
      if (await homeLink.isVisible()) {
        await homeLink.click();
        await page.waitForLoadState('networkidle');
        
        const isBackToHome = page.url().endsWith('/') || page.url().includes('xrpl.sale');
        console.log(`Error recovery successful: ${isBackToHome}`);
      }
    }
    
    // Return to homepage for other tests
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Information architecture and findability', async ({ page }) => {
    console.log('Testing information architecture and content findability');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Analyze navigation structure
    const navLinks = page.locator('nav a, .navigation a, header a');
    const navCount = await navLinks.count();
    console.log(`Found ${navCount} navigation links`);
    
    // Categorize navigation links
    const navCategories = {
      primary: [],
      secondary: [],
      utility: []
    };
    
    for (let i = 0; i < Math.min(navCount, 10); i++) {
      const link = navLinks.nth(i);
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      
      if (text && href) {
        const linkInfo = { text: text.trim(), href };
        
        // Categorize based on common patterns
        if (['home', 'projects', 'about', 'blog'].some(keyword => 
          text.toLowerCase().includes(keyword)
        )) {
          navCategories.primary.push(linkInfo);
        } else if (['contact', 'support', 'faq', 'help'].some(keyword => 
          text.toLowerCase().includes(keyword)
        )) {
          navCategories.utility.push(linkInfo);
        } else {
          navCategories.secondary.push(linkInfo);
        }
      }
    }
    
    console.log('Navigation structure analysis:');
    console.log(`Primary navigation (${navCategories.primary.length}):`, navCategories.primary);
    console.log(`Secondary navigation (${navCategories.secondary.length}):`, navCategories.secondary);
    console.log(`Utility navigation (${navCategories.utility.length}):`, navCategories.utility);
    
    // Test search functionality if available
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], [data-testid*="search"]').first();
    
    if (await searchInput.isVisible()) {
      console.log('Found search functionality');
      
      await searchInput.click();
      await searchInput.fill('XRPL');
      await page.keyboard.press('Enter');
      
      await page.waitForTimeout(1000);
      await checkUserFeedback(page, 'Search');
      
      // Take screenshot of search results
      await page.screenshot({ 
        path: `test-results/search-results-${Date.now()}.png`,
        fullPage: true 
      });
    } else {
      console.log('No search functionality found');
    }
    
    // Test breadcrumbs if available
    const breadcrumbs = page.locator('.breadcrumb, .breadcrumbs, nav[aria-label*="breadcrumb" i]').first();
    
    if (await breadcrumbs.isVisible()) {
      console.log('Found breadcrumb navigation');
      const breadcrumbLinks = breadcrumbs.locator('a');
      const breadcrumbCount = await breadcrumbLinks.count();
      console.log(`Breadcrumb depth: ${breadcrumbCount} levels`);
    } else {
      console.log('No breadcrumb navigation found');
    }
  });
});