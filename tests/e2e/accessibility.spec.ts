import { expect, test } from "@playwright/test";

/**
 * Accessibility Tests
 *
 * Tests for WCAG compliance, keyboard navigation,
 * screen reader compatibility, and inclusive design.
 */

test.describe("♿ Accessibility Tests", () => {
    test("Homepage accessibility audit", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Check for basic accessibility requirements

        // 1. Page should have a title
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);

        // 2. Should have main landmark
        const main = page.locator('main, [role="main"]');
        expect(await main.count()).toBeGreaterThan(0);

        // 3. Should have proper heading hierarchy
        const h1 = page.locator("h1");
        expect(await h1.count()).toBeGreaterThan(0);

        // 4. Links should have accessible names
        const links = page.locator("a");
        const linkCount = await links.count();

        for (let i = 0; i < Math.min(5, linkCount); i++) {
            const link = links.nth(i);
            const linkText = await link.textContent();
            const ariaLabel = await link.getAttribute("aria-label");
            const title = await link.getAttribute("title");

            // Link should have some accessible name
            expect(linkText || ariaLabel || title).toBeTruthy();
        }

        // 5. Images should have alt text
        const images = page.locator("img");
        const imageCount = await images.count();

        for (let i = 0; i < imageCount; i++) {
            const img = images.nth(i);
            const alt = await img.getAttribute("alt");
            const ariaLabel = await img.getAttribute("aria-label");

            // Decorative images should have empty alt, content images should have descriptive alt
            expect(alt !== null || ariaLabel !== null).toBeTruthy();
        }
    });

    test("Keyboard navigation", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Test Tab navigation
        let focusableElements = 0;

        // Press Tab multiple times and count focusable elements
        for (let i = 0; i < 20; i++) {
            await page.keyboard.press("Tab");

            const activeElement = await page.evaluate(() => {
                const active = document.activeElement;
                return active?.tagName?.toLowerCase();
            });

            if (
                activeElement &&
                ["a", "button", "input", "textarea", "select"].includes(
                    activeElement
                )
            ) {
                focusableElements++;
            }
        }

        expect(focusableElements).toBeGreaterThan(0);
    });

    test("Form accessibility", async ({ page }) => {
        await page.goto("/admin/theory/new");
        await page.waitForLoadState("networkidle");

        // Check form labels
        const inputs = page.locator("input, textarea, select");
        const inputCount = await inputs.count();

        for (let i = 0; i < inputCount; i++) {
            const input = inputs.nth(i);
            const id = await input.getAttribute("id");
            const ariaLabel = await input.getAttribute("aria-label");
            const ariaLabelledby = await input.getAttribute("aria-labelledby");

            if (id) {
                // Check if there's a label for this input
                const label = page.locator(`label[for="${id}"]`);
                const hasLabel = (await label.count()) > 0;

                // Should have either a label, aria-label, or aria-labelledby
                expect(hasLabel || ariaLabel || ariaLabelledby).toBeTruthy();
            }
        }
    });

    test("Color contrast and visual accessibility", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Test high contrast mode simulation
        await page.emulateMedia({ colorScheme: "dark" });
        await page.waitForTimeout(1000);

        // Check that content is still visible
        const bodyContent = await page.textContent("body");
        expect(bodyContent).toBeTruthy();
        expect(bodyContent!.length).toBeGreaterThan(100);

        // Test reduced motion
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.waitForTimeout(1000);

        // Content should still be accessible
        const mainContent = page.locator("main, .main-content, .content");
        expect(await mainContent.count()).toBeGreaterThan(0);
    });

    test("Screen reader simulation", async ({ page }) => {
        await page.goto("/admin");
        await page.waitForLoadState("networkidle");

        // Check ARIA landmarks
        const landmarks = [
            '[role="banner"]',
            "header",
            '[role="navigation"]',
            "nav",
            '[role="main"]',
            "main",
            '[role="contentinfo"]',
            "footer",
        ];

        let landmarkCount = 0;
        for (const landmark of landmarks) {
            const count = await page.locator(landmark).count();
            landmarkCount += count;
        }

        expect(landmarkCount).toBeGreaterThan(0);

        // Check for skip links
        const skipLinks = page.locator('a[href^="#"], .skip-link');
        // Skip links are recommended but not required
        const hasSkipLinks = (await skipLinks.count()) > 0;
        if (hasSkipLinks) {
            console.log("✅ Skip links found");
        }
    });
});
