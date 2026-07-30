# API_STANDARDS.md

> **Purpose**
>
> This document defines the API integration standards for this repository.
>
> Every API implementation MUST follow these guidelines to ensure consistency, reliability, security, maintainability, and scalability.
>
> **Core Principle**
>
> The UI should never communicate with an API directly without following the patterns defined in this document.

---

# General Principles

Every API implementation must be:

- Predictable
- Type-safe
- Secure
- Reusable
- Testable
- Maintainable
- Consistent

Never implement API requests ad hoc.

Always use the project's shared API layer.

---

# API Layer Architecture

The recommended flow is:

```
UI
    ↓
Custom Hook / Controller
    ↓
Service Layer
    ↓
API Client
    ↓
Backend API
```

Responsibilities:

### UI

Responsible for:

- displaying data
- user interactions
- loading states
- error states

Must NOT

- call fetch directly
- call axios directly
- contain authentication logic

---

### Custom Hooks

Responsible for

- fetching data
- mutations
- caching
- pagination
- transforming API data

Example

```
useUsers()
useProfile()
useCreateOrder()
useLogin()
```

---

### Service Layer

Responsible for

- endpoint definitions
- request construction
- response transformation

Example

```
UserService.getUsers()

RiskService.createRisk()

AuditService.deleteFinding()
```

Never call endpoints directly inside components.

---

### API Client

Responsible for

- authentication
- interceptors
- retries
- refresh token handling
- headers
- request cancellation

Only one shared API client should exist.

---

# Folder Structure

```
src/

services/
    api.ts
    auth.service.ts
    user.service.ts
    audit.service.ts
    risk.service.ts

hooks/
    useUsers.ts
    useLogin.ts
    useAudit.ts

types/
    api.ts
```

---

# Naming Convention

Services

```
UserService

RiskService

AuditService
```

Methods

```
getUsers()

getUser()

createUser()

updateUser()

deleteUser()

uploadUsers()
```

Avoid

```
fetchData()

callApi()

send()

request()
```

Method names should clearly describe the operation.

---

# Endpoint Conventions

REST naming

Good

```
GET /users

GET /users/{id}

POST /users

PATCH /users/{id}

DELETE /users/{id}
```

Avoid

```
GET /getUsers

POST /createUser

POST /deleteUser
```

Use HTTP methods correctly.

---

# HTTP Methods

GET

Retrieve data.

POST

Create resources.

PUT

Replace an existing resource.

PATCH

Update partial data.

DELETE

Delete resources.

Never misuse HTTP verbs.

---

# Request Configuration

Every request should define

- timeout
- headers
- authentication
- cancellation support

Example

```
timeout: 30000
```

Avoid infinite requests.

---

# Authentication

All authenticated requests must

- include the access token
- automatically refresh expired tokens
- retry once after refresh
- log out only when refresh fails

Never

- duplicate refresh logic
- manually attach tokens in every request

Authentication belongs in the API client.

---

# Authorization

Never assume

```
200 OK
```

Always handle

```
401 Unauthorized

403 Forbidden
```

The UI should gracefully respond.

---

# Token Storage

Sensitive tokens should be stored using secure platform storage.

Avoid storing authentication tokens in plain-text storage.

Never expose

- tokens
- refresh tokens
- secrets

Never commit credentials.

---

# Request Cancellation

Cancel requests when

- screen unmounts
- user navigates away
- duplicate requests begin

Example

```
Open Screen

↓

Fetch Data

↓

Leave Screen

↓

Cancel Request
```

Prevent unnecessary network usage.

---

# Timeouts

Every request must have a timeout.

Recommended

```
30 seconds
```

Handle timeout errors gracefully.

Never leave users waiting indefinitely.

---

# Error Handling

Never expose raw backend errors directly.

Convert API errors into user-friendly messages.

Handle

- 400
- 401
- 403
- 404
- 409
- 422
- 429
- 500
- 502
- 503
- timeout
- offline

Every screen should have

- loading
- success
- empty
- retry
- failure

---

# Error Mapping

Prefer mapping errors consistently.

Example

```
400

Invalid request.

401

Your session has expired.

403

You do not have permission.

404

Requested resource was not found.

500

Something went wrong.

503

Service temporarily unavailable.
```

Do not expose backend stack traces.

---

# Retry Strategy

Only retry

- temporary failures
- network interruptions
- timeout

Never retry

- validation errors
- authentication failures
- permission failures

Recommended

Maximum retry

```
1–2 attempts
```

Use exponential backoff.

---

# Request Deduplication

Avoid duplicate requests.

