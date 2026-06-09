# Task - Feedback Analysis Module

You are a senior React.js architect, SaaS product designer, AI product engineer, and frontend developer.

Your task is to implement the **Feedback Analysis Module** for the AI Customer Feedback Analyzer platform.

The Feedback Management module is already completed.

Users can:

* Import feedback
* Browse feedback
* Search feedback
* View feedback details

Now users need to see the AI-generated insights produced from customer feedback.

The goal is to transform raw customer feedback into actionable business intelligence.

---

# Business Goal

For each feedback item, display AI-generated analysis results.

The platform analyzes feedback and extracts:

* Sentiment
* Sentiment Confidence
* AI Summary
* Complaint Detection
* Feature Requests
* Churn Risk
* Categories
* Keywords
* Processing Status

The analysis page should become the most important screen in the product.

Design it like a premium SaaS analytics experience.

---

# API Discovery

Before implementation:

1. Read the Postman collection.
2. Identify all analysis-related endpoints.
3. Generate services based on actual API contracts.
4. Do not invent endpoints.
5. Use only fields returned by the backend.

---

# Navigation

Extend Feedback Details.

Current route:

```text
/feedback/:feedbackId
```

Add:

```text
Analysis Tab
```

Example:

```text
Feedback Details

[Overview] [Analysis]
```

---

# Analysis Page Layout

```text
┌───────────────────────────────────────┐
│ Feedback Analysis                     │
├───────────────────────────────────────┤
│ Processing Status                     │
├───────────────────────────────────────┤
│ Sentiment Card                        │
├───────────────────────────────────────┤
│ AI Summary                            │
├───────────────────────────────────────┤
│ Complaint Detection                   │
├───────────────────────────────────────┤
│ Feature Requests                      │
├───────────────────────────────────────┤
│ Churn Risk                            │
├───────────────────────────────────────┤
│ Categories & Keywords                 │
└───────────────────────────────────────┘
```

---

# Analysis Status

Display processing state.

Examples:

```text
PENDING
PROCESSING
COMPLETED
FAILED
```

Requirements:

* Badge component
* Color coded
* Auto refresh while processing
* Friendly status messages

---

# Sentiment Analysis Section

Display:

```text
Sentiment
Confidence
```

Example:

```text
Positive
92%
```

Supported values:

```text
POSITIVE
NEUTRAL
NEGATIVE
```

Use visual indicators:

* Green
* Yellow
* Red

Display confidence using:

* Progress bar
* Circular indicator
* Percentage

---

# AI Summary Section

Display AI-generated summary.

Example:

```text
Customer is generally satisfied with the product
but is considering cancellation due to missing
integration capabilities.
```

Requirements:

* Readable typography
* Expandable card
* Copy button

---

# Complaint Detection

Display detected complaints.

Example:

```text
Missing Integrations
Slow Performance
Complex Setup
```

Requirements:

* Badge list
* Severity indicators if available
* Empty state support

---

# Feature Requests

Display requested features.

Example:

```text
Slack Integration
Zapier Support
Mobile App
```

Requirements:

* Badge list
* Demand indicators if available
* Future-ready architecture

---

# Churn Risk

Display:

```text
Risk Level
Risk Score
Reason
```

Example:

```text
HIGH
85%
Customer plans to migrate to another platform
```

Risk colors:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Visualize with:

* Risk card
* Progress indicator
* Severity color

---

# Categories

Display AI-generated categories.

Example:

```text
Integrations
Customer Support
Product Experience
Pricing
```

Use chips or badges.

---

# Keywords

Display extracted keywords.

Example:

```text
integration
migration
support
renewal
subscription
```

Use tag components.

---

# Reanalyze Feature

If supported by backend APIs:

Provide:

```text
Reanalyze Feedback
```

Button.

Flow:

1. Trigger analysis.
2. Show processing state.
3. Refresh results.
4. Update UI automatically.

Only implement if API exists.

---

# Analysis History

If backend supports versioning/history:

Create:

```text
Analysis History
```

Display:

* Analysis date
* Model used
* Version

Only implement if API exists.

---

# Services Layer

Create:

```text
src/services/analysisService.js
```

Possible functions:

```javascript
getFeedbackAnalysis()
reanalyzeFeedback()
getAnalysisHistory()
```

Only create methods supported by backend.

---

# Components

Create:

```text
src/components/analysis/
├── SentimentCard.jsx
├── SummaryCard.jsx
├── ComplaintCard.jsx
├── FeatureRequestCard.jsx
├── ChurnRiskCard.jsx
├── CategoryCard.jsx
├── KeywordCard.jsx
├── AnalysisStatusBadge.jsx
└── AnalysisOverview.jsx
```

Reusable and independent.

---

# Empty States

Handle:

```text
Analysis Not Started
Analysis Processing
Analysis Failed
No Analysis Available
```

Create dedicated UI for each.

---

# Loading States

Use:

* Skeletons
* Loading cards
* Section placeholders

Avoid page flickering.

---

# Dashboard Integration Preparation

Design components so they can later be reused on:

```text
Dashboard
Complaint Intelligence
Feature Request Intelligence
Churn Risk Module
Trend Monitoring
```

Avoid tightly coupling components to Feedback Details.

---

# Analytics UX

Use:

* Tailwind CSS
* shadcn/ui
* Lucide Icons
* Existing design system

The UI should feel similar to:

* Datadog
* Linear
* PostHog
* HubSpot AI

---

# Future AI Compatibility

Prepare architecture for future fields such as:

```text
Emotion Analysis
Topic Detection
Intent Detection
Root Cause Analysis
Recommendation Engine
Trend Signals
Vector Similarity Insights
```

Do not hardcode analysis types.

Use a modular card-based design.

---

# Deliverables

Generate:

1. Analysis service layer.
2. Analysis tab/page.
3. Sentiment visualization.
4. AI Summary section.
5. Complaint detection section.
6. Feature request section.
7. Churn risk section.
8. Categories section.
9. Keywords section.
10. Reanalyze workflow (if supported).
11. Loading states.
12. Error states.
13. Responsive design.
14. Reusable analysis components.

Important:

Inspect the Postman collection first and implement only the analysis capabilities that actually exist in the backend APIs. Use real API contracts and real response fields rather than assumptions.
