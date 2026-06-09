# Task - Churn Risk Intelligence Module

You are a senior React.js architect, SaaS product designer, AI product engineer, customer-success platform expert, and frontend developer.

Your task is to implement the **Churn Risk Intelligence Module** for the AI Customer Feedback Analyzer platform.

Completed modules:

* Authentication
* Feedback Ingestion
* Connector Management
* Feedback Management
* Feedback Analysis
* Dashboard Analytics
* Complaint Intelligence
* Feature Request Intelligence

Now build a dedicated Churn Risk Intelligence area that helps organizations identify customers likely to leave, understand why they are at risk, and take action before churn occurs.

The goal is to transform customer feedback into customer retention insights.

---

# Business Goal

Customer Success teams should be able to answer:

* Which customers are likely to churn?
* Why are they at risk?
* Which complaints contribute to churn?
* Which feature gaps increase churn probability?
* How is churn risk changing over time?

---

# API Discovery

Before implementation:

1. Read the Postman collection.
2. Identify all churn-risk-related APIs.
3. Generate services from actual endpoints.
4. Do not invent APIs.
5. Use actual response structures.

---

# Navigation

Add:

```text
Churn Risk
├── Overview
├── High Risk Customers
├── Customer Explorer
├── Risk Trends
└── Retention Insights
```

---

# Overview Page

Create:

```text
src/pages/churn-risk/ChurnRiskOverviewPage.jsx
```

Display:

```text
Total Customers Evaluated
High Risk Customers
Average Risk Score
Critical Risk Customers
```

Use KPI cards and charts.

---

# Risk Distribution

Visualize:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Display:

* Donut Chart
* Distribution Chart
* Risk Breakdown

Example:

```text
LOW      45%
MEDIUM   30%
HIGH     18%
CRITICAL 7%
```

---

# High Risk Customers Page

Create:

```text
src/pages/churn-risk/HighRiskCustomersPage.jsx
```

Display:

```text
Customer
Risk Level
Risk Score
Primary Reason
Last Activity
```

Requirements:

* Search
* Filtering
* Sorting
* Pagination

---

# Customer Explorer

Create:

```text
src/pages/churn-risk/CustomerExplorerPage.jsx
```

Purpose:

Allow investigation of a specific customer.

Display:

```text
Customer Information
Risk Score
Risk Level
Detected Churn Signals
Recent Feedback
Complaints
Feature Requests
```

---

# Customer Risk Drawer

Create:

```text
src/components/churn-risk/CustomerRiskDrawer.jsx
```

Display:

* Customer details
* Risk score
* Risk reasons
* Related complaints
* Related feature requests
* Recent feedback

---

# Churn Drivers Analysis

Display:

```text
Top Churn Drivers
```

Examples:

```text
Missing Integrations
Poor Support Experience
Pricing Concerns
Performance Problems
Missing Features
```

Only show data returned by backend APIs.

---

# Retention Insights

Create:

```text
src/pages/churn-risk/RetentionInsightsPage.jsx
```

Display:

```text
Most Common Churn Reasons
Retention Opportunities
High Impact Issues
```

Examples:

```text
68% of high-risk customers mention integrations.
43% of churn-risk customers mention pricing.
```

Only if supported by APIs.

---

# Risk Trends

Create:

```text
src/pages/churn-risk/RiskTrendsPage.jsx
```

Display:

```text
Last 7 Days
Last 30 Days
Last 90 Days
```

Charts:

* Risk Trend Chart
* High-Risk Customer Growth
* Churn Driver Trends

---

# Churn Risk Visualization

Create:

```text
src/components/churn-risk/
├── ChurnRiskKpiCard.jsx
├── RiskDistributionChart.jsx
├── RiskTrendChart.jsx
├── HighRiskCustomerTable.jsx
├── CustomerRiskDrawer.jsx
├── ChurnDriverChart.jsx
├── RetentionInsightsCard.jsx
└── RiskLevelBadge.jsx
```

Reusable components only.

---

# Related Feedback Integration

Allow navigation:

```text
High Risk Customer
       ↓
Related Feedback
       ↓
Feedback Details
```

Reuse existing feedback pages.

---

# Service Layer

Create:

```text
src/services/churnRiskService.js
```

Generate methods from actual backend APIs.

Potential examples:

```javascript
getChurnOverview()
getHighRiskCustomers()
getCustomerRisk()
getRiskTrends()
getRetentionInsights()
```

Only implement methods supported by backend.

---

# Data Fetching

Use:

```text
React Query
```

Requirements:

* Caching
* Query invalidation
* Background refetching
* Optimized loading

---

# Loading States

Create:

* KPI Skeletons
* Table Skeletons
* Chart Skeletons

Avoid layout shifting.

---

# Empty States

Handle:

```text
No High-Risk Customers
No Risk Data
No Trends Available
```

Provide meaningful guidance.

---

# Error Handling

Handle:

```text
Unauthorized
API Failure
Network Error
Data Unavailable
```

Use reusable alert components.

---

# Dashboard Integration

Allow drill-down:

```text
Dashboard Churn Widget
         ↓
Churn Risk Intelligence
```

Users should navigate seamlessly from dashboard metrics to customer-level analysis.

---

# Future Compatibility

Prepare architecture for:

```text
Predictive Churn Models
Retention Campaigns
Revenue-at-Risk
Customer Health Scores
Success Team Workflows
AI Retention Recommendations
```

Design modular components.

---

# Design Requirements

Use:

* Tailwind CSS
* shadcn/ui
* Lucide Icons
* Recharts

Design language:

* Modern SaaS
* Customer Success focused
* Analytics-first
* Executive-friendly

This module should help organizations proactively retain customers before they leave.

---

# Deliverables

Generate:

1. Churn Risk section.
2. Overview page.
3. High Risk Customers page.
4. Customer Explorer page.
5. Risk Trends page.
6. Retention Insights page.
7. Churn risk service layer.
8. Risk visualizations.
9. Customer investigation workflows.
10. Dashboard integration.
11. Responsive design.
12. Production-ready architecture.

Important:

Inspect the /docs/api/openapi.json first and implement only churn-related capabilities that actually exist in the backend APIs. Use real API contracts and response fields instead of assumptions.
