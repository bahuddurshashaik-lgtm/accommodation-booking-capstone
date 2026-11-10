import { Page } from '@playwright/test';
import { parseMoney, type PriceFields, type CurrencyCode } from '../helpers/money';

export class CheckoutQuotePage {
  constructor(private readonly page: Page) {}

  async waitForLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Checkout/quote may not have a selector. We detect currency from visible price text.
  async readVisiblePriceFields(): Promise<PriceFields> {
    const allText = (await this.page.locator('body').textContent()) || '';
    const currencyCode: CurrencyCode = allText.includes('€') ? 'EUR' : allText.includes('£') ? 'GBP' : 'USD';

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
    const container = el.locator('xpath=ancestor-or-self::[1]');
    const text = (await container.textContent()) || '';
    return parseMoney(text);
  }
}
