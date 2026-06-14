import { Page, Locator } from '@playwright/test';

export class InvoicesPage {
  readonly page: Page;

  readonly root: Locator;
  readonly backBtn: Locator;
  readonly invoiceList: Locator;
  readonly invoiceItems: Locator;
  readonly emptyState: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;

    this.root = page.locator('[data-testid="invoices-page"]');
    this.backBtn = page.locator('[data-testid="back-btn"]');
    this.invoiceList = page.locator('[data-testid="invoice-list"]');
    this.invoiceItems = page.locator('[data-testid="invoice-item"]');
    this.emptyState = page.locator('[data-testid="empty-invoices"]');
    this.error = page.locator('[data-testid="error"]');
  }

  async goto(companyId: string) {
    await this.page.goto(`/invoices?companyId=${companyId}`);
  }

  async gotoWithoutCompany() {
    await this.page.goto('/invoices');
  }

  /** Returns locators scoped to a specific invoice item by index (0-based). */
  item(index: number) {
    const el = this.invoiceItems.nth(index);
    return {
      root: el,
      from: el.locator('[data-testid="invoice-from"]'),
      amount: el.locator('[data-testid="invoice-amount"]'),
      due: el.locator('[data-testid="invoice-due"]'),
      status: el.locator('[data-testid="invoice-status"]'),
      click: () => el.click(),
    };
  }

  async clickBack() {
    await this.backBtn.click();
  }
}
