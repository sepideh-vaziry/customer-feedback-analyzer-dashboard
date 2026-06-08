# Task 1: Registration, Authentication, and Session Management Feature

You are a senior React.js architect and frontend engineer.

Your task is to analyze the following backend APIs and implement a complete authentication module for the AI Customer Feedback Analyzer frontend.

## Business Context

The application is a multi-tenant SaaS platform.

Each registered user belongs to an organization (tenant).

During registration, a new organization is created and the registering user becomes the tenant administrator.

The frontend must support:

* User Registration
* User Login
* JWT Authentication
* Refresh Token Handling
* Session Persistence
* Protected Routes
* Logout
* Authentication State Management

---

# API Endpoints

## 1. User Registration

### Endpoint

POST /api/v1/auth/register

### Request

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "organizationName": "Acme Corp",
  "captchaChallenge": "challenge-string",
  "captchaSolution": "solution-string"
}
```

### Response

```json
{
  "id": "019e87da-9b54-784d-b2b8-8a87d9a0d271",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "organizationId": "019e87da-9b3a-79e5-bc4c-3f509609b577",
  "organizationName": "Acme Corp",
  "roles": [
    "ROLE_TENANT_ADMIN"
  ]
}
```

### Registration Flow

1. User opens registration page.
2. User enters:

   * First Name
   * Last Name
   * Email
   * Password
   * Organization Name
   * Captcha Challenge
   * Captcha Solution
3. Frontend validates all fields.
4. Frontend calls registration API.
5. On success:

   * Show success notification.
   * Redirect user to Login page.
6. Do NOT automatically log the user in after registration.

---

# 2. User Login

### Endpoint

POST /api/v1/auth/login

### Request

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Response

```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token",
  "tokenType": "Bearer",
  "expiresIn": 3600000,
  "userId": "019e87da-9b54-784d-b2b8-8a87d9a0d271",
  "email": "user@example.com",
  "fullName": "John Doe",
  "organizationId": "019e87da-9b3a-79e5-bc4c-3f509609b577",
  "roles": [
    "ROLE_TENANT_ADMIN"
  ]
}
```

### Login Flow

1. User enters email and password.
2. Frontend calls login API.
3. On success:

   * Save accessToken.
   * Save refreshToken.
   * Save user information.
   * Save organizationId.
   * Save roles.
4. Redirect user to Dashboard.

---

# 3. Refresh Token

### Endpoint

POST /api/v1/auth/refresh

### Request

```json
{
  "refreshToken": "stored-refresh-token"
}
```

### Response

```json
{
  "accessToken": "new-access-token",
  "refreshToken": "new-refresh-token",
  "tokenType": "Bearer",
  "expiresIn": 3600000,
  "userId": "019e87da-9b54-784d-b2b8-8a87d9a0d271",
  "email": "user@example.com",
  "fullName": "John Doe",
  "organizationId": "019e87da-9b3a-79e5-bc4c-3f509609b577",
  "roles": [
    "ROLE_TENANT_ADMIN"
  ]
}
```

### Refresh Flow

1. Detect expired access token.
2. Automatically call refresh endpoint.
3. Replace stored access token.
4. Replace stored refresh token.
5. Retry original request.
6. If refresh fails:

   * Clear authentication state.
   * Redirect to Login page.

---

# Frontend Requirements

## Pages

Create the following pages:

### Authentication

* Login Page
* Registration Page

### Protected

* Dashboard Page

---

# State Management

Create:

## Auth Context

Store:

```typescript
{
  userId: string;
  email: string;
  fullName: string;
  organizationId: string;
  roles: string[];
  accessToken: string;
  refreshToken: string;
}
```

Responsibilities:

* login()
* logout()
* refreshSession()
* isAuthenticated()

---

# API Layer

Create:

```text
src/services/authService.js
```

Functions:

* register()
* login()
* refreshToken()
* logout()

---

# HTTP Client

Create a reusable HTTP client:

```text
src/services/apiClient.js
```

Requirements:

* Axios
* Authorization header injection
* Request interceptor
* Response interceptor
* Automatic refresh token handling
* Retry failed requests after successful refresh

---

# Route Protection

Create:

```text
src/components/auth/ProtectedRoute.jsx
```

Responsibilities:

* Verify authentication state.
* Redirect unauthenticated users to login.
* Allow authenticated users.

---

# Local Storage

Persist:

```text
accessToken
refreshToken
userId
email
fullName
organizationId
roles
```

Restore session after browser refresh.

---

# Logout Flow

1. Remove all authentication data.
2. Clear local storage.
3. Redirect to login page.

---

# Validation

## Registration

Validate:

* First Name required
* Last Name required
* Organization Name required
* Email format
* Password minimum 8 characters

## Login

Validate:

* Email required
* Password required

---

# Folder Structure

```text
src/
├── api/
├── services/
├── contexts/
├── hooks/
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   └── dashboard/
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.jsx
│   └── layout/
├── routes/
└── utils/
```

# Deliverables

Generate:

1. Complete authentication architecture.
2. Folder structure.
3. React components.
4. Context implementation.
5. Axios client.
6. Protected routes.
7. Session persistence.
8. Refresh token mechanism.
9. Error handling.
10. Loading states.

Follow React best practices and prepare the project for future SaaS features such as organizations, analytics, feedback management, AI insights, and user management.

