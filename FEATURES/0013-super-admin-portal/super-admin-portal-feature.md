# Task - Super Admin Portal

You are a senior React.js architect, SaaS platform engineer, enterprise software designer, and frontend developer.

Your task is to implement the **Super Admin Portal** for the AI Customer Feedback Analyzer platform.

Completed modules:

- Authentication
- Feedback Ingestion
- Connector Management
- Feedback Management
- Feedback Analysis
- Dashboard Analytics
- Complaint Intelligence
- Feature Request Intelligence
- Churn Risk Intelligence
- Trend Intelligence
- Semantic Search & AI Discovery
- Subscription & Billing
- AI Provider Configuration
- Organization & Team Management

Now build a dedicated Super Admin Portal that allows platform administrators to manage the entire SaaS platform.

This portal is only accessible to platform administrators and must be completely separated from tenant functionality.

---

# Business Goal

Platform administrators should be able to:

- Manage organizations
- Manage users across organizations
- Manage subscriptions
- Monitor platform usage
- Monitor AI consumption
- View system health
- Suspend organizations
- Review platform analytics
- Configure global settings

The Super Admin Portal acts as the control center for the SaaS platform.

---

# API Discovery

Before implementation:

1. Read the Postman collection.
2. Identify all super-admin APIs.
3. Generate services from actual backend endpoints.
4. Do not invent APIs.
5. Use actual response structures.

---

# Access Control

Create:

```text
ROLE_SUPER_ADMIN
```

Requirements:

- Completely isolated from tenant users.
- Tenant admins must never access super-admin pages.
- All routes protected.
- Hide portal navigation for non-super-admin users.

---

# Navigation

Add:

```text
Super Admin
├── Platform Overview
├── Organizations
├── Users
├── Subscriptions
├── AI Usage
├── System Health
├── Audit Logs
├── Global Settings
└── Support Tools
```

---

# Platform Overview Dashboard

Create:

```text
src/pages/admin/PlatformOverviewPage.jsx
```

Display:

```text
Total Organizations
Active Organizations
Suspended Organizations
Total Users
Monthly Active Users
Feedback Processed
AI Requests
Revenue
```

Use KPI cards and charts.

---

# Organization Management

Create:

```text
src/pages/admin/OrganizationsPage.jsx
```

Display:

```text
Organization Name
Subscription Plan
Status
Created Date
User Count
Feedback Count
```

Requirements:

- Search
- Filtering
- Sorting
- Pagination

---

# Organization Details

Create:

```text
src/pages/admin/OrganizationDetailsPage.jsx
```

Display:

```text
Organization Information
Subscription
Usage Statistics
AI Consumption
Users
Connectors
Recent Activity
```

---

# Organization Actions

Support:

```text
View
Edit
Suspend
Activate
Delete
```

Use confirmation dialogs for destructive actions.

---

# User Management

Create:

```text
src/pages/admin/UsersPage.jsx
```

Display:

```text
Name
Email
Organization
Role
Status
Last Login
```

Requirements:

- Search
- Filters
- Pagination

---

# User Actions

Support:

```text
View
Disable
Enable
Reset Password
Impersonate (if supported)
```

Only implement supported APIs.

---

# Subscription Management

Create:

```text
src/pages/admin/SubscriptionsPage.jsx
```

Display:

```text
Organization
Plan
Status
Renewal Date
Revenue
```

Support subscription review and management.

---

# AI Usage Monitoring

Create:

```text
src/pages/admin/AIUsagePage.jsx
```

Display:

```text
Organization
Provider
Model
Token Usage
Cost
Requests
```

Examples:

```text
OpenAI GPT-5
OpenAI GPT-4.1
Ollama Llama 3
Ollama Qwen
```

Only show actual providers returned by backend.

---

# AI Cost Analytics

Display:

```text
Total AI Cost
Cost by Organization
Cost by Provider
Cost by Model
```

Visualizations:

- Pie charts
- Bar charts
- Trend charts

---

# System Health Dashboard

Create:

```text
src/pages/admin/SystemHealthPage.jsx
```

Display:

```text
API Status
Database Status
Queue Status
Storage Status
AI Provider Status
```

Support status badges:

```text
HEALTHY
WARNING
DEGRADED
DOWN
```

---

# Platform Metrics

