import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Enable headed mode for debugging
test.use({ headless: false });

// Example 1: Intercept and Replace an Image with a Local File
test('Intercept and replace image with a local file', async ({ page }) => {
  const imagePath = 'iologo.png'; // Change this to your actual image path
  const imageBuffer = fs.readFileSync(imagePath);

  await page.route('**/img/logos/Browsers.png', async (route) => {
    await route.fulfill({
      contentType: 'image/png',
      body: imageBuffer,
    });
  });

  await page.goto('https://playwright.dev/');
  console.log('Replaced Browsers.png with a local image.');
});
