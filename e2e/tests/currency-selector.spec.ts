import { test, expect } from '@playwright/test';

test.describe('Currency Selector - EPMCDMETST-71235', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should change currency and update all prices', async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(2000);

    // Verify initial currency is USD
    expect(page.url()).toMatch(/currency=USD|^[^?]*$/);

    // Change to EUR
    await page.selectOption('#currency', 'EUR');
    await page.waitForTimeout(2000);

    // Verify URL has currency parameter
    expect(page.url()).toContain('currency=EUR');

    // Verify prices now show EUR symbol by checking page content
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('€');

    // Change to GBP
    await page.selectOption('#currency', 'GBP');
    await page.waitForTimeout(2000);

    // Verify URL updated
    expect(page.url()).toContain('currency=GBP');

    // Verify prices now show GBP symbol
    const gbpContent = await page.textContent('body');
    expect(gbpContent).toContain('£');
  });

  test('should persist currency when navigating to property details', async ({ page }) => {
    // Change currency to EUR
    await page.selectOption('#currency', 'EUR');
    await page.waitForTimeout(2000);

    // Click on first property
    await page.click('a:has-text("View Details")');
    await page.waitForTimeout(2000);

    // Verify property details page has EUR in URL
    expect(page.url()).toContain('currency=EUR');

    // Verify page shows EUR symbol
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('€');

    // Verify currency selector shows EUR
    const selectedCurrency = await page.locator('#currency').inputValue();
    expect(selectedCurrency).toBe('EUR');
  });

  test('should persist currency when getting booking quote', async ({ page }) => {
    // Change currency to GBP
    await page.selectOption('#currency', 'GBP');
    await page.waitForTimeout(2000);

    // Click on first property
    await page.click('a:has-text("View Details")');
    await page.waitForTimeout(2000);

    // Get booking quote
    await page.fill('#nights', '3');
    await page.click('button:has-text("Calculate")');
    await page.waitForTimeout(2000);

    // Verify quote shows GBP prices
    const quoteText = await page.locator('h4:has-text("Quote Summary")').textContent();
    expect(quoteText).toBeTruthy();

    const bodyContent = await page.textContent('body');
    expect(bodyContent).toContain('£');
  });

  test('should update currency on property details page', async ({ page }) => {
    // Go to property details with default USD
    await page.click('a:has-text("View Details")');
    await page.waitForTimeout(2000);

    // Verify initial currency is USD
    let bodyContent = await page.textContent('body');
    expect(bodyContent).toContain('$');

    // Change to EUR on property page
    await page.selectOption('#currency', 'EUR');
    await page.waitForTimeout(2000);

    // Verify price updated to EUR
    bodyContent = await page.textContent('body');
    expect(bodyContent).toContain('€');

    // Verify URL updated
    expect(page.url()).toContain('currency=EUR');
  });

  test('should maintain currency across multiple page interactions', async ({ page }) => {
    // Set currency to EUR
    await page.selectOption('#currency', 'EUR');
    await page.waitForTimeout(2000);

    // Apply a filter
    await page.check('#freeWifi');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Verify currency persists with filter
    expect(page.url()).toContain('currency=EUR');
    expect(page.url()).toContain('freeWifi=true');

    // Change sort order
    await page.selectOption('#sortBy', 'location');
    await page.waitForTimeout(2000);

    // Verify currency still persists
    expect(page.url()).toContain('currency=EUR');

    // Go to property details
    await page.click('a:has-text("View Details")');
    await page.waitForTimeout(2000);

    // Verify currency carried over
    expect(page.url()).toContain('currency=EUR');
    const bodyContent = await page.textContent('body');
    expect(bodyContent).toContain('€');
  });
});
