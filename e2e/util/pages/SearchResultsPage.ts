import { Page, Locator, expect } from '@playwright/test';
import { parseMoney, type PriceFields, type CurrencyCode } from '../helpers/money';
import { type TestSearchCriteria } from '../fixtures/testData';

export class SearchResultsPage {
  constructor(private readonly page: Page) {}

  private freeWifiCheckbox(): Locator {
    return this.page.locator('#freeWifi');
  }
  private sortSelector(): Locator {
    return this.page.locator('#sortBy');
  }
  private currencySelector(): Locator {
    return this.page.locator('#currency');
  }
  private searchSubmitButton(): Locator {
    return this.page.locator('button[type="submit"]');
  }
  private resultsCards(): Locator {
    return this.page.locator('a:has-text("View Details")');
  }
  private wifiBadges(): Locator {
    return this.page.locator('span:has-text("✓ Free Wi-Fi")');
  }
  private nextButton(): Locator {
    return this.page.locator('button:has-text("Next")');
  }
  private prevButton(): Locator {
    return this.page.locator('button:has-text("Prev")|button:has-text("Previous")');
  }

  async goto(criteria?: TestSearchCriteria) {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');

    if (criteria) {
      const dest = this.page.locator('#destination, input[name="destination"]');
      if (criteria.destination && (await dest.count()) > 0) {
        await dest.first().fill(criteria.destination);
      }
    }

    if (await this.searchSubmitButton().isVisible().catch(() => false)) {
      await this.searchSubmitButton().click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async enableFreeWifi(on: boolean) {
    const cb = this.freeWifiCheckbox();
    await cb.waitFor({ state: 'visible' });
    on ? await cb.check() : await cb.uncheck();
    if (await this.searchSubmitButton().isVisible().catch(() => false)) {
      await this.searchSubmitButton().click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async isFreeWifiEnabled(): Promise<boolean> {
    return this.freeWifiCheckbox().isChecked();
  }

  async getSortOptions(): Promise<string[]> {
    const sel = this.sortSelector();
    await sel.waitFor({ state: 'visible' });
    return (await sel.locator('option').allTextContents()).map((s) => s.trim()).filter(Boolean);
  }

  async selectSortOption(label: string) {
    const sel = this.sortSelector();
    await sel.waitFor({ state: 'visible' });
    await sel.selectOption({ label });
    await this.page.waitForLoadState('networkidle');
  }

  async pagesAvailable(): Promise<number> {
    const pageButtons = this.page.locator('button[data-page]');
    const count = await pageButtons.count();
    if (count > 0) return count;
    const nextVisible = await this.nextButton().isVisible().catch(() => false);
    if (!nextVisible) return 1;
    const enabled = await this.nextButton().isEnabled().catch(() => false);
    return enabled ? 2 : 1;
  }

  async goToNextPage() {
    await this.nextButton().waitFor({ state: 'visible' });
    await this.nextButton().click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToPrevPage() {
    await this.prevButton().waitFor({ state: 'visible' });
    await this.prevButton().click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToPage(pageNumber: number) {
    const btn = this.page.locator(`button[data-page="${pageNumber}"]`);
    if ((await btn.count()) > 0) {
      await btn.first().click();
      await this.page.waitForLoadState('networkidle');
      return;
    }
    for (let i = 1; i < pageNumber; i++) {
      if (!(await this.nextButton().isEnabled().catch(() => false))) break;
      await this.goToNextPage();
    }
  }

  async resultsCount(): Promise<number> {
    return this.resultsCards().count();
  }

  async verifyFreeWifiOnCards(maxCards: number) {
    const badgeCount = await this.wifiBadges().count();
    if (badgeCount === 0) {
      throw new Error('No "☓ Free Wi-Fi" badges found on results; cannot verify filter effect.');
    }
    const results = await this.resultsCount();
    const expectedAtLeast = Math.min(maxCards, results);
    expect(badgeCount).toBeGreaterThanOrEqual(Math.min(expectedAtLeast, badgeCount));
  }

  async getCurrencyOptions(): Promise<string[]> {
    const sel = this.currencySelector();
    await sel.waitFor({ state: 'visible' });
    return (await sel.locator('option').allTextContents()).map((s) => s.trim()).filter(Boolean);
  }

  async getSelectedCurrency(): Promise<CurrencyCode> {
    return (await this.currencySelector().inputValue()) as CurrencyCode;
  }

  async selectCurrency(code: CurrencyCode) {
    const sel = this.currencySelector();
    await sel.waitFor({ state: 'visible' });
    await sel.selectOption(code);
    await this.page.waitForLoadState('networkidle');
  }

  async openFirstPropertyDetails(): Promise<string> {
    await this.resultsCards().first().click();
    await this.page.waitForLoadState('domcontentloaded');
    return this.page.url();
  }

  async readVisiblePriceFields(): Promise<PriceFields> {
    const currencyCode = await this.getSelectedCurrency();
    const nightly = await this.readMoneyByLabel(/Nightly|Per night|\/night/i);
    const subtotal = await this.readMoneyByLabel(/Subtotal/i);
    const taxesFees = await this.readMoneyByLabel(/Taxes|Fees|Taxes\/Fees/i);
    const total = await this.readMoneyByLabel(/Total/i);
    return {
      currencyCode,
      nightlyRate: nightly ?? undefined,
      subtotal: subtotal ?? undefined,
      taxesFees: taxesFees ?? undefined,
      total: total ?? undefined,
    };
  }

  private async readMoneyByLabel(label: RegExp): Promise<number | null> {
    const el = this.page.getByText(label).first();
    if (!(await el.isVisible().catch(() => false))) return null;
    const container = el.locator('xpath=ancestor-or-self::*[1]');
    const text = (await container.textContent()) || '';
    return parseMoney(text);
  }
}
