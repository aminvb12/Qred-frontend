import { Page, Locator } from '@playwright/test';

export class InvoiceDetailPage {
  readonly page: Page;

  readonly root: Locator;
  readonly backBtn: Locator;
  readonly error: Locator;

  // Detail fields
  readonly from: Locator;
  readonly orgNumber: Locator;
  readonly ocr: Locator;
  readonly issueDate: Locator;
  readonly dueDate: Locator;
  readonly amount: Locator;
  readonly status: Locator;

  constructor(page: Page) {
    this.page = page;

    this.root = page.locator('[data-testid="invoice-detail"]');
    this.backBtn = page.locator('[data-testid="back-btn"]');
    this.error = page.locator('[data-testid="error"]');

    this.from = page.locator('[data-testid="field-from"]');
    this.orgNumber = page.locator('[data-testid="field-org-number"]');
    this.ocr = page.locator('[data-testid="field-ocr"]');
    this.issueDate = page.locator('[data-testid="field-issue-date"]');
    this.dueDate = page.locator('[data-testid="field-due-date"]');
    this.amount = page.locator('[data-testid="field-amount"]');
    this.status = page.locator('[data-testid="field-status"]');
  }

  async goto(invoiceId: string, companyId: string) {
    await this.page.goto(`/invoices/${invoiceId}?companyId=${companyId}`);
  }

  async clickBack() {
    await this.backBtn.click();
  }
}
