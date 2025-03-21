import { expect, type Locator, type Page } from "@playwright/test";

export class CoinMarketCapPage {
  readonly page: Page;
  readonly priceElement: Locator;
  readonly chartElement: Locator;
  readonly buyBtcButton: Locator;

  // Elements on the page
  constructor(page: Page) {
    this.page = page;
    this.priceElement = page.locator('[data-test="text-cdp-price-display"]');
    this.chartElement = page.locator('.highcharts-background');
    this.buyBtcButton = page.locator('div[data-role="btn-content-item"]');

  }

  async assertVisibilityPriceElement()  {
    await expect(this.priceElement).toBeVisible();
  }

  async getInnerTextPriceElement()  {
    return await (this.priceElement).innerText();
  }

  async assertVisibilityChartElement()  {
    await expect(this.chartElement).toBeVisible();
  }

  async assertVisibilityBuyBtcButtonElement()  {
    await expect(this.chartElement).toBeVisible();
  }

}
