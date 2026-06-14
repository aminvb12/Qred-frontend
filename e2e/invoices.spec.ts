import { test, expect } from '@playwright/test';
import { InvoicesPage } from './pages/InvoicesPage';
import { MOCK_INVOICES } from './fixtures';

test.describe('Invoices page', () => {
  let invoicesPage: InvoicesPage;

  test.beforeEach(async ({ page }) => {
    invoicesPage = new InvoicesPage(page);
    await page.route('**/companies/c1/invoices', route =>
      route.fulfill({ json: MOCK_INVOICES }));
  });

  test.describe('List rendering', () => {
    test('renders the invoices page container', async ({ page }) => {
      await invoicesPage.goto('c1');
      await expect(invoicesPage.root).toBeVisible();
    });

    test('renders correct number of invoice items', async () => {
      await invoicesPage.goto('c1');
      await expect(invoicesPage.invoiceItems).toHaveCount(MOCK_INVOICES.length);
    });

    test('first item shows correct sender', async () => {
      await invoicesPage.goto('c1');
      await expect(invoicesPage.item(0).from).toHaveText('Qred AB');
    });

    test('first item shows formatted amount', async () => {
      await invoicesPage.goto('c1');
      await expect(invoicesPage.item(0).amount).toHaveText('15 000 kr');
    });

    test('first item shows due date', async () => {
      await invoicesPage.goto('c1');
      await expect(invoicesPage.item(0).due).toHaveText('Due 2024-02-01');
    });

    test('first item shows Pending status', async () => {
      await invoicesPage.goto('c1');
      await expect(invoicesPage.item(0).status).toHaveText('Pending');
    });

    test('second item shows Paid status', async () => {
      await invoicesPage.goto('c1');
      await expect(invoicesPage.item(1).status).toHaveText('Paid');
    });
  });

  test.describe('Navigation', () => {
    test('clicking an invoice item navigates to detail page', async ({ page }) => {
      await invoicesPage.goto('c1');
      await invoicesPage.item(0).click();
      await expect(page).toHaveURL(/\/invoices\/inv1\?companyId=c1/);
    });

    test('back button navigates to dashboard', async ({ page }) => {
      await invoicesPage.goto('c1');
      await invoicesPage.clickBack();
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Edge cases', () => {
    test('shows empty state when no invoices', async ({ page }) => {
      await page.route('**/companies/c1/invoices', route =>
        route.fulfill({ json: [] }));
      await invoicesPage.goto('c1');
      await expect(invoicesPage.emptyState).toBeVisible();
      await expect(invoicesPage.invoiceList).not.toBeVisible();
    });

    test('shows error when companyId is missing', async () => {
      await invoicesPage.gotoWithoutCompany();
      await expect(invoicesPage.error).toContainText('No company selected');
    });

    test('shows error when API fails', async ({ page }) => {
      await page.route('**/companies/c1/invoices', route =>
        route.fulfill({ status: 500, body: 'Internal Server Error' }));
      await invoicesPage.goto('c1');
      await expect(invoicesPage.error).toContainText('Failed to load invoices');
    });
  });
});
