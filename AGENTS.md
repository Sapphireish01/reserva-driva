# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

---

# Mandatory Pre-Implementation Workflow

Before implementing any feature or code change, AI agents MUST perform the following 4-step process:

1. **Read Repository Standards**: Inspect `PROJECT_CONTEXT.md`, `AGENTS.md`, `API_STANDARDS.md`, `UI_STANDARDS.md`, and `MOBILE_DEVELOPMENT_CHECKLIST.md`.
2. **Summarize Relevant Rules**: List 5–10 concise bullet points directly applicable to the feature request.
3. **Compliance & Implementation Plan**: Explain specifically how the proposed implementation will satisfy each rule.
4. **Begin Coding**: Only begin writing code after completing steps 1–3.

Do not skip this workflow under any circumstances.

---

> **Purpose**
>
> This document defines the operating rules for all AI coding agents contributing to this repository.
>
> These rules apply to Cursor, Claude Code, GitHub Copilot, Codex, Gemini CLI, Cline, Roo Code, Continue, Windsurf, and any future AI-assisted development tools.
>
> Every generated change MUST comply with this document before it is considered acceptable.

---

# Mission

Your goal is **not** to generate code.

Your goal is to produce software that is

- Production-ready
- Maintainable
- Secure
- Performant
- Accessible
- Scalable
- Consistent with the existing codebase

Never optimize for speed of implementation over code quality.

---

# Priority Order

When making decisions, follow this priority.

1. Correctness
2. Security
3. Maintainability
4. User Experience
5. Performance
6. Consistency
7. Simplicity
8. Developer Convenience

---

# Understand Before Changing

Before modifying code

You MUST

- Read related files.
- Understand the existing architecture.
- Understand the feature being modified.
- Identify reusable components.
- Follow established conventions.

Do NOT rewrite code simply because another implementation exists.

---

# Respect Existing Architecture

Always follow the repository architecture.

Never introduce new architectural patterns unless explicitly instructed.

Examples

✅ Reuse existing service layer

✅ Reuse navigation

✅ Reuse hooks

✅ Reuse design system

❌ Introduce a second API client

❌ Introduce another state management library

❌ Create duplicate components

---

# Scope Control

Modify only what is necessary.

Do NOT

- Reformat unrelated files.
- Rename unrelated variables.
- Move files without reason.
- Rewrite working code.
- Refactor unrelated modules.

Keep pull requests focused.

---

# Before Writing Code

Always identify

- Existing components
- Existing services
- Existing hooks
- Existing utilities
- Existing types
- Existing constants

Prefer extending existing code over creating new implementations.

---

# Code Style

Write code that is

- Readable
- Predictable
- Modular
- Typed
- Easy to maintain

Avoid

- Clever code
- Hidden side effects
- Deep nesting
- Magic values
- Unclear naming

Code should be understandable without explanation.

---

# Naming Standards

Names should clearly communicate intent.

Good

```
UserProfileCard

CreateAuditModal

RiskSummaryChart

useAuthentication

fetchAuditHistory
```

Avoid

```
Helper

Data

Stuff

Temp

Utils2

NewComponent
```

---

# Component Rules

Components should

- Have one responsibility.
- Be reusable.
- Accept minimal props.
- Avoid unnecessary state.
- Be composable.

Do not place API logic inside UI components.

---

# Business Logic

Business logic belongs in

- Services
- Hooks
- Controllers
- State management

Not inside UI.

---

# API Rules

Always

- Use the shared API client.
- Use service functions.
- Handle loading.
- Handle errors.
- Handle retries where appropriate.
- Cancel unnecessary requests.
- Use typed responses.

Never

- Call fetch directly inside UI.
- Hardcode URLs.
- Duplicate networking logic.

---

# State Management

Choose the smallest possible scope.

Local state

↓

Context

↓

Global store

↓

Server state

Only use global state when necessary.

---

# Performance

Every implementation should consider

- Rendering
- Memory
- Network
- Startup time
- Battery usage

Avoid

- Unnecessary renders
- Heavy computations in render
- Duplicate requests
- Memory leaks

---

# UI Standards

Every UI implementation must

- Match the approved design.
- Be responsive.
- Respect safe areas.
- Support accessibility.
- Use design tokens.
- Follow theme colors.
- Reuse components.

Never invent UI patterns without approval.

---

# Accessibility

Every feature should support

- Screen readers
- Accessibility labels
- Dynamic text sizing
- Sufficient color contrast
- Appropriate touch targets

