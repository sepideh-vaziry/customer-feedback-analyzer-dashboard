# AI Customer Feedback Analyzer - Frontend

## Project Overview

React.js frontend for an AI-native SaaS platform that analyzes customer feedback from Instagram, WhatsApp, support tickets, surveys, and reviews.

- **Stack**: React 18 + Vite + Tailwind CSS v4 + React Router v6 + Axios + Recharts
- **Icons**: Lucide React
- **Styling**: Tailwind CSS v4 with custom theme tokens (no `tailwind.config.js`; uses CSS `@theme`)
- **Backend**: Spring Boot (multi-tenant, JWT auth, supports OpenAI/Ollama models)

---

## Architecture

### Folder Structure

```
src/
  assets/              # Static assets
  components/
    auth/              # ProtectedRoute
    charts/            # Recharts placeholders (SentimentDistribution, FeedbackTrends, ComplaintCategories)
    connectors/        # ConnectorForm, ConnectorTable, ConnectorDetailsModal
    feedback/          # ManualFeedbackForm, CsvUploadForm, WebhookDocumentation
    layout/            # DashboardLayout, Sidebar, Header
    ui/                # StatCard, LoadingSpinner, EmptyState, PageHeader
  contexts/
    AuthContext.jsx    # Auth state, login/logout/refresh, localStorage persistence
  hooks/               # Custom hooks (empty, reserved for future)
  pages/
    analytics/         # AnalyticsPage (placeholder)
    auth/              # LoginPage, RegisterPage
    connectors/        # ConnectorsPage
    dashboard/         # DashboardPage (stats + charts)
    feedback/          # FeedbackPage (placeholder), ImportFeedbackPage
    insights/          # InsightsPage (placeholder)
    settings/          # SettingsPage (placeholder)
  routes/              # Reserved for future route config extraction
  services/
    apiClient.js       # Axios instance with JWT interceptors + auto-refresh
    authService.js     # register, login, refreshToken, logout
    connectorService.js # createOrUpdateConnector, getConnectors, getConnector, pullConnector
    feedbackService.js # createFeedback, uploadCsv
    metadataService.js # getMetadata (feedback sources)
  styles/
    index.css          # Tailwind v4 entry + @theme custom design tokens
  utils/               # Utility functions (empty, reserved)
  App.jsx              # Route definitions + AuthProvider wrapper
  main.jsx             # React root + BrowserRouter
```

### Key Patterns

- **Layout**: All protected pages wrap content in `<DashboardLayout>` which provides Sidebar + Header + Main content area.
- **Auth**: JWT access/refresh tokens stored in `localStorage`. `apiClient.js` handles automatic token refresh on 401 and retries queued requests.
- **Routing**: Routes defined directly in `App.jsx`. Protected routes use `<ProtectedRoute>` component.
- **State**: No global state library yet. Auth uses React Context. Pages manage their own data with `useState`/`useEffect`.
- **Services**: Each domain has a service file that wraps `apiClient` calls.

---

## Environment Variables

Create `.env` in project root (already gitignored):

```
VITE_API_BASE_URL=http://localhost:8080
```

`apiClient.js` falls back to empty string if not set.

---

## Tailwind CSS v4 Setup

This project uses **Tailwind CSS v4** with the Vite plugin. There is **no `tailwind.config.js`**.

Custom theme tokens are defined in `src/styles/index.css` via `@theme`:

```css
@theme {
  --color-primary-500: #3b82f6;
  --color-success-500: #22c55e;
  --color-warning-500: #f59e0b;
  --color-danger-500: #ef4444;
  --color-bg-base: #f8fafc;
  --color-bg-card: #ffffff;
  --color-bg-sidebar: #0f172a;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #94a3b8;
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}
```

Use these tokens in JSX: `bg-primary-500`, `text-text-secondary`, etc.

Do NOT use arbitrary values like `bg-[#123]` unless necessary. Prefer the theme tokens for consistency.

---

## Backend API Contracts

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/register` | POST | Register new user + organization |
| `/api/v1/auth/login` | POST | Login, returns JWT tokens |
| `/api/v1/auth/refresh` | POST | Refresh access token |

**Login Response:**
```json
{
  "accessToken": "jwt",
  "refreshToken": "jwt",
  "tokenType": "Bearer",
  "expiresIn": 3600000,
  "userId": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "organizationId": "uuid",
  "roles": ["ROLE_TENANT_ADMIN"]
}
```

### Feedback

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/feedback` | POST | Create manual feedback |
| `/api/v1/feedback/csv` | POST | Upload CSV (multipart/form-data) |
| `/api/v1/feedback/webhook` | POST | Webhook endpoint (external systems call this) |

