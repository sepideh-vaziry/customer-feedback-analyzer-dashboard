# Task - Complaint Intelligence Module

You are a senior React.js architect, SaaS product designer, AI product engineer, and frontend developer.

Your task is to implement the **Complaint Intelligence Module** for the AI Customer Feedback Analyzer platform.

Completed modules:

* Authentication
* Feedback Ingestion
* Connector Management
* Feedback Management
* Feedback Analysis
* Dashboard Analytics

Now build a dedicated Complaint Intelligence area that helps organizations identify, monitor, prioritize, and investigate recurring customer complaints.

The goal is to transform thousands of customer conversations into actionable complaint insights.

---

# Business Goal

Product managers, customer success teams, and executives should be able to answer:

* What are customers complaining about?
* Which complaints are increasing?
* Which complaints affect the most customers?
* Which complaints have the highest business impact?
* Which complaints require immediate attention?

---

# API Discovery

Before implementation:

1. Read the Postman collection.
2. Identify all complaint-related APIs.
3. Generate services from actual endpoints.
4. Do not invent APIs.
5. Use actual response structures.

---

# Navigation

Add:

```text
Complaint Intelligence
├── Overview
├── Categories
├── Recurring Complaints
└── Complaint Explorer
```

---

# Overview Page

Create:

```text
src/pages/complaints/ComplaintsOverviewPage.jsx
```

Display:

```text
Top Complaint Categories
Recurring Complaint Count
Most Affected Customers
Trending Complaints
```

Use KPI cards and charts.

---

# Complaint Categories Page

Create:

```text
src/pages/complaints/ComplaintCategoriesPage.jsx
```

Display all complaint categories detected by AI.

Examples:

```text
Integrations
Performance
Billing
Pricing
Customer Support
Usability
Reliability
```

Only show categories returned by backend.

For each category display:

* Number of occurrences
* Trend
* Severity
* Last occurrence

---

# Recurring Complaints Page

Create:

```text
src/pages/complaints/RecurringComplaintsPage.jsx
```

Display:

```text
Complaint
Occurrences
Affected Customers
Trend
Last Seen
```

Requirements:

* Search
* Sorting
* Filtering
* Pagination

---

# Complaint Explorer

Create:

```text
src/pages/complaints/ComplaintExplorerPage.jsx
```

Purpose:

Allow users to investigate a complaint.

Example:

```text
Complaint:
Missing Slack Integration

Occurrences:
184

Affected Customers:
102

Trend:
+42%

Related Feedback:
- Feedback A
- Feedback B
- Feedback C
```

---

# Complaint Details Drawer

Create:

```text
src/components/complaints/ComplaintDetailsDrawer.jsx
```

Display:

* Complaint name
* Description
* Occurrence count
* Trend information
* Related feedback
* Customer impact

---

# Complaint Trends

Display:

```text
Last 7 Days
Last 30 Days
Last 90 Days
```

Charts:

* Line chart
* Area chart
* Growth percentage

Examples:

```text
Integration complaints +35%
Performance complaints +12%
Pricing complaints -8%
```

---

# Complaint Severity

If backend provides severity:

Support:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Display:

* Color-coded badges
* Severity charts
* Severity distribution

---

# Complaint Analytics Widgets

Create:

```text
src/components/complaints/
├── ComplaintKpiCard.jsx
├── ComplaintTrendChart.jsx
├── ComplaintCategoryChart.jsx
├── ComplaintTable.jsx
├── ComplaintSeverityBadge.jsx
├── ComplaintDetailsDrawer.jsx
└── ComplaintImpactCard.jsx
```

Reusable components only.

---

# Related Feedback Integration

Allow navigation from complaint to feedback.

Example:

```text
Complaint
   ↓
Related Feedback
   ↓
Feedback Details
```

Use existing Feedback Management module.

---

# Service Layer

Create:

```text
src/services/complaintService.js
```

Generate methods from actual backend APIs.

Potential examples:

```javascript
getComplaintOverview()
getComplaintCategories()
getRecurringComplaints()
getComplaintDetails()
getComplaintTrend()
```

Only implement actual APIs.

---

# Data Fetching

Use:

```text
React Query
```

Requirements:

* Caching
* Refetching
* Query invalidation
* Loading states

---

# Loading States

Create:

* KPI Skeletons
* Table Skeletons
* Chart Skeletons

Avoid layout shifts.

---

# Empty States

Handle:

```text
No Complaints Found
No Complaint Trends
No Categories Available
```

Provide meaningful guidance.

---

# Error Handling

Handle:

```text
Network Error
Unauthorized
API Failure
Data Unavailable
```

Use reusable alert components.

---

# Dashboard Integration

Provide navigation from:

```text
Dashboard Complaint Widget
      ↓
Complaint Intelligence
```

Users should be able to drill down from dashboard metrics.

---

# Future Compatibility

Design architecture for future features:

```text
Root Cause Analysis
Complaint Clustering
Complaint Prediction
AI Recommendations
Customer Impact Scoring
Revenue Impact Analysis
```

Do not tightly couple complaint components.

---

# Design Requirements

Use:

* Tailwind CSS
* shadcn/ui
* Lucide Icons
* Recharts

Design language:

* Modern SaaS
* Analytics-focused
* Executive-friendly
* Data-first

The Complaint Intelligence module should become the primary place where businesses understand customer pain points.

---

# Deliverables

Generate:

1. Complaint Intelligence section.
2. Overview page.
3. Categories page.
4. Recurring complaints page.
5. Complaint Explorer page.
6. Complaint service layer.
7. Complaint analytics widgets.
8. Trend visualizations.
9. Severity indicators.
10. Dashboard integration.
11. Responsive design.
12. Production-ready architecture.

Important:

Inspect the Postman collection first and implement only complaint capabilities that actually exist in the backend APIs. Use real API contracts and real response fields instead of assumptions.
