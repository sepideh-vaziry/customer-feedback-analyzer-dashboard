# Task - Subscription & Billing Module

You are a senior React.js architect, SaaS product designer, subscription-platform expert, and frontend engineer.

Your task is to implement the **Subscription & Billing Module** for the AI Customer Feedback Analyzer platform.

Completed modules:

* Authentication
* Feedback Ingestion
* Connector Management
* Feedback Management
* Feedback Analysis
* Dashboard Analytics
* Complaint Intelligence
* Feature Request Intelligence
* Churn Risk Intelligence
* Trend Intelligence
* Semantic Search & AI Discovery

Now build the billing and subscription experience for tenant organizations.

The platform follows a SaaS subscription model.

Organizations must be able to:

* View their current plan
* Compare plans
* Upgrade
* Downgrade
* Cancel
* View invoices
* View usage limits

---

# Business Goal

Tenant administrators should be able to answer:

* Which plan am I on?
* What are my limits?
* How much usage do I have left?
* How can I upgrade?
* When will my subscription renew?
* What invoices have been generated?

---

# API Discovery

Before implementation:

1. Read the Postman collection.
2. Identify all subscription and billing APIs.
3. Generate services from actual endpoints.
4. Do not invent APIs.
5. Use actual response structures.

---

# Navigation

Add:

```text
Billing
├── Current Plan
├── Plans & Pricing
├── Usage
├── Invoices
└── Subscription History
```

---

# Current Plan Page

Create:

```text
src/pages/billing/CurrentPlanPage.jsx
```

Display:

```text
Current Plan
Subscription Status
Renewal Date
Billing Cycle
Price
```

Examples:

```text
Starter
Professional
Business
Enterprise
```

Only use plans returned by backend.

---

# Subscription Status

Support:

```text
ACTIVE
TRIAL
PAST_DUE
CANCELLED
EXPIRED
SUSPENDED
```

Display color-coded badges.

---

# Plans & Pricing Page

Create:

```text
src/pages/billing/PlansPage.jsx
```

Display available plans.

Show:

```text
Plan Name
Price
Billing Cycle
Included Features
Limits
```

Comparison table format.

---

# Upgrade Workflow

Allow:

```text
Upgrade Plan
```

Flow:

```text
Current Plan
    ↓
Select Plan
    ↓
Confirm Upgrade
    ↓
Success
```

Only implement supported APIs.

---

# Downgrade Workflow

Allow:

```text
Downgrade Plan
```

Display warnings if backend provides limit information.

---

# Cancel Subscription

Allow:

```text
Cancel Subscription
```

Requirements:

* Confirmation dialog
* Clear warnings
* Success notification

---

# Usage Dashboard

Create:

```text
src/pages/billing/UsagePage.jsx
```

Display usage metrics.

Examples:

```text
Feedback Processed
AI Analyses
Connectors
Storage Used
API Requests
Users
```

Only display actual usage data returned by backend.

---

# Usage Visualization

Display:

```text
Used / Limit
```

Examples:

```text
3,200 / 10,000 Feedbacks
2 / 5 Connectors
```

Use:

* Progress bars
* Usage cards
* Percentage indicators

---

# Invoice History

Create:

```text
src/pages/billing/InvoicesPage.jsx
```

Display:

```text
Invoice Number
Date
Amount
Status
Download
```

Status examples:

```text
PAID
OPEN
FAILED
REFUNDED
```

---

# Invoice Details

Create:

```text
src/components/billing/InvoiceDetailsDrawer.jsx
```

Display:

* Invoice number
* Amount
* Tax
* Currency
* Payment date
* Status

---

# Subscription History

Create:

```text
src/pages/billing/SubscriptionHistoryPage.jsx
```

Display:

```text
Date
Action
Old Plan
New Plan
Performed By
```

Examples:

```text
Upgrade
Downgrade
Renewal
Cancellation
```

---

# Billing Components

Create:

```text
src/components/billing/
├── PlanCard.jsx
├── PlanComparisonTable.jsx
├── SubscriptionStatusBadge.jsx
├── UsageCard.jsx
├── UsageProgressBar.jsx
├── InvoiceTable.jsx
├── InvoiceDetailsDrawer.jsx
├── SubscriptionHistoryTable.jsx
└── BillingKpiCard.jsx
```

Reusable components only.

---

# Service Layer

Create:

```text
src/services/billingService.js
```

Generate methods from actual APIs.

Potential examples:

```javascript
getCurrentSubscription()
getAvailablePlans()
upgradeSubscription()
downgradeSubscription()
cancelSubscription()
getUsageMetrics()
getInvoices()
getSubscriptionHistory()
```

Only implement actual backend endpoints.

---

# Data Fetching

Use:

```text
React Query
```

Requirements:

* Caching
* Query invalidation
* Refetch after plan changes
* Optimized loading

---

# Loading States

Create:

* Billing skeletons
* Plan skeletons
* Usage skeletons
* Invoice skeletons

---

# Empty States

Handle:

```text
No Subscription
No Usage Data
No Invoices
No Billing History
```

Provide guidance.

---

# Error Handling

Handle:

```text
Unauthorized
Payment Failure
Network Error
Billing Service Unavailable
```

Use reusable alert components.

---

# Role-Based Access

Restrict billing pages to:

```text
ROLE_TENANT_ADMIN
```

Hide billing functionality from standard users.

---

# Dashboard Integration

Display summary widgets:

```text
Current Plan
Usage %
Renewal Date
```

Allow drill-down:

```text
Dashboard
    ↓
Billing
```

---

# Future Compatibility

Prepare architecture for:

```text
Stripe Integration
Paddle Integration
Coupons
Promo Codes
Usage-Based Billing
Seat-Based Billing
Annual Plans
Multi-Currency Support
```

Design modular services and components.

---

# Design Requirements

Use:

* Tailwind CSS
* shadcn/ui
* Lucide Icons
* Existing design system

Design language:

* Modern SaaS
* Billing-focused
* Executive-friendly
* Enterprise-ready

---

# Deliverables

Generate:

1. Billing section.
2. Current Plan page.
3. Plans & Pricing page.
4. Usage dashboard.
5. Invoice management.
6. Subscription history.
7. Billing service layer.
8. Upgrade/downgrade workflows.
9. Billing visualizations.
10. Role-based access control.
11. Responsive design.
12. Production-ready architecture.

Important:

Inspect the /docs/api/openapi.json collection first and implement only billing and subscription capabilities that actually exist in the backend APIs. Use real API contracts and response fields instead of assumptions.
