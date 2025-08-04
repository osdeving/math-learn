import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests
 * 
 * These tests take screenshots and compare with baseline images
 * to detect any visual regressions or layout issues.
 */

test.describe('📸 Visual Regression Tests', () => {
  test('Homepage visual comparison', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Hide dynamic content (dates, counters, etc.)
    await page.addStyleTag({
      content: `
        [data-dynamic="true"],
        .dynamic-content,
        .timestamp,
        .counter {
          visibility: hidden !important;
        }
      `
    });
    
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('Admin dashboard visual comparison', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('admin-dashboard.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('Mobile homepage visual comparison', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('mobile-homepage.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('Theory form visual comparison', async ({ page }) => {
    await page.goto('/admin/theory/new');
    await page.waitForLoadState('networkidle');
    
    // Fill form for consistent state
    await page.fill('input[name="title"]', 'Sample Theory Title');
    await page.fill('textarea', '# Sample Content\n\nThis is sample content with LaTeX: $x^2 + y^2 = z^2$');
    
    await expect(page).toHaveScreenshot('theory-form.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });
});
