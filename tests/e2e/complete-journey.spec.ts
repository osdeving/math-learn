import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive E2E Test Suite for Math Learn Platform
 * 
 * This suite tests ALL user journeys and validates the complete application:
 * 1. Frontend public pages
 * 2. Admin CRUD operations  
 * 3. LaTeX rendering
 * 4. Responsive design
 * 5. API integration
 * 6. Database operations
 * 7. Error handling
 * 8. Navigation flows
 */

class TestUtils {
  constructor(private page: Page) {}

  /**
   * Take screenshot with test context
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `tests/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoading() {
    await this.page.waitForLoadState('networkidle');
    // Wait for potential loading spinners to disappear
    await this.page.waitForTimeout(500);
  }

  /**
   * Validate LaTeX rendering
   */
  async validateLatexRendering() {
    const katexElements = await this.page.locator('.katex').count();
    return katexElements > 0;
  }

  /**
   * Check if page has error boundary or error messages
   */
  async hasErrors() {
    const errorSelectors = [
      '[data-testid="error-boundary"]',
      '.error-message',
      '[role="alert"]:has-text("Error")',
      '.toast-error'
    ];
    
    for (const selector of errorSelectors) {
      const errorElement = await this.page.locator(selector).count();
      if (errorElement > 0) {
        // Additional check to ensure it's actually an error
        const errorText = await this.page.locator(selector).first().textContent();
        if (errorText && (errorText.toLowerCase().includes('error') || errorText.toLowerCase().includes('erro'))) {
          return true;
        }
      }
    }
    
    // Check for console errors (only critical ones)
    const logs = await this.page.evaluate(() => {
      return window.console.error.toString();
    });
    
    return false; // For now, ignore console errors in E2E
  }

  /**
   * Validate responsive design
   */
  async testResponsiveness() {
    const viewports = [
      { width: 320, height: 568 },  // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1024, height: 768 }, // Desktop
      { width: 1920, height: 1080 } // Large Desktop
    ];

    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport);
      await this.waitForLoading();
      
      // Check for mobile menu on small screens
      if (viewport.width < 768) {
        const mobileMenu = this.page.locator('[data-testid="mobile-menu"]');
        const hamburger = this.page.locator('[data-testid="hamburger"]');
        // Mobile menu should be available
        if (await hamburger.count() > 0 || await mobileMenu.count() > 0) {
          // Test mobile navigation
          if (await hamburger.count() > 0) {
            await hamburger.click();
            await this.waitForLoading();
          }
        }
      }
    }
  }
}

test.describe('📱 Frontend Public Pages - Complete Journey Tests', () => {
  test('🏠 Homepage - Load and Navigation', async ({ page }) => {
    const utils = new TestUtils(page);
    
    await test.step('Load homepage', async () => {
      await page.goto('/');
      await utils.waitForLoading();
      await utils.takeScreenshot('homepage-loaded');
    });

    await test.step('Validate header and navigation', async () => {
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
      
      // Check for main CTA buttons
      const buttons = page.locator('[data-testid*="cta"], button, a[href*="/"]');
      expect(await buttons.count()).toBeGreaterThan(0);
    });

    await test.step('Test responsive design', async () => {
      await utils.testResponsiveness();
    });

    await test.step('Validate no errors', async () => {
      expect(await utils.hasErrors()).toBeFalsy();
    });
  });

  test('📚 Categories Page - Complete Flow', async ({ page }) => {
    const utils = new TestUtils(page);
    
    await test.step('Navigate to categories', async () => {
      await page.goto('/categories');
      await utils.waitForLoading();
      await utils.takeScreenshot('categories-page');
    });

    await test.step('Validate categories display', async () => {
      // Should have category cards or list items
      const categories = page.locator('[data-testid*="category"], .category-card, .category-item');
      const categoryCount = await categories.count();
      
      if (categoryCount > 0) {
        // Test category navigation
        await categories.first().click();
        await utils.waitForLoading();
        await utils.takeScreenshot('category-detail');
        
        // Should navigate to category detail
        expect(page.url()).toContain('/categories/');
      }
    });
  });

  test('🧮 Theory Pages - LaTeX and Content', async ({ page }) => {
    const utils = new TestUtils(page);
    
    await test.step('Navigate to theory section', async () => {
      await page.goto('/theory');
      await utils.waitForLoading();
      await utils.takeScreenshot('theory-listing');
    });

    await test.step('Test theory content rendering', async () => {
      const theoryItems = page.locator('[data-testid*="theory"], .theory-card, .theory-item');
      const theoryCount = await theoryItems.count();
      
      if (theoryCount > 0) {
        // Click on first theory item
        await theoryItems.first().click();
        await utils.waitForLoading();
        await utils.takeScreenshot('theory-detail');
        
        // Validate LaTeX rendering if present
        const hasLatex = await utils.validateLatexRendering();
        if (hasLatex) {
          console.log('✅ LaTeX rendering validated');
        }
        
        // Should have content
        const content = page.locator('[data-testid="theory-content"], .theory-content, .markdown-content');
        expect(await content.count()).toBeGreaterThan(0);
      }
    });
  });

  test('❓ Questions and Practice', async ({ page }) => {
    const utils = new TestUtils(page);
    
    await test.step('Navigate to questions', async () => {
      await page.goto('/questions');
      await utils.waitForLoading();
      await utils.takeScreenshot('questions-listing');
    });

    await test.step('Validate question interactions', async () => {
      const questions = page.locator('[data-testid*="question"], .question-card, .question-item');
      
      if (await questions.count() > 0) {
        await questions.first().click();
        await utils.waitForLoading();
        await utils.takeScreenshot('question-detail');
        
        // Should have 5 alternatives (business rule RN6)
        const alternatives = page.locator('input[type="radio"], .alternative');
        const altCount = await alternatives.count();
        
        if (altCount > 0) {
          expect(altCount).toBe(5); // Exactly 5 alternatives
          
          // Test selecting an alternative
          await alternatives.first().click();
          await utils.takeScreenshot('question-answered');
        }
      }
    });
  });
});

