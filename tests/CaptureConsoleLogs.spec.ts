import { test, expect } from "@playwright/test";

// Example 3: Capture Console Logs
test("Capture console errors on Playwright website", async ({ page }) => {
  page.on("console", (msg) => console.log(`Console Log: ${msg.text()}`));
  page.on("pageerror", (error) => console.error(`Page Error: ${error.message}`));

  await page.goto("https://playwright.dev/");
  await page.evaluate(() => console.error("This is a test error"));
});
