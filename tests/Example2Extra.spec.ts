import { test, expect } from '@playwright/test';

// Mocked responses for different WebSocket subscriptions
const mockResponse5s = {
  d: { id: 1, p: 50, p24h: 1, p7d: 1, p30d: 1, p3m: 1, p1y: 1, pytd: 1, pall: 1, as: 1, mc: 1, fmc24hpc: 1 },
  t: String(Date.now()),
  c: "main-site@crypto_price_5s@1@normal"
};

const mockResponse15s = {
  d: { id: 1, p: 50, p24h: 1, p7d: 1, p30d: 1, p3m: 1, p1y: 1, pytd: 1, pall: 1, as: 1, mc: 1, fmc24hpc: 1 },
  t: String(Date.now()),
  c: "main-site@crypto_price_15s@1@detail"
};

test.beforeEach(async ({ page }) => {
  let mock5sSent = false;
  let mock15sSent = false;

  await page.routeWebSocket(`${process.env.WEB_SOCKET_URL}`, ws => {
    ws.onMessage(message => {
      const messageStr = message.toString();
      console.log('Intercepted WebSocket message:', message);

      const parsedMessage = JSON.parse(messageStr);
      const subscription = parsedMessage.params?.[0];

      if (subscription?.includes("crypto_price_5s") && !mock5sSent) {
        console.log('Sending mocked response for 5s:', JSON.stringify(mockResponse5s));
        ws.send(JSON.stringify(mockResponse5s));
        mock5sSent = true;
      }

      if (subscription?.includes("crypto_price_15s") && !mock15sSent) {
        console.log('Sending mocked response for 15s:', JSON.stringify(mockResponse15s));
        ws.send(JSON.stringify(mockResponse15s));
        mock15sSent = true;
      }
    });
  });
});

test('Mock WebSocket messages and verify price update', async ({ page }) => {
  await page.goto(`${process.env.BTC_URL}`);

  const priceElement = await page.waitForSelector('[data-test="text-cdp-price-display"]');
  await priceElement.waitForElementState('visible');

  await page.waitForTimeout(5000); // Allow time for UI to process WebSocket updates

  const priceText = await priceElement.innerText();
  console.log('Price text on page:', priceText);

  const cleanedPrice = priceText.replace(/[^0-9.-]+/g, '');
  console.log('Cleaned price:', cleanedPrice);

  expect(parseFloat(cleanedPrice)).toBe(mockResponse5s.d.p);
  await page.pause();
});