If identical requests are already running

Reuse the existing request where appropriate.

---

# Pagination

Never load thousands of records.

Support

- page
- pageSize
- cursor
- infinite scrolling

UI should support

- loading more
- refreshing
- end reached

---

# Filtering

Filtering should occur server-side whenever possible.

Example

```
GET /users?page=1&pageSize=20&status=active
```

Avoid downloading everything and filtering on the client.

---

# Sorting

Sorting should be handled server-side whenever practical.

Example

```
sort=name

order=asc
```

---

# Searching

Search inputs should

- debounce requests
- cancel previous requests
- avoid firing on every keystroke

Recommended debounce

```
300–500 ms
```

---

# Caching

Cache

- user profile
- configuration
- lookup tables
- static resources

Avoid caching

- highly sensitive data
- rapidly changing financial data unless explicitly required

Always define cache invalidation rules.

---

# Optimistic Updates

Use optimistic updates only when

- the action is reversible
- failures can be rolled back safely

Rollback on failure.

---

# File Uploads

Support

- progress indicators
- cancellation
- retry

Validate

- size
- type
- required fields

Never upload unsupported file types.

---

# File Downloads

Downloads should

- display progress
- handle failures
- support cancellation when appropriate

---

# Response Validation

Never trust backend responses.

Validate

- required fields
- null values
- array existence
- object structure

Fail gracefully.

---

# Data Transformation

Transform API responses inside

- services
- hooks

Never transform API payloads inside UI components.

---

# Logging

Development

Log

- request
- response
- duration
- errors

Production

Remove verbose logging.

Never log

- passwords
- access tokens
- refresh tokens
- personal information

---

# Performance

Reduce unnecessary requests.

Prefer

- batching
- pagination
- caching

Avoid

- sequential requests when parallel execution is possible
- repeated requests for unchanged data

---

# Offline Support

Where applicable

Support

- cached responses
- queued mutations
- synchronization after reconnecting

Detect network status before requests.

---

# API Versioning

Prefer

```
/api/v1
/api/v2
```

Avoid breaking existing clients without versioning.

---

# Environment Configuration

Never hardcode

- URLs
- API keys
- secrets

Use environment variables.

Example

```
API_BASE_URL

API_TIMEOUT

APP_ENV
```

---

# Security

Always use HTTPS.

Validate all input.

Sanitize output where applicable.

Never trust client validation alone.

---

# Type Safety

Every endpoint should have

- request types
- response types
- error types

Avoid

```
any
```

Prefer explicit interfaces or types.

---

# Code Review Checklist

Before merging

- [ ] Endpoint follows REST conventions.
- [ ] Request uses the shared API client.
- [ ] No direct fetch or axios calls inside UI.
- [ ] Request has timeout configured.
- [ ] Authentication handled automatically.
- [ ] Refresh token flow verified.
- [ ] Request cancellation supported.
- [ ] Loading state implemented.
- [ ] Empty state implemented.
- [ ] Error state implemented.
- [ ] Retry behavior implemented where appropriate.
- [ ] Pagination supported where required.
- [ ] Search is debounced.
- [ ] Duplicate requests avoided.
- [ ] Sensitive data is not logged.
- [ ] Response types defined.
- [ ] No use of `any`.
- [ ] Environment variables used correctly.
- [ ] API documentation updated if endpoints changed.

---

# AI Agent Rules

Any AI agent modifying API integrations MUST follow these rules.

## Do

- Reuse the existing API client.
- Reuse existing services whenever possible.
- Keep endpoint logic inside the service layer.
- Create strongly typed request and response models.
- Handle loading, success, empty, error, and retry states.
- Cancel requests when no longer needed.
- Respect authentication and authorization flows.
- Preserve backward compatibility unless explicitly instructed otherwise.
- Follow existing endpoint naming conventions.

## Do Not

- Call `fetch()` or `axios()` directly from UI components.
- Duplicate service logic.
- Hardcode URLs, tokens, or credentials.
- Ignore HTTP status codes.
- Retry authentication or validation failures indefinitely.
- Introduce new networking libraries without approval.
- Log sensitive information.
- Return raw backend errors directly to the UI.

---

# Definition of Done

An API integration is considered complete only when:

- It uses the shared API client.
- It follows the service-layer architecture.
- Authentication and authorization are handled correctly.
- Requests support cancellation where applicable.
- Loading, success, empty, error, and retry states are implemented.
- Request and response types are defined.
- Sensitive information is protected.
- Performance has been considered.
- Error handling is user-friendly.
- Documentation is updated.
- The implementation is production-ready.