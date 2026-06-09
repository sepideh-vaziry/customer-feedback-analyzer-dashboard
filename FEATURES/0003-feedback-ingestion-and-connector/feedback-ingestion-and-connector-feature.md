# Task 3: Feedback Ingestion & Connector Management Module

You are a senior React.js architect, SaaS product designer, and frontend engineer.

Your task is to implement the Feedback Ingestion and Connector Management module for the AI Customer Feedback Analyzer platform.

Follow modern React best practices and create scalable, production-ready code.

---

# Business Context

Organizations can send customer feedback into the platform through multiple channels.

The platform supports:

1. Manual Feedback Entry
2. CSV Upload
3. Webhook Integration
4. External Source Connectors

The UI should be modern and comparable to SaaS products such as:

* Linear
* PostHog
* Datadog
* HubSpot

---

# Sidebar Navigation

Add a new navigation section:

```text
Feedback
├── Feedback List
├── Import Feedback
└── Connectors
```

---

# Page 1: Import Feedback

Create:

```text
src/pages/feedback/ImportFeedbackPage.jsx
```

This page must use tabs.

```text
┌──────────────────────────────────────┐
│ Import Feedback                      │
├──────────────────────────────────────┤
│ Manual Entry | CSV Upload | Webhook  │
└──────────────────────────────────────┘
```

---

# Tab 1: Manual Feedback Entry

API:

POST /api/v1/feedback

Request:

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

Response:

```json
{
  "id": "uuid",
  "source": "MANUAL",
  "content": "string",
  "customerIdentifier": "string",
  "status": "PENDING",
  "createdAt": "2026-06-09T07:21:36.189Z"
}
```

---

## Manual Entry Form

Fields:

* Feedback Content (textarea)
* External ID
* Customer Name
* Customer Email
* Customer Identifier
* Language

Requirements:

* Validation
* Loading state
* Success notification
* Error handling

After successful submission:

Show success card:

```text
Feedback Created Successfully

Feedback ID
Status
Created At
```

---

# Tab 2: CSV Upload

API:

POST /api/v1/feedback/csv

Content-Type:

multipart/form-data

Request:

```text
file=<csv-file>
```

Response:

```json
{
  "totalRows": 100,
  "successCount": 95,
  "failureCount": 5,
  "errors": [
    "row 5 invalid email"
  ],
  "feedbackIds": [
    "uuid1",
    "uuid2"
  ]
}
```

---

## CSV Upload Requirements

Provide:

* Drag & Drop area
* File picker
* Upload button

Validate:

* CSV extension only
* Maximum file size configurable

Display upload result:

```text
Total Rows
Successful Imports
Failed Imports
Errors
```

Use progress indicators.

---

# Tab 3: Webhook Integration

This tab does NOT call the webhook endpoint.

Instead it helps the user configure external systems.

Display:

## Webhook URL

```text
POST /api/v1/feedback/webhook
```

## Required Payload

```json
{
  "source": "WEBHOOK",
  "payload": "{\"message\":\"Great service!\"}",
  "apiKey": "your-api-key"
}
```

Features:

* Copy Webhook URL button
* Copy JSON Example button
* Code block formatting
* API Key placeholder

Use documentation-style layout.

---

# Page 2: Connectors

Create:

```text
src/pages/connectors/ConnectorsPage.jsx
```

---

# Metadata Endpoint

Load available sources from:

GET /api/v1/metadata/info

Response:

```json
{
  "feedbackSources": [
    {
      "key": "ZENDESK",
      "label": "Zendesk"
    }
  ]
}
```

Use this endpoint to populate connector source dropdowns.

Do NOT hardcode connector types.

---

# Register / Update Connector

API:

POST /api/v1/connectors

Request:

```json
{
  "source": "ZENDESK",
  "credentials": {
    "apiToken": "token",
    "subdomain": "company"
  }
}
```

Response:

```json
{
  "id": "uuid",
  "source": "ZENDESK",
  "status": "ACTIVE",
  "isMock": false,
  "lastPulledAt": "date",
  "createdAt": "date"
}
```

---

## Connector Form

Fields:

### Source

Dropdown populated from metadata endpoint.

### Credentials

Dynamic JSON editor.

Example:

```json
{
  "apiToken": "",
  "subdomain": ""
}
```

Requirements:

* Pretty JSON editor
* Validation
* Submit button

After success:

Refresh connector list automatically.

---

# Connector List

API:

GET /api/v1/connectors

Response:

```json
[
  {
    "id": "uuid",
    "source": "ZENDESK",
    "status": "ACTIVE",
    "isMock": false,
    "lastPulledAt": "date",
    "createdAt": "date"
  }
]
```

Display table:

Columns:

* Source
* Status
* Mock
* Last Pulled
* Created
* Actions

Actions:

* View Details
* Pull Now

---

# Connector Details

API:

GET /api/v1/connectors/{id}

Display:

```text
Connector Information
Status
Source
Created Date
Last Pulled Date
Mock Mode
```

Use a modal or side drawer.

---

# Pull Connector

API:

POST /api/v1/connectors/{id}/pull

Response:

```json
{
  "additionalProp1": 10,
  "additionalProp2": 5,
  "additionalProp3": 3
}
```

Requirements:

* Pull Now button
* Loading state
* Success notification
* Refresh connector information afterward

---

# Services Layer

Create:

```text
src/services/
├── feedbackService.js
├── connectorService.js
├── metadataService.js
```

---

# feedbackService.js

Functions:

```javascript
createFeedback()
uploadCsv()
```

---

# connectorService.js

Functions:

```javascript
createOrUpdateConnector()
getConnectors()
getConnector()
pullConnector()
```

---

# metadataService.js

Functions:

```javascript
getMetadata()
```

---

# UI Components

Create reusable components:

```text
src/components/feedback/
├── ManualFeedbackForm.jsx
├── CsvUploadForm.jsx
├── WebhookDocumentation.jsx

src/components/connectors/
├── ConnectorForm.jsx
├── ConnectorTable.jsx
├── ConnectorDetailsModal.jsx
```

---

# UX Requirements

Use:

* Tailwind CSS
* shadcn/ui
* Lucide Icons

Include:

* Empty states
* Loading states
* Success alerts
* Error alerts
* Responsive design

---

# Deliverables

Generate:

1. Import Feedback page.
2. Manual feedback form.
3. CSV upload workflow.
4. Webhook documentation page.
5. Connector management page.
6. Connector creation form.
7. Connector table.
8. Connector details modal.
9. API service layer.
10. Metadata integration.
11. Responsive UI.
12. Clean architecture.

The implementation must be production-ready and fit into a growing AI SaaS platform.

