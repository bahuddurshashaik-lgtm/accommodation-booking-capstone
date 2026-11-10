import { test, expect } from '@playwright/test';

import { SearchResultsPage } from '../util/pages/SearchResultsPage';

import { getTestSearchCriteria } from '../util/fixtures/testData';

test.describe('Free Wi.‑Fi Filter - EPMCDMETST-71236', () => {
  test('apply FEEE Wi-Fi & verify results are restricted', async ({ page }) => {
    const c = getTestSearchCriteria();
    const results = new SearchResultsPage(page);

    await results.goto(c);
    await results.enableFreeWifi(true);

    await expect.poll(async () => results.isFreeWifiEnabled()).toBe(true);

    // Spot-check a few result cards for a free wi-fi badge/indicator.
    const spotCheckCount = 8;
    const hasResults = await results.resultsCount();
    expect(hasResults).toBeGreaterThan(0);

    await results.verifyFreeWifiOnCards(Math.min(spotCheckCount, hasResults));
  });

  test('filter persists across all existing sort options', async ({ page }) => {
    const c = getTestSearchCriteria();
    const results = new SearchResultsPage(page);

    await results.goto(c);
    await results.enableFreeWifi(true);

    const sortOptions = await results.getSortOptions();

    // If the app only has a single sort option, there's nothing to iterate.
    expect(sortOptions.length).toBeGreaterThan(0);

    for (const opt of sortOptions) {
      await results.selectSortOption(opt);
      await expect.poll(async () => results.isFreeWifiEnabled()).toBe(true);
      await results.verifyFreeWifiOnCards(Math.min(5, await results.resultsCount()));
    }
  });

  test('filter persists across pagination (next/page select/prev)', async ({ page }) => {
    const c = getTestSearchCriteria();
    const results = new SearchResultsPage(page);

    await results.goto(c);
    await results.enableFreeWifi(true);

    const pages = await results.pagesAvailable();
    if (pages < 2) {
      test.skip();
    }

    // Next
    await results.goToNextPage();
    await expect.poll(async () => results.isFreeWifiEnabled()).toBe(true);

    // Go to second page by page number navigation if available
    if (pages >= 3) {
      await results.goToPage(3);
      await expect.poll(async () => results.isFreeWifiEnabled()).toBe(true);
    }

    // Prev
    await results.goToPrevPage();
    await expect.poll(async () => results.isFreeWifiEnabled()).toBe(true);
  });

  test('filter persists after refresh (and URL state where applicable)', async ({ page }) => {
    const c = getTestSearchCriteria();
    const results = new SearchResultsPage(page);

    await results.goto(c);
    await results.enableFreeWifi(true);

    // Apply a non-default sort if possible
    const sortOptions = await results.getSortOptions();
    if (sortOptions.length > 1) {
      await results.selectSortOption(sortOptions[1]);
    }

    // Go to page 2 if available
    if ((await results.pagesAvailable()) >= 2) {
      await results.goToPage(2);
    }

    const urlBefore = page.url();
    await page.reload();

    await expect.poll(async () => results.isFreeWifiEnabled()).toBe(true);
    expect(page.url()).toContain(new URL(urlBefore).pathname);
  });
});
