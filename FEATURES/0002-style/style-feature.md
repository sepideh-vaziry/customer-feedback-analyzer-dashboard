# Task 2: Frontend Styling & UI Foundation Task

You are a senior React.js frontend architect and UI/UX engineer.

Your task is to upgrade the existing React frontend of the AI Customer Feedback Analyzer project and establish a modern SaaS UI foundation.

Do NOT implement business functionality yet. Focus only on styling, layout, reusable components, and frontend architecture.

---

## Project Context

The application is an AI-native SaaS platform that analyzes customer feedback from:

* Instagram comments
* WhatsApp chats
* Support tickets
* Customer surveys
* Reviews

The platform provides:

* Sentiment Analysis
* Complaint Detection
* Feature Request Detection
* Churn Risk Analysis
* Trend Monitoring
* AI-generated Recommendations

The UI should look modern, professional, and comparable to enterprise SaaS products.

---

# Technology Requirements

Install and configure:

* Tailwind CSS
* shadcn/ui
* Lucide React Icons
* React Router
* Axios
* Recharts

Use modern React best practices.

---

# Styling Requirements

Replace all basic CSS with Tailwind CSS.

Configure:

* Responsive layout
* Consistent spacing system
* Typography system
* Color system
* Component-based styling

Support:

* Light Mode
* Dark Mode (architecture only, implementation optional)

---

# Design Theme

## Colors

Primary:

```text
#2563EB
```

Success:

```text
#22C55E
```

Warning:

```text
#F59E0B
```

Danger:

```text
#EF4444
```

Background:

```text
#F8FAFC
```

---

## Sentiment Colors

Positive:

```text
Green
```

Neutral:

```text
Yellow
```

Negative:

```text
Red
```

---

# Layout Architecture

Create a reusable dashboard layout.

## Layout Structure

```text
┌─────────────────────────────────────────┐
│ Header                                  │
├────────────┬────────────────────────────┤
│ Sidebar    │ Main Content               │
│            │                            │
│ Dashboard  │                            │
│ Feedback   │                            │
│ Analytics  │                            │
│ AI Insights│                            │
│ Trends     │                            │
│ Settings   │                            │
└────────────┴────────────────────────────┘
```

---

# Create Components

Create:

```text
src/components/layout/
├── Sidebar.jsx
├── Header.jsx
├── DashboardLayout.jsx
```

---

# Sidebar Requirements

Include navigation items:

* Dashboard
* Feedback
* Analytics
* AI Insights
* Trends
* Settings

Requirements:

* Responsive
* Active menu highlighting
* Icon support using Lucide
* Collapsible architecture for future enhancement

---

# Header Requirements

Include:

* Application logo
* Search placeholder
* User profile area
* Notification placeholder

Design for future expansion.

---

# Dashboard Page

Create a professional dashboard page.

Use reusable cards.

Example metrics:

* Total Feedback
* Positive Sentiment
* Negative Sentiment
* Open Complaints

Use placeholder data.

---

# Reusable Components

Create reusable UI components:

```text
src/components/ui/
├── StatCard.jsx
├── LoadingSpinner.jsx
├── EmptyState.jsx
├── PageHeader.jsx
```

Use shadcn/ui components where appropriate.

---

# Charts

Prepare chart components using Recharts.

Create placeholder sections for:

* Sentiment Distribution
* Feedback Trends
* Complaint Categories

Use mock data.

---

# Folder Structure

Refactor project into:

```text
src/
├── assets/
├── components/
│   ├── layout/
│   ├── ui/
│   └── charts/
├── pages/
│   ├── dashboard/
│   ├── feedback/
│   ├── analytics/
│   ├── insights/
│   └── settings/
├── routes/
├── services/
├── hooks/
├── contexts/
├── utils/
└── styles/
```

---

# UX Requirements

The UI should feel similar to:

* Linear
* PostHog
* Datadog
* Notion

Requirements:

* Clean
* Modern
* Minimal
* Professional
* Enterprise-ready

Avoid generic Bootstrap-like designs.

---

# Deliverables

Generate:

1. Tailwind configuration.
2. shadcn/ui setup.
3. Dashboard layout.
4. Sidebar component.
5. Header component.
6. Reusable UI components.
7. Responsive design.
8. Placeholder dashboard.
9. Chart placeholders.
10. Clean folder structure.

The result should provide a polished SaaS foundation ready for future implementation of authentication, feedback management, analytics, AI insights, and organization management features.

