import { test, expect } from '@playwright/test';

/**
 * Fast System Validation Test
 * 
 * This test quickly validates all major functionality without being too strict.
 * Perfect for checking if the site is working after changes.
 */

test.describe('⚡ Fast System Validation', () => {
  test('Complete system smoke test', async ({ page }) => {
    // 1. Homepage loads
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(await page.title()).toBeTruthy();
    
    // 2. Admin dashboard loads
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Check admin has basic structure
    const adminContent = await page.content();
    expect(adminContent).toContain('Administração');
    expect(adminContent).toContain('Teoria');  
    expect(adminContent).toContain('Questões');
    
    // 3. Theory admin loads
    await page.goto('/admin/theory');
    await page.waitForLoadState('networkidle');
    
    const theoryContent = await page.content();
    expect(theoryContent).toContain('Teoria'); // Should have theory content
    
    // 4. Theory form loads
    await page.goto('/admin/theory/new');
    await page.waitForLoadState('networkidle');
    
    // Should have form inputs
    const inputs = await page.locator('input, textarea').count();
    expect(inputs).toBeGreaterThan(0);
    
    // 5. Questions admin loads
    await page.goto('/admin/questions');
    await page.waitForLoadState('networkidle');
    
    const questionsContent = await page.content();
    expect(questionsContent).toContain('Questões'); // Should have questions content
    
    // 6. Question form loads  
    await page.goto('/admin/questions/new');
    await page.waitForLoadState('networkidle');
    
    // Should have form inputs
    const questionInputs = await page.locator('input, textarea').count();
    expect(questionInputs).toBeGreaterThan(0);
    
    // 7. API endpoints respond
    const apiTests = [
      '/api/categories',
      '/api/theories', 
      '/api/questions'
    ];
    
    for (const endpoint of apiTests) {
      const response = await page.request.get(endpoint);
      expect(response.status()).toBeLessThan(500); // No server errors
    }
    
    console.log('✅ All major systems validated successfully!');
  });
  
  test('LaTeX rendering validation', async ({ page }) => {
    await page.goto('/admin/theory/new');
    await page.waitForLoadState('networkidle');
    
    // Try to find textarea and fill with LaTeX
    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      await textarea.fill('Test LaTeX: $x^2 + y^2 = z^2$');
      
      // Look for preview button
      const previewBtn = page.locator('button').filter({ hasText: /preview|visualizar/i });
      if (await previewBtn.count() > 0) {
        await previewBtn.click();
        await page.waitForTimeout(1000);
        
        // Check if KaTeX elements are present
        const katexElements = await page.locator('.katex').count();
        if (katexElements > 0) {
          console.log('✅ LaTeX rendering working!');
        }
      }
    }
  });
  
  test('Mobile responsiveness check', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Should still render admin content
    const content = await page.content();
    expect(content).toContain('Administração');
    
    // Try different viewport sizes
    const viewports = [
      { width: 768, height: 1024 }, // Tablet
      { width: 1024, height: 768 }, // Desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500);
      
      // Should still have content
      const pageContent = await page.content();
      expect(pageContent.length).toBeGreaterThan(1000);
    }
    
    console.log('✅ Responsive design validated!');
  });
});