Accessibility is required.

---

# Forms

Every form should include

- Validation
- Error handling
- Loading state
- Disabled submit state
- Server error handling

Prevent duplicate submissions.

---

# Error Handling

Every asynchronous action must support

- Loading
- Success
- Empty
- Error
- Retry

Never allow uncaught exceptions to reach users.

---

# Logging

Development

Useful logging is acceptable.

Production

Remove unnecessary logs.

Never log

- Passwords
- Tokens
- Personal information
- Secrets

---

# Security

Never

- Hardcode credentials.
- Commit secrets.
- Expose API keys.
- Trust client validation alone.

Always

- Validate input.
- Sanitize output.
- Use secure storage for sensitive data.
- Respect authentication and authorization.

---

# TypeScript Rules

Prefer

- Explicit interfaces
- Explicit types
- Narrow types
- Type inference where appropriate

Avoid

```
any
```

Use `unknown` if the type is uncertain and narrow it safely.

---

# Dependencies

Before adding a dependency

Ask

- Does the project already solve this?
- Can existing code be reused?
- Is the dependency actively maintained?
- Does it significantly increase bundle size?

Do not introduce new dependencies without clear justification.

---

# Comments

Comments should explain

- Why

Not

- What

Avoid obvious comments.

Document complex business rules.

---

# Testing Expectations

Every feature should be verified for

- Happy path
- Error path
- Edge cases
- Invalid input
- Slow network
- Offline behavior (when applicable)

Do not assume code is correct because it compiles.

---

# Documentation

Update documentation when

- Adding features
- Changing APIs
- Changing architecture
- Introducing new patterns

Documentation is part of the implementation.

---

# Pull Request Expectations

Before considering work complete

Verify

- Feature requirements met
- Existing architecture respected
- TypeScript passes
- Lint passes
- Build passes
- No console logs
- No dead code
- No duplicated logic
- Documentation updated

---

# Refactoring Rules

Refactor only when

- It improves maintainability.
- It reduces duplication.
- It fixes architecture issues.
- It improves readability.

Do not refactor unrelated code.

---

# Code Generation Principles

Prefer

Small focused changes.

Instead of

One large rewrite.

Incremental improvements reduce risk.

---

# Decision Making

If multiple valid solutions exist

Choose the solution that

- Matches the current architecture
- Minimizes complexity
- Requires the fewest new abstractions
- Is easiest for the team to maintain

---

# When Requirements Are Unclear

Do NOT invent functionality.

Instead

- Infer only from existing patterns.
- Leave a clear placeholder if instructed.
- Ask for clarification when the missing information affects correctness.

---

# Prohibited Actions

Never

- Delete unrelated code.
- Rewrite entire files unnecessarily.
- Change public APIs without reason.
- Break backward compatibility without approval.
- Introduce breaking architectural changes.
- Add TODOs as a substitute for implementation.
- Disable linting or type checking to make code compile.
- Suppress warnings without understanding them.
- Introduce duplicate utilities or components.

---

# Definition of Done Checklist

Before finishing any task, verify:

- [ ] Requirements are fully implemented.
- [ ] Existing architecture has been respected.
- [ ] No unnecessary files were modified.
- [ ] Code is modular and reusable.
- [ ] No duplicated logic exists.
- [ ] UI matches the design (if applicable).
- [ ] Accessibility requirements are met.
- [ ] Loading, empty, success, and error states are handled.
- [ ] API calls use the shared service layer.
- [ ] Types are complete and accurate.
- [ ] No use of `any` without justification.
- [ ] No hardcoded secrets or URLs.
- [ ] Performance considerations have been addressed.
- [ ] Memory leaks have been avoided.
- [ ] No unnecessary dependencies were added.
- [ ] Linting passes.
- [ ] Type checking passes.
- [ ] Build passes.
- [ ] Documentation has been updated where required.

---

# Repository Standards

The AI agent MUST comply with all repository standards, including

- `ARCHITECTURE.md` (if exists)
- `API_STANDARDS.md` (high priority)
- `UI_STANDARDS.md` (high priority)
- `MOBILE_DEVELOPMENT_CHECKLIST.md` (high priority)
- `CONTRIBUTING.md` (if present)
- Project README
- Existing code conventions

If two standards appear to conflict, follow the more specific document or request clarification.

---

# Final Principle

The objective is not to generate the most code.

The objective is to leave the codebase **better than you found it**.

Every change should improve quality, preserve consistency, and move the project toward a more maintainable, scalable, and production-ready codebase.