Display:

```text
Requests Per Minute
Average Response Time
Error Rate
Active Sessions
```

Only if backend provides metrics.

---

# Audit Logs

Create:

```text
src/pages/admin/AuditLogsPage.jsx
```

Display:

```text
Timestamp
User
Organization
Action
Resource
Result
```

Requirements:

- Search
- Filtering
- Pagination

---

# Audit Details Drawer

Create:

```text
src/components/admin/AuditLogDetailsDrawer.jsx
```

Display:

- Event details
- Actor
- Resource
- Metadata
- Timestamp

---

# Global Settings

Create:

```text
src/pages/admin/GlobalSettingsPage.jsx
```

Display configurable platform settings.

Examples:

```text
Registration Enabled
Maintenance Mode
Default Plan
Default AI Provider
Default AI Model
Platform Limits
```

Only implement settings supported by backend.

---

# Support Tools

Create:

```text
src/pages/admin/SupportToolsPage.jsx
```

Display:

```text
Organization Lookup
User Lookup
Subscription Lookup
Usage Lookup
```

Quick-access support tools.

---

# Admin Components

Create:

```text
src/components/admin/
├── PlatformKpiCard.jsx
├── OrganizationTable.jsx
├── UserTable.jsx
├── SubscriptionTable.jsx
├── AIUsageChart.jsx
├── SystemHealthCard.jsx
├── AuditLogTable.jsx
├── AuditLogDetailsDrawer.jsx
├── OrganizationStatusBadge.jsx
└── AdminMetricCard.jsx
```

Reusable components only.

---

# Service Layer

Create:

```text
src/services/adminService.js
```

Potential methods:

```javascript
getPlatformOverview()
getOrganizations()
getOrganizationDetails()
suspendOrganization()
activateOrganization()

getUsers()
disableUser()
enableUser()

getSubscriptions()

getAIUsage()

getSystemHealth()

getAuditLogs()

getGlobalSettings()
updateGlobalSettings()
```

Only implement actual backend APIs.

---

# Data Fetching

Use:

```text
React Query
```

Requirements:

- Caching
- Background refresh
- Query invalidation
- Optimistic updates where appropriate

---

# Loading States

Create:

- KPI skeletons
- Table skeletons
- Dashboard skeletons
- Audit log skeletons

---

# Empty States

Handle:

```text
No Organizations
No Users
No Audit Logs
No Usage Data
```

Provide useful guidance.

---

# Error Handling

Handle:

```text
Unauthorized
Forbidden
Network Error
API Failure
System Unavailable
```

Use reusable alert components.

---

# Security Requirements

Super Admin Portal must:

- Be isolated from tenant portal.
- Use dedicated route guards.
- Enforce role checks.
- Prevent tenant access.
- Hide unauthorized navigation items.
- Support secure session handling.

---

# Dashboard Integration

Add:

```text
Super Admin Dashboard
```

as a separate navigation section.

Do not mix tenant analytics with platform analytics.

---

# Future Compatibility

Design architecture for:

```text
Multi-Region Management
White Label Management
Partner Portal
Reseller Management
Feature Flags
AI Cost Optimization
Platform Announcements
System Maintenance Scheduling
```

Keep modules loosely coupled.

---

# Design Requirements

Use:

- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Recharts

Design language:

- Enterprise SaaS
- Operations-focused
- Executive-friendly
- Data-heavy
- Production-grade

The Super Admin Portal should feel similar to platforms such as:

- Stripe Admin
- Auth0 Dashboard
- Datadog Administration
- AWS Organizations
- Atlassian Admin

---

# Deliverables

Generate:

1. Super Admin section.
2. Platform Overview dashboard.
3. Organization Management.
4. User Management.
5. Subscription Management.
6. AI Usage monitoring.
7. System Health dashboard.
8. Audit Logs.
9. Global Settings.
10. Support Tools.
11. Admin service layer.
12. Role-based security.
13. Responsive design.
14. Production-ready architecture.

Important:

Inspect the /docs/api/openapi.json collection first and implement only super-admin capabilities that actually exist in the backend APIs. Use real API contracts and response fields instead of assumptions.

If backend APIs do not exist for a feature, create the frontend architecture, routes, components, placeholders, and service contracts with clear TODO markers indicating that backend support is required.