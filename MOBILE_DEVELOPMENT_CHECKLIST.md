# Mobile Development Engineering Checklist

> **Purpose**
>
> This document defines the engineering standards for all mobile development within this repository.
>
> Every feature, bug fix, refactor, and pull request MUST comply with this checklist before it is considered complete.
>
> **Definition of Done:** A feature is not complete because it works. It is complete when it is performant, maintainable, secure, accessible, and production-ready.

---

# Core Engineering Principles

Every implementation must prioritize:

- Performance
- Scalability
- Maintainability
- Security
- Accessibility
- Reliability
- User Experience
- Clean Architecture

Never sacrifice long-term maintainability for short-term speed.

---

# 1. Project Structure

## Required

- Organize files by feature or domain.
- Separate UI, business logic, networking, and utilities.
- Keep components small and focused.
- Reuse components instead of duplicating code.
- Use descriptive file and folder names.

Preferred structure:

```
src/
    assets/
    components/
    constants/
    hooks/
    navigation/
    screens/
    services/
    store/
    types/
    utils/
```

Avoid

- Giant files
- Deep nesting
- Duplicate logic
- Circular dependencies

---

# 2. UI Development

Every screen must

- Match the design exactly.
- Be responsive.
- Support various screen sizes.
- Respect Safe Areas.
- Handle orientation where applicable.
- Avoid hardcoded dimensions whenever possible.

Use

- Flexbox
- Reusable components
- Consistent spacing
- Design tokens
- Theme variables

Never

- Hardcode colors repeatedly.
- Hardcode font sizes everywhere.
- Duplicate layouts.

---

# 3. Component Design

Components should

- Have a single responsibility.
- Accept only required props.
- Avoid unnecessary state.
- Be reusable.
- Be composable.

Avoid

- Massive components
- Business logic inside UI
- Deep prop drilling

Prefer

- Custom hooks
- Context (only when appropriate)
- State management libraries for shared state

---

# 4. Performance

Every feature must be optimized.

## Rendering

Avoid unnecessary renders.

Use

- memo()
- useMemo()
- useCallback

Only optimize after identifying actual bottlenecks.

---

## Lists

Never render large datasets using

```
array.map()
```

Use

- FlashList
- FlatList

Always configure

- keyExtractor
- estimatedItemSize (FlashList)
- getItemLayout when applicable
- pagination or infinite scrolling for large datasets

---

## Images

Images must

- Use modern formats where supported.
- Load only required sizes.
- Be lazy loaded where appropriate.
- Use placeholders when loading.

Never download large images for small views.

---

## Startup Performance

App startup should

- Load only essential resources.
- Delay non-critical work.
- Lazy load heavy modules.
- Keep the initial bundle lightweight.

---

# 5. Networking

Every request should

- Handle loading states.
- Handle failures.
- Handle timeouts.
- Handle offline scenarios where appropriate.
- Handle retries carefully.

Avoid

- Duplicate requests
- Unnecessary polling
- Blocking the UI

Always

- Cancel requests when leaving screens.
- Cache responses when appropriate.
- Debounce user-triggered searches.

---

# 6. State Management

Choose the smallest appropriate scope.

Local State

Use for

- UI state
- Form state
- Temporary interactions

Global State

Use only when data is shared across multiple areas.

Server State

Use dedicated data-fetching libraries for

- caching
- synchronization
- retries
- invalidation

Avoid storing server state inside global stores.

---

# 7. Forms

Every form must

- Validate inputs.
- Prevent duplicate submissions.
- Display field-level errors.
- Display server errors.
- Disable submission while processing.
- Preserve user input when validation fails.

Support

- Keyboard avoidance
- Correct keyboard types
- AutoComplete
- AutoCapitalize
- Secure text entry where applicable

---

# 8. Navigation

Navigation should

- Be predictable.
- Support deep linking if required.
- Preserve navigation state appropriately.
- Avoid unnecessary nested navigators.

Lazy load feature screens where possible.

---

# 9. Error Handling

Every feature must support

- Loading
- Success
- Empty
- Error
- Retry
- Offline

Never allow the application to crash because of an API error.

Show user-friendly error messages.

Log technical details separately.

---

# 10. Offline Support

Where applicable

Support

- Cached content
- Queued actions
- Synchronization after reconnecting

Gracefully recover from network interruptions.

