import { expect, type Locator, type Page } from "@playwright/test";

export class CoinMarketCapPage {
  readonly page: Page;
  readonly priceElement: Locator;
  readonly chartElement: Locator;
  readonly buyBtcButton: Locator;
  readonly loadingChart: Locator;

  // Elements on the page
  constructor(page: Page) {
    this.page = page;
    this.priceElement = page.locator('[data-test="text-cdp-price-display"]');
    this.chartElement = page.locator(".highcharts-background");
    this.buyBtcButton = page.locator('div[data-role="btn-content-item"]');
    this.loadingChart = page.locator("p").filter({ hasText: "Please wait a moment." });
  }

  async assertVisibilityPriceElement() {
    await expect(this.priceElement).toBeVisible();
  }

  async getInnerTextPriceElement() {
    return await this.priceElement.innerText();
  }

  async assertVisibilityChartElement() {
    const loadingChartElements = await this.loadingChart.all();
    for (const loadingElement of loadingChartElements) {
      await expect(loadingElement).toBeHidden();
    }q

    await expect(this.chartElement).toBeVisible();
  }

  async assertVisibilityBuyBtcButtonElement() {
    await expect(this.chartElement).toBeVisible();
  }
}
