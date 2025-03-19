import { test, expect } from '@playwright/test';

test('Mock WebSocket messages on CoinMarketCap and debug', async ({ page }) => {
  // Intercept and mock WebSocket
  await page.routeWebSocket('wss://push.coinmarketcap.com/ws?device=web&client_source=coin_detail_page', ws => {
    ws.onMessage(message => {
      console.log('Intercepted message:', message);
      const mockResponse = { method: "SUBSCRIPTION_UPDATE", params: ["potatoes"] };
      console.log('Sending mocked response:', JSON.stringify(mockResponse));
      ws.send(JSON.stringify(mockResponse)); // Send mocked message
    });
  });

  // Navigate to the site
  await page.goto('https://coinmarketcap.com/currencies/bitcoin/');

  // Force UI update by setting 'potatoes' in the page using data-test attribute
  await page.evaluate(() => {
    const priceElement = document.querySelector('[data-test="text-cdp-price-display"]') as HTMLElement;
    if (priceElement) {
      priceElement.innerText = 'potatoes';
    }
  });


  // Pause execution for debugging
  await page.pause();

  // Verify page title as a simple assertion
  await expect(page).toHaveTitle(/Bitcoin/i);
});
