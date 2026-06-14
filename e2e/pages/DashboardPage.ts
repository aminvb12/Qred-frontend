import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  // Root
  readonly root: Locator;

  // Company selector
  readonly companySelectorTrigger: Locator;
  readonly companyName: Locator;
  readonly companyDropdown: Locator;
  readonly companyOptions: Locator;

  // Invoice due row
  readonly invoiceDueRow: Locator;
  readonly invoiceBadge: Locator;

  // Card
  readonly cardImage: Locator;
  readonly cardNumber: Locator;
  readonly cardStatus: Locator;
  readonly cardExpiry: Locator;
  readonly cardLimit: Locator;
  readonly noCard: Locator;

  // Remaining spend
  readonly remainingSpend: Locator;
  readonly remainingAmount: Locator;
  readonly progressBar: Locator;

  // Transactions
  readonly transactionList: Locator;
  readonly transactionRows: Locator;

  // Action buttons
  readonly activateCardBtn: Locator;
  readonly cardActiveBtn: Locator;
  readonly supportBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.root = page.locator('[data-testid="dashboard"]');

    this.companySelectorTrigger = page.locator('[data-testid="company-selector-trigger"]');
    this.companyName = page.locator('[data-testid="company-name"]');
    this.companyDropdown = page.locator('[data-testid="company-dropdown"]');
    this.companyOptions = page.locator('[data-testid="company-option"]');

    this.invoiceDueRow = page.locator('[data-testid="invoice-due-row"]');
    this.invoiceBadge = page.locator('[data-testid="invoice-badge"]');

    this.cardImage = page.locator('[data-testid="card-image"]');
    this.cardNumber = page.locator('[data-testid="card-number"]');
    this.cardStatus = page.locator('[data-testid="card-status"]');
    this.cardExpiry = page.locator('[data-testid="card-expiry"]');
    this.cardLimit = page.locator('[data-testid="card-limit"]');
    this.noCard = page.locator('[data-testid="no-card"]');

    this.remainingSpend = page.locator('[data-testid="remaining-spend"]');
    this.remainingAmount = page.locator('[data-testid="remaining-amount"]');
    this.progressBar = page.locator('[data-testid="progress-bar"]');

    this.transactionList = page.locator('[data-testid="transaction-list"]');
    this.transactionRows = page.locator('[data-testid="transaction-row"]');

    this.activateCardBtn = page.locator('[data-testid="activate-card-btn"]');
    this.cardActiveBtn = page.locator('[data-testid="card-active-btn"]');
    this.supportBtn = page.locator('[data-testid="support-btn"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async selectCompany(name: string) {
    await this.companySelectorTrigger.click();
    await this.companyOptions.filter({ hasText: name }).click();
  }

  async clickInvoiceDue() {
    await this.invoiceDueRow.click();
  }

  async activateCard() {
    await this.activateCardBtn.click();
  }
}
