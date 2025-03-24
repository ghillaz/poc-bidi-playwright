import { test, expect } from '@playwright/test';

// Example 4: Performance Metrics via DevTools Protocol
test('Get performance metrics on Playwright website', async ({ page, browser }) => {
  const context = await browser.newContext();
  const client = await context.newCDPSession(page);
  await client.send('Performance.enable');
  await page.goto('https://playwright.dev/');

  const metrics = await client.send('Performance.getMetrics');
  console.log(metrics);
});