**Manual Feedback Request:**
```json
{
  "source": "MANUAL",
  "content": "Customer feedback text",
  "externalId": "feedback-001",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerIdentifier": "cus-123",
  "language": "en"
}
```

**CSV Upload Response:**
```json
{
  "totalRows": 100,
  "successCount": 95,
  "failureCount": 5,
  "errors": ["row 5 invalid email"],
  "feedbackIds": ["uuid1", "uuid2"]
}
```

### Connectors

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/connectors` | GET | List all connectors |
| `/api/v1/connectors` | POST | Create/update connector |
| `/api/v1/connectors/{id}` | GET | Get connector details |
| `/api/v1/connectors/{id}/pull` | POST | Trigger manual pull |

**Connector Request:**
```json
{
  "source": "ZENDESK",
  "credentials": {
    "apiToken": "token",
    "subdomain": "company"
  }
}
```

### Metadata

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/metadata/info` | GET | Get available feedback sources |

**Response:**
```json
{
  "feedbackSources": [
    { "key": "ZENDESK", "label": "Zendesk" }
  ]
}
```

---

## Navigation / Sidebar Structure

```
Dashboard
Feedback
  ├── Feedback List      -> /feedback
  ├── Import Feedback    -> /feedback/import
  └── Connectors         -> /connectors
Analytics                -> /analytics
AI Insights              -> /insights
Trends                   -> /trends (currently redirects to Dashboard)
Settings                 -> /settings
```

---

## Feature Modules

Feature specs are stored in `FEATURES/XXXX-feature-name/` directories. Each contains:
- `*-feature.md` — Detailed requirements, API contracts, UI specs
- `*-prompt.md` — AI agent implementation prompt

### Completed Features
1. **0001-signup-and-login** — Auth pages, JWT handling, protected routes
2. **0002-style** — Tailwind v4 setup, dashboard layout, reusable UI components, charts placeholders
3. **0003-feedback-ingestion-and-connector** — Manual feedback, CSV upload, webhook docs, connector CRUD

### Pending Features
4. **0004-feedback-management-module** — Feedback list, search, filters, detail view, pagination

---

## Conventions for AI Agents

### When Adding New Pages
1. Create page component in `src/pages/<domain>/`
2. Add route in `src/App.jsx` inside `<AuthProvider>`
3. Wrap protected pages with `<ProtectedRoute>`
4. Use `<DashboardLayout>` for all protected pages
5. Use `<PageHeader>` for consistent page titles

### When Adding New Services
1. Create file in `src/services/`
2. Import `apiClient` from `./apiClient`
3. Export async functions that return `response.data`
4. Use `apiClient.get|post|put|delete(path)` pattern
5. Do NOT handle auth headers manually — `apiClient` interceptors do this

### When Adding New Components
1. Place in appropriate `src/components/<domain>/` or `src/components/ui/`
2. Use Tailwind theme tokens for colors/spacing
3. Use Lucide icons (import from `lucide-react`)
4. Accept `className` prop and merge with `clsx` + `tailwind-merge` if needed
5. Keep components focused and reusable

### When Styling
- Use Tailwind v4 utility classes
- Reference theme tokens in `src/styles/index.css`
- Prefer `bg-bg-card`, `text-text-primary`, `border-border` over raw colors
- Use `rounded-xl` for cards, `rounded-lg` for buttons/inputs
- Use `shadow-xs` for subtle card shadows

### API Base URL
- Development: `http://localhost:8080`
- Set via `VITE_API_BASE_URL` env var
- All API paths are prefixed with `/api/v1/`

---

## Running the Project

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Dev server runs on `http://localhost:5173` by default.

---

## Notes for Future Development

- **No Postman collection exists in repo yet** — Feature 0004 references one but it was not provided. If implementing 0004, confirm backend endpoints first.
- **No React Query / SWR** — Currently using raw `useState`/`useEffect`. Consider adding for server state management.
- **No form library** — Forms use controlled inputs with manual validation. Consider React Hook Form + Zod for complex forms.
- **No test framework** — Consider adding Vitest + React Testing Library.
- **Dark mode** — Theme tokens support it architecturally but implementation is not yet done.
- **shadcn/ui** — Referenced in feature docs but not actively used yet. Project currently uses custom components.