---

# 11. Authentication

Authentication must

- Protect private routes.
- Refresh tokens securely.
- Handle expired sessions.
- Log users out safely when required.

Never expose

- Tokens
- Secrets
- API keys

Never store sensitive credentials in insecure storage.

---

# 12. Security

Never

- Commit secrets.
- Hardcode credentials.
- Trust client-side validation alone.

Always

- Validate server responses.
- Sanitize user input.
- Use HTTPS.
- Store sensitive information securely.

---

# 13. Accessibility

Every screen should

- Support screen readers.
- Include accessibility labels.
- Maintain sufficient color contrast.
- Respect font scaling.
- Use touch targets that are easy to interact with.

Accessibility is part of the feature, not an optional enhancement.

---

# 14. Animations

Animations should

- Improve usability.
- Be smooth.
- Avoid blocking interactions.

Never animate excessively.

Prioritize responsiveness over visual effects.

---

# 15. Memory Management

Always clean up

- Timers
- Event listeners
- Subscriptions
- WebSockets
- Background tasks

Never leave resources active after a screen unmounts.

---

# 16. Battery Optimization

Avoid

- Constant polling
- Unnecessary GPS usage
- Continuous background work
- Infinite animation loops

Prefer

- Event-driven updates
- Push notifications
- Background execution only when necessary

---

# 17. Logging

Development

Detailed logs are acceptable.

Production

Remove unnecessary logs.

Never log

- Tokens
- Passwords
- Sensitive user information

---

# 18. Testing

Every feature should be tested for

## Functional

- Expected behavior
- Edge cases
- Invalid input

## Device

- Android
- iOS
- Small screens
- Large screens

## Network

- Slow connections
- Offline mode
- Timeout scenarios

## Performance

- Large datasets
- Memory usage
- Startup time
- Navigation speed

---

# 19. Code Quality

Before committing

- Remove dead code.
- Remove commented code.
- Remove unused imports.
- Remove console logs.
- Format the code.
- Resolve lint warnings.
- Resolve TypeScript errors.

Code should be

- Readable
- Consistent
- Predictable
- Self-documenting

---

# 20. Documentation

Every significant feature should include

- Purpose
- API usage
- Assumptions
- Limitations
- Edge cases

Complex logic should be explained with comments when necessary.

---

# 21. Pull Request Checklist

Before opening a Pull Request

- [ ] Feature works correctly.
- [ ] UI matches the design.
- [ ] Responsive across devices.
- [ ] No unnecessary re-renders.
- [ ] Lists optimized.
- [ ] Images optimized.
- [ ] Loading state implemented.
- [ ] Empty state implemented.
- [ ] Error state implemented.
- [ ] Retry flow implemented.
- [ ] Offline behavior considered.
- [ ] API errors handled.
- [ ] Validation completed.
- [ ] Authentication respected.
- [ ] Accessibility verified.
- [ ] Memory leaks checked.
- [ ] Performance reviewed.
- [ ] No secrets committed.
- [ ] TypeScript passes.
- [ ] Lint passes.
- [ ] Tests pass.
- [ ] Documentation updated.

---

# AI Agent Development Rules

Any AI coding agent working in this repository MUST follow these rules.

## Do

- Analyze the existing architecture before making changes.
- Reuse existing components whenever possible.
- Follow existing naming conventions.
- Keep implementations modular.
- Prioritize readability over cleverness.
- Optimize only where justified.
- Preserve backward compatibility unless instructed otherwise.
- Handle loading, success, empty, and error states for every asynchronous operation.
- Consider accessibility and performance in every implementation.
- Update documentation when introducing new patterns.

## Do Not

- Rewrite unrelated files.
- Introduce unnecessary dependencies.
- Duplicate existing functionality.
- Hardcode values that should be configurable.
- Ignore linting or type errors.
- Bypass architecture or state management conventions.
- Commit placeholder code or TODOs without explicit approval.
- Introduce breaking changes without documenting them.

When uncertain, prefer consistency with the existing codebase over introducing a new pattern.

---

# Definition of Done

A feature is considered complete only when:

- It satisfies the functional requirements.
- It follows the architecture.
- It is secure.
- It performs well.
- It handles edge cases.
- It is accessible.
- It is documented.
- It passes code review.
- It is production-ready.

Working code is the starting point.

Production-ready code is the goal.