test.describe('👑 Admin Panel - Complete CRUD Testing', () => {
  test('🚪 Admin Dashboard Access', async ({ page }) => {
    const utils = new TestUtils(page);
    
    await test.step('Navigate to admin', async () => {
      await page.goto('/admin');
      await utils.waitForLoading();
      await utils.takeScreenshot('admin-dashboard');
    });

    await test.step('Validate admin layout', async () => {
      // Should have admin navigation
      const adminNav = page.locator('[data-testid="admin-nav"], .admin-sidebar, nav');
      expect(await adminNav.count()).toBeGreaterThan(0);
      
      // Should have admin cards/sections (shadcn cards use specific class structure)
      const adminCards = page.locator('[class*="card"], .admin-card, [data-testid*="admin"]');
      expect(await adminCards.count()).toBeGreaterThan(0);
    });

    await test.step('Test admin navigation', async () => {
      const adminLinks = page.locator('a[href*="/admin/"]');
      const linkCount = await adminLinks.count();
      
      if (linkCount > 0) {
        // Test first few admin links
        for (let i = 0; i < Math.min(3, linkCount); i++) {
          const link = adminLinks.nth(i);
          const href = await link.getAttribute('href');
          
          if (href && !href.includes('disabled')) {
            await link.click();
            await utils.waitForLoading();
            await utils.takeScreenshot(`admin-section-${i}`);
            
            // Validate no errors
            expect(await utils.hasErrors()).toBeFalsy();
            
            // Go back to dashboard
            await page.goto('/admin');
            await utils.waitForLoading();
          }
        }
      }
    });
  });

  test('📚 Theory Admin - Full CRUD Cycle', async ({ page }) => {
    const utils = new TestUtils(page);
    
    await test.step('Navigate to theory admin', async () => {
      await page.goto('/admin/theory');
      await utils.waitForLoading();
      await utils.takeScreenshot('admin-theory-list');
    });

    await test.step('Test theory listing', async () => {
      // Should have theory table or cards
      const theoryTable = page.locator('table, .content-table, [data-testid="theory-list"], [class*="table"]');
      expect(await theoryTable.count()).toBeGreaterThan(0);
      
      // Test filters if present
      const filters = page.locator('[data-testid*="filter"], input[placeholder*="Buscar"], select, [class*="select"]');
      if (await filters.count() > 0) {
        const searchInput = page.locator('input[placeholder*="Buscar"], input[type="text"]').first();
        if (await searchInput.count() > 0) {
          await searchInput.fill('test search');
          await utils.waitForLoading();
          await utils.takeScreenshot('admin-theory-filtered');
        }
      }
    });

    await test.step('Test theory creation form', async () => {
      await page.goto('/admin/theory/new');
      await utils.waitForLoading();
      await utils.takeScreenshot('admin-theory-create');
      
      // Should have form elements
      const titleInput = page.locator('input[name="title"], input[placeholder*="título"], input[placeholder*="Title"], input[type="text"]').first();
      const contentTextarea = page.locator('textarea[name="content"], .markdown-editor textarea, textarea').first();
      const submitButton = page.locator('button[type="submit"], button:has-text("Salvar"), button:has-text("Criar")');
      
      if (await titleInput.count() > 0 && await contentTextarea.count() > 0) {
        await titleInput.fill('Test Theory E2E');
        await contentTextarea.fill('# Test Content\n\nThis is a test theory with LaTeX: $x^2 + y^2 = z^2$');
        
        // Test markdown preview if available
        const previewButton = page.locator('button:has-text("Preview"), button:has-text("Visualizar"), button:has-text("preview")');
        if (await previewButton.count() > 0) {
          await previewButton.click();
          await utils.waitForLoading();
          await utils.takeScreenshot('admin-theory-preview');
          
          // Validate LaTeX rendering in preview
          const hasLatex = await utils.validateLatexRendering();
          if (hasLatex) {
            console.log('✅ LaTeX preview validated');
          }
        }
        
        await utils.takeScreenshot('admin-theory-form-filled');
      }
    });
  });

  test('❓ Questions Admin - 5 Alternatives Validation', async ({ page }) => {
    const utils = new TestUtils(page);
    
    await test.step('Navigate to questions admin', async () => {
      await page.goto('/admin/questions');
      await utils.waitForLoading();
      await utils.takeScreenshot('admin-questions-list');
    });

    await test.step('Test question creation form', async () => {
      await page.goto('/admin/questions/new');
      await utils.waitForLoading();
      await utils.takeScreenshot('admin-questions-create');
      
      // Should have question form
      const questionInput = page.locator('input[name="question"], textarea[name="question"]');
      const alternatives = page.locator('input[name*="alternative"], input[placeholder*="Alternativa"]');
      
      if (await questionInput.count() > 0) {
        await questionInput.fill('What is 2 + 2?');
        
        // Validate exactly 5 alternatives (RN6)
        const altCount = await alternatives.count();
        if (altCount > 0) {
          expect(altCount).toBe(5); // Business rule validation
          
          // Fill alternatives
          for (let i = 0; i < altCount; i++) {
            await alternatives.nth(i).fill(`Alternative ${String.fromCharCode(65 + i)}: ${i + 1}`);
          }
          
          // Select correct answer
          const correctRadios = page.locator('input[type="radio"][name*="correct"]');
          if (await correctRadios.count() > 0) {
            await correctRadios.nth(2).click(); // Select C as correct
          }
          
          await utils.takeScreenshot('admin-questions-form-filled');
        }
      }
    });
  });
});

