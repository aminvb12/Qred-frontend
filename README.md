# Qred Frontend

A mobile-first React dashboard for Qred — company selector, card management, invoice tracking, and transaction history. Built as part of the full-stack case study assignment.

---

## Tech Stack

- **React 18 + TypeScript** — UI framework
- **Vite 5** — build tool and dev server
- **React Router v7** — client-side routing
- **Axios** — HTTP client with typed responses
- **react-hot-toast** — minimal snackbar notifications
- **CSS Modules** — scoped component styles
- **Playwright** — end-to-end browser tests
- **AWS S3 + CloudFront** — production hosting

---

## Project Structure

```
src/
  api/           # Axios client + per-resource API functions
  components/    # Shared UI components (CardImage, CompanySelector, etc.)
  context/       # AppContext — global state (companies, cards, invoices, transactions)
  pages/
    Dashboard/   # Main mobile dashboard
    Invoice/     # Invoice list and detail pages
  types/         # Shared TypeScript interfaces
e2e/             # Playwright end-to-end tests
infrastructure/  # CloudFormation stack for S3 + CloudFront deployment
```

---

## Pages & Components

**Dashboard** — the main view, matching the Appendix 1 mobile wireframe:
- Company selector (switch between companies)
- Invoice due row with total pending amount badge → navigates to `/invoices`
- Card image with status
- Remaining spend (`current_credit / max_credit`)
- Latest transactions list
- Activate card button (fires green snackbar on success via react-hot-toast)
- Contact Qred's support button

**InvoicesPage** (`/invoices`) — lists all statement invoices for the selected company, click to view detail.

**InvoiceDetailPage** (`/invoices/:id`) — full invoice detail: OCR number, sender, dates, amount, status.

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:3000/api`) |

Create a `.env.local` for local development:

```bash
VITE_API_URL=http://localhost:3000/api
```

In production the CI/CD pipeline injects `VITE_API_URL` as the CloudFront domain during `npm run build`.

---

## Running Locally

```bash
npm install
npm run dev        # starts on http://localhost:3001
```

The backend must be running (see `Qred-Assignment/` README). Migrations seed the database automatically on first start.

---

## Tests

```bash
npm run test:e2e          # run Playwright tests (headless)
npm run test:e2e:ui       # open Playwright UI mode
```

E2E tests cover the dashboard, invoice list, and invoice detail pages against a live local server.

---

## Infrastructure

Defined in `infrastructure/frontend.yml` (CloudFormation):

- **S3 bucket** — private, stores the Vite build output
- **CloudFront OAC** — Origin Access Control, only CloudFront can read the bucket
- **Two origins**: S3 (default) and the backend ALB (`/api/*`)
- **`/api/*` behaviour** — forwarded to the ALB with `CachingDisabled`, solves mixed-content (HTTPS CloudFront → HTTP ALB internally)
- **SPA routing** — 403/404 responses from S3 mapped to `index.html` with 200 so React Router handles navigation
- **Cache headers** — hashed assets get `Cache-Control: max-age=31536000, immutable`; `index.html` gets `no-cache`

**CI/CD** (`.github/workflows/deploy.yml`):
1. TypeScript type-check (`tsc --noEmit`)
2. Deploy CloudFormation stack
3. Read CloudFront domain from stack outputs
4. `npm run build` with `VITE_API_URL=https://<cf-domain>/api`
5. Sync to S3 with smart cache headers
6. Invalidate CloudFront cache

---

## Future Improvements

**React Query** — replace manual `useEffect` + `useState` data fetching in `AppContext` with `useQuery` / `useMutation`. Gets caching, background refetch, loading/error states, and optimistic updates for free. Especially useful for the card activation mutation.

**Visual snapshot testing** — add Playwright or Storybook visual regression tests to catch unintended UI changes. Screenshots compared on every PR; diffs flagged before merge. Keeps the mobile layout consistent across component changes.

**Sentry** — instrument the frontend with `@sentry/react` for error tracking. Captures unhandled exceptions, failed API calls, and component crashes in production with full stack traces and user context. Pair with `Sentry.captureException` in the Axios error interceptor.

**Monitoring & dashboard** — connect CloudFront access logs to CloudWatch or Datadog. Track page load times, error rates (4xx/5xx from the `/api/*` proxy), and geographic distribution. Set alerts on error rate spikes so issues are caught before users report them.
