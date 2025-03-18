import { expect, type Locator, type Page } from "@playwright/test";

export class PlaywrightGetStartedPage {
  readonly page: Page;
  readonly getStartedInstallationHeader: Locator;
  readonly getInstallationHeader: Locator;
  readonly pomLink: Locator;
  readonly tocList: Locator;

  // Elements on the page
  constructor(page: Page) {
    this.page = page;
    this.getStartedInstallationHeader = page.locator("h1",
      { hasText: "Installation" });
    //this.new = page.locator('xpath=//a[contains(text(), "New")]'); // Example of using xpath
    this.getInstallationHeader = page.getByRole("heading",
      { name: "Installation" }); //other way to get the locator
    this.pomLink = page.locator("li", { hasText: "Guides" }).locator("a", {
      //hasText: 'Page Object Model', // ATTENTION TO THIS
      hasText: /^Page object models$/, // Case-sensitive text using regex
    });
    this.tocList = page.locator("article div.markdown ul > li > a");
  }

  // Click "Get started" button, expect the "Installation" header to be visible.
  async validateGetStartedHeader() {
    await expect(this.getStartedInstallationHeader).toBeVisible();
    await expect(this.getInstallationHeader).toBeVisible();
  }

  //Expect tocList Links to contain specific text.
  async validateTocList() {
    await expect(this.tocList).toHaveText([
      `How to install Playwright`,
      `What's Installed`,
      `How to run the example test`,
      `How to open the HTML test report`,
      `Write tests using web first assertions, page fixtures and locators`,
      `Run single test, multiple tests, headed mode`,
      `Generate tests with Codegen`,
      `See a trace of your tests`,
    ])
  }

  // Click "Page Object Model" link.
  async goToPageObjectModelPage() {
    await this.pomLink.click();
  }

}