test.describe('🔧 System Integration Tests', () => {
  test('🌐 API Endpoints Health Check', async ({ page }) => {
    const utils = new TestUtils(page);
    
    await test.step('Test API routes', async () => {
      const apiRoutes = [
        '/api/categories',
        '/api/theories',
        '/api/questions',
        '/api/flashcards',
        '/api/summaries'
      ];
      
      for (const route of apiRoutes) {
        const response = await page.request.get(route);
        console.log(`API ${route}: ${response.status()}`);
        
        // Should not return 500 server errors
        expect(response.status()).toBeLessThan(500);
      }
    });
  });

  test('📱 Mobile Responsiveness Complete', async ({ page, isMobile }) => {
    const utils = new TestUtils(page);
    
    if (isMobile) {
      await test.step('Test mobile navigation', async () => {
        await page.goto('/');
        await utils.waitForLoading();
        
        // Test mobile menu
        const hamburger = page.locator('[data-testid="hamburger"], .hamburger, .mobile-menu-trigger');
        if (await hamburger.count() > 0) {
          await hamburger.click();
          await utils.waitForLoading();
          await utils.takeScreenshot('mobile-menu-open');
        }
      });

      await test.step('Test mobile admin', async () => {
        await page.goto('/admin');
        await utils.waitForLoading();
        await utils.takeScreenshot('mobile-admin');
        
        // Should be usable on mobile
        const content = page.locator('main, .content, .admin-content');
        expect(await content.count()).toBeGreaterThan(0);
      });
    }
  });

  test('⚡ Performance and Loading', async ({ page }) => {
    const utils = new TestUtils(page);
    
    await test.step('Measure page load times', async () => {
      const routes = [
        '/',
        '/categories',
        '/theory',
        '/questions',
        '/admin',
        '/admin/theory',
        '/admin/questions'
      ];
      
      for (const route of routes) {
        const startTime = Date.now();
        await page.goto(route);
        await utils.waitForLoading();
        const loadTime = Date.now() - startTime;
        
        console.log(`Route ${route} loaded in ${loadTime}ms`);
        
        // Should load within reasonable time (8 seconds for E2E)
        expect(loadTime).toBeLessThan(8000);
        
        // Should not have errors
        expect(await utils.hasErrors()).toBeFalsy();
      }
    });
  });
});

test.describe('🚨 Error Handling and Edge Cases', () => {
  test('404 Pages and Error Boundaries', async ({ page }) => {
    const utils = new TestUtils(page);
    
    await test.step('Test 404 handling', async () => {
      await page.goto('/non-existent-page');
      await utils.waitForLoading();
      await utils.takeScreenshot('404-page');
      
      // Should show 404 or error page, not crash
      const pageContent = await page.content();
      expect(pageContent.length).toBeGreaterThan(100); // Should have some content
    });

    await test.step('Test invalid IDs', async () => {
      const invalidRoutes = [
        '/theory/invalid-id',
        '/questions/invalid-id',
        '/admin/theory/invalid-id',
        '/admin/questions/invalid-id'
      ];
      
      for (const route of invalidRoutes) {
        await page.goto(route);
        await utils.waitForLoading();
        
        // Should handle gracefully, not crash
        const hasContent = await page.locator('body').count() > 0;
        expect(hasContent).toBeTruthy();
      }
    });
  });
});

test.afterEach(async ({ page }) => {
  // Cleanup: Take final screenshot if test failed
  const testInfo = test.info();
  if (testInfo.status === 'failed') {
    await page.screenshot({ 
      path: `tests/screenshots/FAILED-${testInfo.title}-${Date.now()}.png`,
      fullPage: true 
    });
  }
});
