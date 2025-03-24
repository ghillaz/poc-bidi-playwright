import { test, expect } from "@playwright/test";
import { PlaywrightDevPage } from "@/pages/playwright-dev-page";
import { PlaywrightGetStartedPage } from "@/pages/playwright-getstarted-page";
import { PlaywrightPOMPage } from "@/pages/playwright-pom-page";

test("getting started should contain table of contents", async ({ page }) => {
  const playwrightDev = new PlaywrightDevPage(page);
  const playwrightGetStarted = new PlaywrightGetStartedPage(page);

  await playwrightDev.goToUrl();
  await playwrightDev.checkTitle();
  await playwrightDev.goToGetStartedPage();
  await playwrightGetStarted.validateGetStartedHeader();
  await playwrightGetStarted.validateTocList();
});

test("should show Page Object Model article", async ({ page }) => {
  const playwrightDev = new PlaywrightDevPage(page);
  const playwrightGetStarted = new PlaywrightGetStartedPage(page);
  const playwrightPOM = new PlaywrightPOMPage(page);

  await playwrightDev.goToUrl();
  await playwrightDev.goToGetStartedPage();
  await playwrightGetStarted.goToPageObjectModelPage();
  await playwrightPOM.validatePageObjectModelArticle();
});
