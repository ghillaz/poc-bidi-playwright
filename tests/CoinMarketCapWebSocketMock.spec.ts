import { test, expect } from '@playwright/test';
import { CoinMarketCapPage } from "@/pages/coinmarketcap-page";

// Mocked responses for different WebSocket subscriptions
const mockResponse5s = {
  d: {
    id: 1,
    p: 50,
    p24h: 1,
    p7d: 1,
    p30d: 1,
    p3m: 1,
    p1y: 1,
    pytd: 1,
    pall: 1,
    as: 1,
    mc: 1,
    fmc24hpc: 1
  },
  t: String(Date.now()),
  c: "main-site@crypto_price_5s@1@normal"
};

const mockResponse15s = {
  d: {
    id: 1,
    p: 50,
    v: 1,
    p1h: 1,
    p24h: 1,
    p7d: 1,
    p30d: 1,
    p3m: 1,
    p1y: 1,
    pytd: 1,
    pall: 1,
    ts: 1,
    as: 1,
    fmc: 1,
    mc: 1,
    mc24hpc: 1,
    vol24hpc: 1,
    fmc24hpc: 1,
    d: 1,
    vd: 1
  },
  t: String(Date.now()),
  c: "main-site@crypto_price_15s@1@detail"
};

test.beforeEach(async ({ page }) => {

  await page.routeWebSocket(`${process.env.WEB_SOCKET_URL}`, ws => {
    ws.onMessage(message => {

      const messageStr = message.toString();
      console.log('Intercepted WebSocket message:', message);

      const parsedMessage = JSON.parse(messageStr);
      const subscription = parsedMessage.params?.[0];

      if (subscription?.includes("crypto_price_5s")) {
        console.log('Sending mocked response for 5s:', JSON.stringify(mockResponse5s));
        ws.send(JSON.stringify(mockResponse5s));
      }

      if (subscription?.includes("crypto_price_15s")) {
        console.log('Sending mocked response for 15s:', JSON.stringify(mockResponse15s));
        ws.send(JSON.stringify(mockResponse15s));
      }
    });
  });
});

test('Mock WebSocket messages and verify price update', async ({ page }) => {
  const coinMarketCapPage = new CoinMarketCapPage(page);

  // Note that only `WebSocket`s created after this method was called will be routed. It is recommended to call this
  // method before navigating the page.
  await page.goto(`${process.env.BTC_URL}`);

  // Wait for the page to load -> Flaky Test
  await coinMarketCapPage.assertVisibilityChartElement()
  await coinMarketCapPage.assertVisibilityBuyBtcButtonElement()

  await coinMarketCapPage.assertVisibilityPriceElement()
  const priceText = await coinMarketCapPage.getInnerTextPriceElement();
  console.log('Price text on page:', priceText);
  const cleanedPrice = priceText.replace(/[^0-9.-]+/g, '');
  console.log('Cleaned price:', cleanedPrice);
  expect(parseFloat(cleanedPrice)).toBe(mockResponse5s.d.p);
});
