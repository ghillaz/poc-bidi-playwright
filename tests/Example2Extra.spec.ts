import { test, expect } from '@playwright/test';

// Mocked data with fixed values
const mockResponse = {
  d: {
    id: 1,
    p: 50,  // Mocked current price
    p24h: 1,      // Mocked 24h price change
    p7d: 1,       // Mocked 7d price change
    p30d: 1,      // Mocked 30d price change
    p3m: 1,       // Mocked 3-month price change
    p1y: 1,       // Mocked 1-year price change
    pytd: 1,      // Mocked year-to-date change
    pall: 1,      // Mocked total market value
    as: 1,        // Mocked 24h trading volume
    mc: 1,        // Mocked market cap
    fmc24hpc: 1   // Mocked 24-hour percentage change
  },
  t: String(Date.now()), // Current timestamp
  c: "main-site@crypto_price_5s@1@normal"
};

test('Mock WebSocket messages on CoinMarketCap and check price update', async ({ page }) => {
  // Set up a flag in the browser context to track mock response reception
  await page.evaluate(() => {
    window.mockPriceReceived = false; // Initialize the flag in the browser context
  });

  let mockResponseReceived = false;

  // Intercept and mock WebSocket
  await page.routeWebSocket(`${process.env.WEB_SOCKET_URL}`, ws => {
    ws.onMessage(message => {
      console.log('Intercepted message:', message);

      // Send mocked response only once and block further updates
      if (!mockResponseReceived) {
        console.log('Sending mocked response:', JSON.stringify(mockResponse));
        ws.send(JSON.stringify(mockResponse)); // Send mocked message
        mockResponseReceived = true; // Mark the mock response as sent

        // Ensure no other WebSocket messages are processed after sending the mock response
        ws.close(); // Close WebSocket connection after sending mock response
      }
    });
  });

  // Navigate to the site
  await page.goto(`${process.env.BTC_URL}`);

  // Wait for the price element to load
  const priceElement = await page.waitForSelector('[data-test="text-cdp-price-display"]');

  // Add logging inside waitForFunction to help track the flag status in the browser context
  await page.waitForFunction(() => {
    console.log('Checking flag status:', window.mockPriceReceived); // Log flag status
    return window.mockPriceReceived === true;
  });

  // Get the price displayed on the page
  const priceText = await priceElement.innerText();
  console.log('Price text on page:', priceText);

  // Clean the price text to remove any non-numeric characters except for the decimal and minus sign
  const cleanedPrice = priceText.replace(/[^0-9.-]+/g, ''); // Remove '$' and other non-numeric characters

  console.log('Cleaned price:', cleanedPrice); // Log the cleaned price

  // Assert that the displayed price matches the mocked price
  expect(parseFloat(cleanedPrice)).toBe(mockResponse.d.p); // Compare cleaned price to mockResponse.d.p

  // Pause execution for debugging
  await page.pause();
});
