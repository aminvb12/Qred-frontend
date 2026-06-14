import { test, expect } from '@playwright/test';
import { DashboardPage } from './pages/DashboardPage';
import { mockDashboardApis, MOCK_COMPANIES, MOCK_CARD_ACTIVE, MOCK_CARD_UNDER_REVIEW } from './fixtures';

test.describe('Dashboard', () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboard = new DashboardPage(page);
    await mockDashboardApis(page);
    await dashboard.goto();
  });

  test.describe('Company selector', () => {
    test('displays the first company name on load', async () => {
      await expect(dashboard.companyName).toHaveText(MOCK_COMPANIES[0].name);
    });

    test('opens dropdown on trigger click', async () => {
      await dashboard.companySelectorTrigger.click();
      await expect(dashboard.companyDropdown).toBeVisible();
      await expect(dashboard.companyOptions).toHaveCount(MOCK_COMPANIES.length);
    });

    test('switches company and closes dropdown', async () => {
      await dashboard.selectCompany(MOCK_COMPANIES[1].name);
      await expect(dashboard.companyName).toHaveText(MOCK_COMPANIES[1].name);
      await expect(dashboard.companyDropdown).not.toBeVisible();
    });
  });

  test.describe('Card', () => {
    test('renders the card image', async () => {
      await expect(dashboard.cardImage).toBeVisible();
    });

    test('shows masked card number', async () => {
      await expect(dashboard.cardNumber).toHaveText('4539 1234 5678 9012');
    });

    test('shows formatted expiry date', async () => {
      await expect(dashboard.cardExpiry).toHaveText('01/27');
    });

    test('shows credit limit', async () => {
      await expect(dashboard.cardLimit).toContainText('50 000 kr');
    });

    test('shows under_review status label', async () => {
      await expect(dashboard.cardStatus).toHaveText('under review');
    });

    test('shows no-card placeholder when company has no card', async ({ page }) => {
      await mockDashboardApis(page, { card: null });
      await page.route('**/companies/c1/cards', route => route.fulfill({ json: [] }));
      await dashboard.goto();
      await expect(dashboard.noCard).toBeVisible();
      await expect(dashboard.cardImage).not.toBeVisible();
    });
  });

  test.describe('Remaining spend', () => {
    test('shows remaining spend section', async () => {
      await expect(dashboard.remainingSpend).toBeVisible();
    });

    test('shows current/max credit amount', async () => {
      await expect(dashboard.remainingAmount).toHaveText('35 000/50 000 kr');
    });

    test('renders progress bar with correct width', async () => {
      // 35000/50000 = 70%
      const width = await dashboard.progressBar.evaluate(el =>
        (el as HTMLElement).style.width
      );
      expect(width).toBe('70%');
    });
  });

  test.describe('Invoice due', () => {
    test('shows invoice due row', async () => {
      await expect(dashboard.invoiceDueRow).toBeVisible();
    });

    test('shows badge with total pending amount', async () => {
      // Only inv1 is pending (15000 kr)
      await expect(dashboard.invoiceBadge).toBeVisible();
      await expect(dashboard.invoiceBadge).toContainText('15 000 kr');
    });

    test('navigates to invoices page on click', async ({ page }) => {
      await dashboard.clickInvoiceDue();
      await expect(page).toHaveURL(/\/invoices\?companyId=c1/);
    });
  });

  test.describe('Transactions', () => {
    test('shows transaction list section', async () => {
      await expect(dashboard.transactionList).toBeVisible();
    });

    test('renders up to 3 transaction rows', async () => {
      await expect(dashboard.transactionRows).toHaveCount(2); // fixture has 2 transactions
    });
  });

  test.describe('Action buttons', () => {
    test('shows Activate card button when card is under_review', async () => {
      await expect(dashboard.activateCardBtn).toBeVisible();
      await expect(dashboard.cardActiveBtn).not.toBeVisible();
    });

    test('shows disabled Card active button when card is active', async ({ page }) => {
      await mockDashboardApis(page, { card: MOCK_CARD_ACTIVE });
      await dashboard.goto();
      await expect(dashboard.cardActiveBtn).toBeVisible();
      await expect(dashboard.cardActiveBtn).toBeDisabled();
      await expect(dashboard.activateCardBtn).not.toBeVisible();
    });

    test('activating card swaps button to Card active', async ({ page }) => {
      await page.route('**/companies/c1/cards/card1/activations', route =>
        route.fulfill({ json: MOCK_CARD_ACTIVE }));

      await dashboard.activateCard();
      await expect(dashboard.cardActiveBtn).toBeVisible();
      await expect(dashboard.activateCardBtn).not.toBeVisible();
    });

    test('shows Contact support button', async () => {
      await expect(dashboard.supportBtn).toBeVisible();
    });
  });
});
