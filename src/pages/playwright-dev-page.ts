import { expect, type Locator, type Page } from "@playwright/test";

export class PlaywrightDevPage {
  readonly page: Page;
  readonly getStartedButton: Locator;
  readonly getStartedFooterLink: Locator;
  readonly new: Locator; // Example of using xpath

  // Elements on the page
  constructor(page: Page) {
    this.page = page;
    this.getStartedButton = page.locator("a", { hasText: "Get started" });
    this.getStartedFooterLink = page.locator(".footer__link-item",
      { hasText: "Getting started" });
  }

  // Go to the Playwright.dev page by URL
  async goToUrl() {
    await this.page.goto(`${process.env.BASE_URL}`);
  }

  // Expect a title "to contain" a substring.
  async checkTitle() {
    await expect(this.page).toHaveTitle(/Playwright/);
  }

  // Click "Get started" button, expect the "Installation" header to be visible.
  async goToGetStartedPage() {
    await expect(this.getStartedFooterLink).toContainText("Getting started");
    await this.getStartedButton.first().click();
  }

}
