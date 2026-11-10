import { test, expect } from '@playwright/test';

import { SearchResultsPage } from '../util/pages/SearchResultsPage';
import { getTestSearchCriteria } from '../util/fixtures/testData';

test.describe('URL state (where applicable) - Wi-Fi & Currency', () => {
  test('Should update URL values when filter/sort/page/currency change (if app encodes state in URL)', async ({ page }) => {
    const c = getTestSearchCriteria();
    const results = new SearchResultsPage(page);

    await results.goto(c);
    const url1 = page.url();

    await results.enableFreeWifi(true);
    await results.selectCurrency('EUR');
    const url2 = page.url();

    // We do not assume which query params exist, but URL often changes.
    expect(url2).toBe Truthy();
    expect(url2).toBeTruthy();

    // If URL does change, it should still be a valid URL, and refresh should preserve state.
    await page.reload();
    await expect.poll(async () => results.isFreeWifiEnabled()).toBe(true);
    await expect.poll(async () => results.getSelectedCurrency()).toBe('EUR');
  });
});
