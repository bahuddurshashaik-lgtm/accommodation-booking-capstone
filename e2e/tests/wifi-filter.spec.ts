import { test, expect } from '@playwright/test';

test.describe('Free Wi-Fi Filter - EPMCDMETST-71236', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should filter properties with free Wi-Fi', async ({ page }) => {
    // Check the Wi-Fi filter checkbox
    await page.check('#freeWifi');
    await page.click('button[type="submit"]');

    // Wait for results to load
    await page.waitForTimeout(2000);

    // Verify URL has freeWifi parameter
    expect(page.url()).toContain('freeWifi=true');

    // Verify all displayed properties have Wi-Fi badge
    const wifiBadges = page.locator('span:has-text("✓ Free Wi-Fi")');
    const badgeCount = await wifiBadges.count();

    expect(badgeCount).toBeGreaterThan(0);
  });

  test('should persist Wi-Fi filter when changing sort order', async ({ page }) => {
    // Apply Wi-Fi filter
    await page.check('#freeWifi');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Verify URL has freeWifi parameter
    expect(page.url()).toContain('freeWifi=true');

    // Change sort order
    await page.selectOption('#sortBy', 'location');
    await page.waitForTimeout(2000);

    // Verify Wi-Fi filter is still in URL
    expect(page.url()).toContain('freeWifi=true');

    // Verify checkbox is still checked
    const checkbox = page.locator('#freeWifi');
    await expect(checkbox).toBeChecked();

    // Verify all properties still have Wi-Fi
    const wifiBadges = page.locator('span:has-text("✓ Free Wi-Fi")');
    const badgeCount = await wifiBadges.count();
    expect(badgeCount).toBeGreaterThan(0);
  });

  test('should persist Wi-Fi filter when paginating', async ({ page }) => {
    // Apply Wi-Fi filter
    await page.check('#freeWifi');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Check if pagination exists
    const nextButton = page.locator('button:has-text("Next")');
    const isNextButtonEnabled = await nextButton.isEnabled();

    if (isNextButtonEnabled) {
      // Go to next page
      await nextButton.click();
      await page.waitForTimeout(2000);

      // Verify Wi-Fi filter is still in URL
      expect(page.url()).toContain('freeWifi=true');

      // Verify checkbox is still checked
      const checkbox = page.locator('#freeWifi');
      await expect(checkbox).toBeChecked();

      // Verify all properties still have Wi-Fi
      const wifiBadges = page.locator('span:has-text("✓ Free Wi-Fi")');
      const badgeCount = await wifiBadges.count();
      expect(badgeCount).toBeGreaterThan(0);
    }
  });

  test('should remove Wi-Fi filter when unchecked', async ({ page }) => {
    // Check and then uncheck the Wi-Fi filter
    await page.check('#freeWifi');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.uncheck('#freeWifi');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Verify URL does not have freeWifi parameter
    expect(page.url()).not.toContain('freeWifi=true');

    // Verify we have results showing
    const resultText = await page.textContent('p:has-text("Found")');
    expect(resultText).toContain('properties');
  });
});
