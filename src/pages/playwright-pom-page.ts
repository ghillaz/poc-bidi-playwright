import { expect, type Locator, type Page } from "@playwright/test";

export class PlaywrightPOMPage {
  readonly page: Page;
  readonly pageArticle: Locator;

  // Elements on the page
  constructor(page: Page) {
    this.page = page;
    this.pageArticle = page.locator("article")
  }

  // Expect the page to contain a specific text.
  async validatePageObjectModelArticle() {
    await expect(this.pageArticle)
      .toContainText("Page Object Model is a common pattern");
  }
}
