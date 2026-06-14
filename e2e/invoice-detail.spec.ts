import { test, expect } from '@playwright/test';
import { InvoiceDetailPage } from './pages/InvoiceDetailPage';
import { MOCK_INVOICES } from './fixtures';

const PENDING_INVOICE = MOCK_INVOICES[0]; // id: inv1, status: pending, amount: 15000
const PAID_INVOICE = MOCK_INVOICES[1];    // id: inv2, status: paid,    amount: 8500

test.describe('Invoice detail page', () => {
  let detailPage: InvoiceDetailPage;

  test.beforeEach(async ({ page }) => {
    detailPage = new InvoiceDetailPage(page);
    await page.route('**/companies/c1/invoices', route =>
      route.fulfill({ json: MOCK_INVOICES }));
  });

  test.describe('Field rendering', () => {
    test.beforeEach(async () => {
      await detailPage.goto(PENDING_INVOICE.id, 'c1');
    });

    test('renders the detail page container', async () => {
      await expect(detailPage.root).toBeVisible();
    });

    test('shows sender name', async () => {
      await expect(detailPage.from).toHaveText('Qred AB');
    });

    test('shows org number', async () => {
      await expect(detailPage.orgNumber).toHaveText('5560206220');
    });

    test('shows OCR number', async () => {
      await expect(detailPage.ocr).toHaveText(PENDING_INVOICE.ocr_number);
    });

    test('shows issue date', async () => {
      await expect(detailPage.issueDate).toHaveText('2024-01-01');
    });

    test('shows due date', async () => {
      await expect(detailPage.dueDate).toHaveText('2024-02-01');
    });

    test('shows formatted amount', async () => {
      await expect(detailPage.amount).toHaveText('15 000 kr');
    });

    test('shows Pending status', async () => {
      await expect(detailPage.status).toHaveText('Pending');
    });
  });

  test.describe('Status variants', () => {
    test('shows Paid status for a paid invoice', async () => {
      await detailPage.goto(PAID_INVOICE.id, 'c1');
      await expect(detailPage.status).toHaveText('Paid');
    });
  });

  test.describe('Navigation', () => {
    test('back button navigates to invoices list', async ({ page }) => {
      await detailPage.goto(PENDING_INVOICE.id, 'c1');
      await detailPage.clickBack();
      await expect(page).toHaveURL(/\/invoices\?companyId=c1/);
    });
  });

  test.describe('Error states', () => {
    test('shows error for unknown invoice id', async () => {
      await detailPage.goto('nonexistent', 'c1');
      await expect(detailPage.error).toContainText('Invoice not found');
    });

    test('shows error when companyId is missing', async () => {
      await detailPage.page.goto(`/invoices/${PENDING_INVOICE.id}`);
      await expect(detailPage.error).toContainText('Invalid request');
    });

    test('shows error when API fails', async ({ page }) => {
      await page.route('**/companies/c1/invoices', route =>
        route.fulfill({ status: 500, body: 'Internal Server Error' }));
      await detailPage.goto(PENDING_INVOICE.id, 'c1');
      await expect(detailPage.error).toContainText('Failed to load invoice');
    });
  });
});
