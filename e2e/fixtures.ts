import { Page } from '@playwright/test';

export const MOCK_USER = {
  id: 'u1',
  first_name: 'Anna',
  last_name: 'Svensson',
  email: 'anna@acme.se',
  personal_number: '19900101-1234',
};

export const MOCK_COMPANIES = [
  { id: 'c1', name: 'Acme AB', org_number: '5591234567' },
  { id: 'c2', name: 'Beta AB', org_number: '5599876543' },
];

export const MOCK_CARD_UNDER_REVIEW = {
  id: 'card1',
  card_number: '4539123456789012',
  issue_date: '2024-01-01',
  exp_date: '2027-01-01',
  max_credit: 50000,
  current_credit: 35000,
  status: 'under_review',
  company_id: 'c1',
};

export const MOCK_CARD_ACTIVE = {
  ...MOCK_CARD_UNDER_REVIEW,
  status: 'active',
};

export const MOCK_INVOICES = [
  {
    id: 'inv1',
    ocr_number: 'QR-001',
    issue_date: '2024-01-01',
    due_date: '2024-02-01',
    amount: 15000,
    from: 'Qred AB',
    from_org_number: '5560206220',
    type: 'statement',
    status: 'pending',
    company_id: 'c1',
  },
  {
    id: 'inv2',
    ocr_number: 'QR-002',
    issue_date: '2024-02-01',
    due_date: '2024-03-01',
    amount: 8500,
    from: 'Qred AB',
    from_org_number: '5560206220',
    type: 'fee',
    status: 'paid',
    company_id: 'c1',
  },
];

export const MOCK_TRANSACTIONS = [
  { id: 'tx1', ocr_number: 'QR-001', amount: 15000, date: '2024-01-15', paid_date: null },
  { id: 'tx2', ocr_number: 'QR-002', amount: 8500,  date: '2024-02-10', paid_date: '2024-02-10' },
];

/** Wire up all API mocks that the Dashboard needs. */
export async function mockDashboardApis(page: Page, overrides: {
  card?: object;
  invoices?: object[];
  transactions?: object[];
} = {}) {
  const card = overrides.card ?? MOCK_CARD_UNDER_REVIEW;
  const invoices = overrides.invoices ?? MOCK_INVOICES;
  const transactions = overrides.transactions ?? MOCK_TRANSACTIONS;

  await page.route('**/users', route =>
    route.fulfill({ json: [MOCK_USER] }));

  await page.route(`**/users/${MOCK_USER.id}/companies`, route =>
    route.fulfill({ json: MOCK_COMPANIES }));

  await page.route(`**/companies/c1/cards`, route =>
    route.fulfill({ json: [card] }));

  await page.route(`**/companies/c1/invoices`, route =>
    route.fulfill({ json: invoices }));

  await page.route(`**/companies/c1/transactions**`, route =>
    route.fulfill({ json: transactions }));

  // c2 returns empty data
  await page.route(`**/companies/c2/cards`, route =>
    route.fulfill({ json: [] }));
  await page.route(`**/companies/c2/invoices`, route =>
    route.fulfill({ json: [] }));
  await page.route(`**/companies/c2/transactions**`, route =>
    route.fulfill({ json: [] }));
}
