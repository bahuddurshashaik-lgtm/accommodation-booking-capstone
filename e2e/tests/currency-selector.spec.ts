import { test, expect } from '@playwright/test';

import { SearchResultsPage } from '../util/pages/SearchResultsPage';
import { PropertyDetailsPage } from '../util/pages/PropertyDetailsPage';
import { CheckoutQuotePage } from '../util/pages/CheckoutQuotePage';

import { getTestSearchCriteria } from '../util/fixtures/testData';
import { expectConverted, RATES, } from '../util/helpers/money';

describe('Currency Selector - EPMCDMETST-71235', () => {
  test('selector options are limited to USD/EUR/GBP (Search + Details)', async ({ page }) => {
    const c = getTestSearchCriteria();
    const results = new SearchResultsPage(page);

    await results.goto(c);
    const opts = await results.getCurrencyOptions();
    expect(opts.sort()).toEqual(['EUR', 'GBP', 'USD']);

    const detailsUrl = await results.openFirstPropertyDetails();
    const details = new PropertyDetailsPage(page);
    await details.waitForLoad();

    const optsDetails = await details.getCurrencyOptions();
    expect(optsDetails.sort()).toEqual(['EUR', 'GBP', 'USD']);

    // avoid unused var enforcement in some lant configs
    expect(detailsUrl).toBeTruthy();
  });

  test('changing currency on Search updates prices and conversion matches backend rates', async ({ page }) => {
    const c = getTestSearchCriteria();
    const results = new SearchResultsPage(page);

    await results.goto(c);

    await results.selectCurrency('USD');
    const usd = await results.readVisiblePriceFields();

    await results.selectCurrency('EUR');
    const eur = await results.readVisiblePriceFields();

    await results.selectCurrency('GBP');
    const gbp = await results.readVisiblePriceFields();

    // Validate conversion for whatever is displayed on this page
    expectConverted(usd, eur, RATES.EUR);
    expectConverted(usd, gbp, RATES.GBP);
  });

  test('currency persists Search → Details → Checkout/Quote', async ({ page }) => {
    const c = getTestSearchCriteria();
    const results = new SearchResultsPage(page);

    await results.goto(c);
    await results.selectCurrency('EUR');
    await expect.poll(async () => results.getSelectedCurrency()).toBe('EUR');

    await results.openFirstPropertyDetails();
    const details = new PropertyDetailsPage(page);
    await details.waitForLoad();
    await expect.poll(async () => details.getSelectedCurrency()).toBe('EUR');

    // Proceed to checkout/quote (app may label this as Quote)
    await details.proceedToCheckoutOrQuote();
    const checkout = new CheckoutQuotePage(page);
    await checkout.waitForLoad();

    const checkoutPrices = await checkout.readVisiblePriceFields();
    // At minimum, every visible field should be marked as EUR
    expect(checkoutPrices.currencyCode).toBe('EUR');
  });

  test('currency persists after refresh on Search + Details + Checkout/Quote', async ({ page }) => {
    const c = getTestSearchCriteria();
    const results = new SearchResultsPage(page);

    await results.goto(c);
    await results.selectCurrency('GBP');
    await page.reload();
    await expect.poll(async () => results.getSelectedCurrency()).toBe('GBP');

    await results.openFirstPropertyDetails();
    const details = new PropertyDetailsPage(page);
    await details.waitForLoad();
    await page.reload();
    await expect.poll(async () => details.getSelectedCurrency()).toBe('GBP');

    await details.proceedToCheckoutOrQuote();
    const checkout = new CheckoutQuotePage(page);
    await checkout.waitForLoad();
    await page.reload();
    const checkoutPrices = await checkout.readVisiblePriceFields();
    expect(checkoutPrices.currencyCode).toBe('GBP');
  });
});
