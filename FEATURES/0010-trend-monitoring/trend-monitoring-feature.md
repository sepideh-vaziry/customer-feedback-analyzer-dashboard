# Task - Trend Monitoring & Emerging Topics Module

You are a senior React.js architect, SaaS product designer, AI product engineer, analytics platform expert, and frontend developer.

Your task is to implement the **Trend Monitoring & Emerging Topics Module** for the AI Customer Feedback Analyzer platform.

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

Now build a dedicated Trend Intelligence area that helps organizations identify emerging patterns across customer feedback.

The goal is to proactively surface changes in customer behavior before they impact retention, growth, or product adoption.

---

# Business Goal

Organizations should be able to answer:

* What topics are increasing?
* What complaints are growing fastest?
* What feature requests are gaining momentum?
* What new themes have recently appeared?
* Which trends require immediate action?

This module should provide early warning signals.

---

# API Discovery

Before implementation:

1. Read the Postman collection.
2. Identify all trend-related APIs.
3. Generate services from actual backend endpoints.
4. Do not invent APIs.
5. Use actual response structures.

---

# Navigation

Add:

```text
Trend Intelligence
├── Overview
├── Emerging Topics
├── Trend Explorer
├── Complaint Trends
├── Feature Trends
└── Trend History
```

---

# Overview Page

Create:

```text
src/pages/trends/TrendOverviewPage.jsx
```

Display:

```text
Active Trends
Emerging Topics
Fastest Growing Complaints
Fastest Growing Feature Requests
Trend Velocity
```

Use KPI cards.

---

# Emerging Topics Page

Create:

```text
src/pages/trends/EmergingTopicsPage.jsx
```

Display newly detected topics.

Example:

```text
AI Integration
Slack Integration
Pricing Transparency
Mobile Experience
Performance Issues
```

For each topic show:

* Growth %
* Occurrence Count
* Trend Score
* First Detected Date

---

# Trend Explorer

Create:

```text
src/pages/trends/TrendExplorerPage.jsx
```

Purpose:

Allow users to inspect a specific trend.

Display:

```text
Trend Name
Growth Rate
Current Volume
Historical Volume
Related Feedback
Related Complaints
Related Feature Requests
```

---

# Trend Details Drawer

Create:

```text
src/components/trends/TrendDetailsDrawer.jsx
```

Display:

* Trend summary
* Growth metrics
* Related insights
* Related feedback
* Timeline

---

# Complaint Trends

Create:

```text
src/pages/trends/ComplaintTrendsPage.jsx
```

Display:

```text
Complaint
Growth %
Occurrences
Trend Direction
```

Visualizations:

* Line Charts
* Trend Cards
* Growth Indicators

Examples:

```text
Integration Issues +48%
Pricing Complaints +21%
Performance Issues +15%
```

---

# Feature Request Trends

Create:

```text
src/pages/trends/FeatureTrendsPage.jsx
```

Display:

```text
Feature Request
Growth %
Mentions
Demand Score
```

Examples:

```text
Slack Integration +52%
Mobile App +38%
Zapier Integration +27%
```

---

# Trend History

Create:

```text
src/pages/trends/TrendHistoryPage.jsx
```

Display:

```text
Trend
First Seen
Peak Activity
Current Activity
Status
```

Status examples:

```text
EMERGING
GROWING
STABLE
DECLINING
EXPIRED
```

Only if backend supports trend lifecycle.

---

# Trend Visualizations

Create:

```text
src/components/trends/
├── TrendKpiCard.jsx
├── TrendGrowthChart.jsx
├── TrendVelocityChart.jsx
├── EmergingTopicsTable.jsx
├── TrendTimeline.jsx
├── TrendStatusBadge.jsx
├── TrendDetailsDrawer.jsx
└── TrendImpactCard.jsx
```

Reusable components only.

---

# Trend Scoring

If backend provides scores:

Display:

```text
Trend Score
Growth Score
Impact Score
Priority Score
```

Visualize using:

* Score cards
* Heat maps
* Ranking tables

Only implement if APIs support it.

---

# Related Insights Integration

Support navigation:

```text
Trend
   ↓
Complaint
   ↓
Feedback
```

and

```text
Trend
   ↓
Feature Request
   ↓
Feedback
```

Reuse existing modules.

---

# Service Layer

Create:

```text
src/services/trendService.js
```

Generate methods from actual APIs.

Potential examples:

```javascript
getTrendOverview()
getEmergingTopics()
getTrendDetails()
getComplaintTrends()
getFeatureTrends()
getTrendHistory()
```

Only implement actual endpoints.

---

# Data Fetching

Use:

```text
React Query
```

Requirements:

* Caching
* Background refresh
* Query invalidation
* Optimized updates

---

# Date Range Filters

Support:

```text
Last 7 Days
Last 30 Days
Last 90 Days
Custom Range
```

Apply globally where backend supports filtering.

---

# Loading States

Create:

* KPI Skeletons
* Table Skeletons
* Chart Skeletons
* Timeline Skeletons

---

# Empty States

Handle:

```text
No Trends Found
No Emerging Topics
No Trend History
```

Provide guidance to users.

---

# Error Handling

Handle:

```text
Unauthorized
Network Error
API Failure
Data Unavailable
```

Use reusable alert components.

---

# Dashboard Integration

Allow drill-down:

```text
Dashboard Trend Widget
         ↓
Trend Intelligence
```

Users should move seamlessly from dashboard trends to detailed analysis.

---

# Future Compatibility

Design architecture for:

```text
Predictive Trends
Anomaly Detection
Seasonality Detection
AI Recommendations
Revenue Impact Analysis
Market Intelligence
Competitor Signals
```

Avoid tightly coupled components.

---

# Design Requirements

Use:

* Tailwind CSS
* shadcn/ui
* Lucide Icons
* Recharts

Design language:

* Modern SaaS
* Analytics-first
* Executive-friendly
* Insight-driven

The Trend Intelligence module should act as the platform's early-warning system.

---

# Deliverables

Generate:

1. Trend Intelligence section.
2. Overview page.
3. Emerging Topics page.
4. Trend Explorer page.
5. Complaint Trends page.
6. Feature Trends page.
7. Trend History page.
8. Trend service layer.
9. Trend visualizations.
10. Dashboard integration.
11. Responsive design.
12. Production-ready architecture.

Important:

Inspect the /docs/api/openapi.json collection first and implement only trend-related capabilities that actually exist in the backend APIs. Use real API contracts and response fields instead of assumptions.
