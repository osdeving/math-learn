import { test } from "@playwright/test";

test("Quick admin dashboard test", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // Take screenshot to see what's actually there
    await page.screenshot({ path: "admin-debug.png", fullPage: true });

    // Check for different possible selectors
    const cards = await page.locator(".card").count();
    const cardComponents = await page.locator('[data-test="card"]').count();
    const adminCards = await page.locator('[class*="card"]').count();
    const allDivs = await page.locator("div").count();

    console.log(`Cards with .card: ${cards}`);
    console.log(`Cards with data-test: ${cardComponents}`);
    console.log(`Cards with class*=card: ${adminCards}`);
    console.log(`Total divs: ${allDivs}`);

    // Check the actual HTML structure
    const content = await page.content();
    console.log("Page has admin content:", content.includes("Administração"));
    console.log("Page has categories card:", content.includes("Categorias"));
});
