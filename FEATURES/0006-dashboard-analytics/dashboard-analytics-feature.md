# Task - Dashboard Analytics Module

You are a senior React.js architect, SaaS product designer, data visualization specialist, and frontend engineer.

Your task is to implement the **Dashboard Analytics Module** for the AI Customer Feedback Analyzer platform.

The following modules are already completed:

* Authentication
* Feedback Ingestion
* Connector Management
* Feedback Management
* Feedback Analysis

Now create the primary dashboard that gives users a high-level overview of customer sentiment, complaints, feature requests, churn risk, and trends.

The dashboard should be the first screen users see after login.

The design should feel comparable to:

* Datadog
* PostHog
* HubSpot
* Linear Analytics
* Mixpanel

---

# Business Goal

The dashboard must answer these questions immediately:

### Customer Sentiment

* Are customers happy?
* Is sentiment improving or declining?

### Complaints

* What are customers complaining about most?

### Feature Requests

* What are customers asking for?

### Churn Risk

* Which customers are at risk?

### Trends

* What issues or requests are increasing?

---

# API Discovery

Before implementation:

1. Read the Postman collection.
2. Identify all dashboard, analytics, reporting, trend, complaint, sentiment, feature-request, and churn-related endpoints.
3. Generate services from actual APIs.
4. Do not invent endpoints.
5. Use real response structures.

---

# Dashboard Route

Create:

```text
/dashboard
```

Default landing page after login.

---

# Dashboard Layout

```text
┌──────────────────────────────────────────────┐
│ Dashboard                                    │
├──────────────────────────────────────────────┤
│ Date Filter                                 │
├──────────────────────────────────────────────┤
│ KPI Cards                                   │
├──────────────────────────────────────────────┤
│ Sentiment Trend Chart                       │
├──────────────────────────────────────────────┤
│ Complaint Overview                          │
├──────────────────────────────────────────────┤
│ Feature Request Overview                    │
├──────────────────────────────────────────────┤
│ Churn Risk Overview                         │
├──────────────────────────────────────────────┤
│ Recent Activity                             │
└──────────────────────────────────────────────┘
```

---

# Global Date Filter

Create:

```text
Last 7 Days
Last 30 Days
Last 90 Days
Custom Range
```

Apply selected range across all dashboard widgets.

If backend filtering exists, use API filters.

If not, prepare architecture for future support.

---

# KPI Section

Create KPI cards.

Potential examples:

```text
Total Feedback
Positive Feedback
Negative Feedback
Feature Requests
Recurring Complaints
High Risk Customers
```

Only display metrics available from backend APIs.

Each KPI card should show:

```text
Value
Trend Indicator
Comparison Percentage
```

If comparison data is available.

---

# KPI Components

Create:

```text
src/components/dashboard/
├── KpiCard.jsx
├── DashboardFilters.jsx
```

Reusable and configurable.

---

# Sentiment Analytics

Create:

```text
Sentiment Overview
```

Display:

* Positive
* Neutral
* Negative

Visualizations:

* Pie Chart
* Donut Chart
* Trend Line

Use:

```text
Recharts
```

Requirements:

* Responsive
* Interactive tooltips
* Empty state support

---

# Complaint Analytics

Display:

```text
Top Complaints
Complaint Categories
Complaint Volume
```

Visualizations:

* Bar Chart
* Category Distribution

Examples:

```text
Integrations
Performance
Pricing
Support
```

Only use actual categories returned by backend.

---

# Feature Request Analytics

Display:

```text
Most Requested Features
Request Volume
Demand Trend
```

Visualizations:

* Horizontal Bar Chart
* Trend Graph

Examples:

```text
Slack Integration
Mobile App
Zapier Support
```

Use actual backend data.

---

# Churn Risk Analytics

Display:

```text
High Risk Customers
Risk Distribution
Average Risk Score
```

Visualizations:

* Risk Gauge
* Distribution Chart
* Severity Breakdown

Support:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

If provided by backend.

---

# Trend Analytics

Display:

```text
Emerging Topics
Increasing Complaints
Increasing Feature Requests
```

Visualizations:

* Trend Cards
* Timeline
* Growth Indicators

Examples:

```text
+45% increase in integration complaints
+30% increase in mobile app requests
```

Only display data supported by APIs.

---

# Recent Activity

Create activity feed.

Examples:

```text
New feedback received
Analysis completed
Connector synchronized
High churn risk detected
```

Use actual activity endpoints if available.

Otherwise create placeholder architecture.

---

# Dashboard Widgets

Create:

```text
src/components/dashboard/
├── SentimentWidget.jsx
├── ComplaintWidget.jsx
├── FeatureRequestWidget.jsx
├── ChurnRiskWidget.jsx
├── TrendWidget.jsx
├── ActivityWidget.jsx
└── DashboardGrid.jsx
```

Each widget must be reusable.

---

# Dashboard Service Layer

Create:

```text
src/services/dashboardService.js
```

Generate functions based on actual APIs.

Potential examples:

```javascript
getDashboardOverview()
getSentimentAnalytics()
getComplaintAnalytics()
getFeatureRequestAnalytics()
getChurnAnalytics()
getTrendAnalytics()
```

Only implement endpoints that exist.

---

# Data Fetching

Use:

```text
React Query
```

Requirements:

* Caching
* Background refresh
* Refetching
* Loading states
* Error states

---

# Loading States

Create dashboard skeletons.

Examples:

```text
KPI Skeleton
Chart Skeleton
Widget Skeleton
```

Avoid layout shifting.

---

# Empty States

Handle:

```text
No Feedback Yet
No Analysis Data
No Trends Available
No Complaints Found
```

Provide user guidance.

---

# Error Handling

Handle:

```text
API Failure
Unauthorized
Network Errors
No Data
```

Use reusable alert components.

---

# Mobile Responsiveness

Support:

* Desktop
* Tablet
* Mobile

Dashboard should gracefully collapse into stacked widgets.

---

# Performance

Requirements:

* Lazy load charts
* Memoize expensive calculations
* Minimize re-renders
* Use efficient React Query caching

---

# Future Compatibility

Prepare architecture for:

```text
Real-Time Analytics
Live Dashboard Updates
AI Recommendations
Custom Widgets
Executive Reports
Benchmarking
Multi-Tenant Analytics
```

Do not tightly couple dashboard components.

Widgets should be independently reusable.

---

# Design Requirements

Use:

* Tailwind CSS
* shadcn/ui
* Lucide Icons
* Recharts

Design language:

* Modern SaaS
* Clean
* Executive-friendly
* Data-focused

The dashboard should feel like a product that investors, executives, customer-success teams, and product managers can use daily.

---

# Deliverables

Generate:

1. Dashboard page.
2. Dashboard service layer.
3. KPI cards.
4. Global filters.
5. Sentiment analytics widgets.
6. Complaint analytics widgets.
7. Feature request analytics widgets.
8. Churn risk analytics widgets.
9. Trend analytics widgets.
10. Activity feed.
11. Dashboard loading states.
12. Dashboard empty states.
13. Responsive layout.
14. React Query integration.
15. Production-ready dashboard architecture.

Important:

Inspect the Postman collection first and build the dashboard using actual analytics APIs and response structures. Do not invent endpoints or metrics that do not exist in the backend.
