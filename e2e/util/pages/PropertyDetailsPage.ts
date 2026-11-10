import { Page, Locator } from '@playwright/test';
import { parseMoney, type PriceFields, type CurrencyCode } from '../helpers/money';

export class PropertyDetailsPage {
  constructor(private readonly page: Page) {}

  private currencySelector(): Locator {
    return this.page.locator('#currency');
  }

  async waitForLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.currencySelector().waitFor({ state: 'visible' });
  }

  async getCurrencyOptions(): Promise<string[]> {
    const opts = await this.currencySelector().locator('option').allTextContents();
    return opts.map((o) => o.trim()).filter(Boolean);
  }

  async getSelectedCurrency(): Promise<CurrencyCode> {
    return (await this.currencySelector().inputValue()) as CurrencyCode;
  }

  async selectCurrency(code: CurrencyCode) {
    await this.currencySelector().selectOption(code);
    await this.page.waitForLoadState('networkidle');
  }

  async proceedToCheckoutOrQuote() {
    const book = this.page.getByRole('button', { name: /Book|Checkout|Reserve|Continue/i }).first();
    const calc = this.page.getByRole('button', { name: /Calculate|Quote/i }).first();

    if (await book.isVisible().catch(() => false)) {
      await book.click();
    } else if (await calc.isVisible().catch(() => false)) {
      await calc.click();
    } else {
      const link = this.page.getByRole('link', { name: /Checkout|Quote/i }).first();
      if (await link.isVisible().catch(() => false)) await link.click();
    }
    await this.page.waitForLoadState('domcontentloaded');
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
    const container = el.locator('xpath=ancestor-or-self::[1]');
    const text = (await container.textContent()) || '';
    return parseMoney(text);
  }
}
