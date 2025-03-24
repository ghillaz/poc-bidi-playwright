import { test, expect } from "@playwright/test";
import { CoinMarketCapPage } from "@/pages/coinmarketcap-page";

test("Mock WebSocket messages on CoinMarketCap and debug", async ({ page }) => {
  const coinMarketCapPage = new CoinMarketCapPage(page);

  // Intercept and mock WebSocket
  await page.routeWebSocket(`${process.env.WEB_SOCKET_URL}`, (ws) => {
    ws.onMessage((message) => {
      console.log("Intercepted message:", message);
      const mockResponse = { method: "SUBSCRIPTION_UPDATE", params: ["potatoes"] };
      console.log("Sending mocked response:", JSON.stringify(mockResponse));
      ws.send(JSON.stringify(mockResponse)); // Send mocked message
    });
  });

  // Navigate to the site
  await page.goto(`${process.env.BTC_URL}`);

  // Force UI update by setting 'potatoes' in the page using data-test attribute
  await page.evaluate(() => {
    const priceElement = document.querySelector('[data-test="text-cdp-price-display"]') as HTMLElement;
    if (priceElement) {
      priceElement.innerText = "potatoes";
    }
  });

  // Pause execution for debugging
  // await page.pause();

  // Verify page title as a simple assertion
  await expect(page).toHaveTitle(/Bitcoin/i);
});
