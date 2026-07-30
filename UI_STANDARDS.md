# UI_STANDARDS.md

> **Purpose**
>
> This document defines the UI/UX engineering standards for this repository.
>
> Every screen, component, modal, form, and interaction MUST comply with these standards before it is considered production-ready.
>
> **Core Principle**
>
> A great UI is not just visually appealing—it is intuitive, accessible, responsive, performant, and consistent throughout the application.

---

# Design Philosophy

Every interface should be

- Simple
- Consistent
- Predictable
- Accessible
- Responsive
- Performant
- Maintainable

Users should never have to guess how the interface works.

---

# Design System First

Always build using the project's design system.

Use

- Design tokens
- Theme colors
- Typography scale
- Spacing scale
- Shared components

Never hardcode values that already exist in the design system.

Avoid

- Random colors
- Arbitrary spacing
- Different button styles
- Inconsistent typography

---

# Visual Consistency

Every screen should follow the same visual language.

Maintain consistency for

- Colors
- Typography
- Border radius
- Shadows
- Elevation
- Iconography
- Buttons
- Inputs
- Cards
- Tables
- Modals

The same interaction should always look and behave the same way.

---

# Layout Standards

Prefer

- Flexbox
- Responsive layouts
- Dynamic sizing
- Percentage or flex-based dimensions

Avoid

- Fixed widths
- Fixed heights
- Absolute positioning unless required

Layouts should adapt gracefully to

- Small phones
- Large phones
- Tablets
- Landscape orientation (where supported)

---

# Safe Areas

Every screen must respect

- Status bar
- Notch
- Dynamic Island
- Navigation gestures
- Bottom insets

Never allow important content to be clipped.

---

# Spacing

Use a consistent spacing scale.

Example

```
4
8
12
16
20
24
32
40
48
64
```

Never use random spacing values.

Related elements should be visually grouped.

---

# Typography

Typography should communicate hierarchy.

Maintain consistency for

- Font family
- Font weight
- Line height
- Letter spacing
- Font scaling

Every screen should clearly distinguish

- Page title
- Section title
- Body text
- Caption
- Labels
- Buttons

Avoid using too many font sizes.

---

# Colors

Use semantic colors.

Examples

- Primary
- Secondary
- Success
- Warning
- Error
- Info
- Background
- Surface
- Border
- Disabled
- Text Primary
- Text Secondary

Never hardcode hex values throughout the application.

Always reference theme variables.

---

# Icons

Icons should

- Be consistent
- Use one icon library unless approved
- Match text alignment
- Maintain consistent sizing

Do not mix multiple icon styles.

---

# Buttons

Buttons should clearly communicate actions.

Every button must have

- Default state
- Pressed state
- Disabled state
- Loading state
- Focus state (where applicable)

Support

- Primary
- Secondary
- Tertiary
- Destructive
- Text buttons

Never allow multiple competing primary buttons on the same screen.

---

# Touch Targets

Interactive elements should be easy to tap.

Minimum recommended touch area

```
44 x 44 dp
```

Avoid tiny icons that require precision.

---

# Forms

Every form must

- Validate inputs
- Display inline errors
- Display server errors
- Prevent duplicate submissions
- Preserve entered data on validation failure

Use the appropriate keyboard type

Examples

- Email
- Numeric
- Phone
- URL

Support

- AutoComplete
- AutoCapitalize
- Secure text entry
- Return key actions

---

# Input Fields

Inputs should always include

- Label
- Placeholder (when appropriate)
- Validation
- Disabled state
- Error state
- Helper text (if needed)

Never rely on placeholders as labels.

---

# Dropdowns

Dropdowns should

- Support search for long lists
- Display loading state
- Display empty state
- Support keyboard dismissal
- Close after selection unless multi-select

Avoid long unsearchable dropdowns.

---

# Lists

Large lists should use virtualization.

Support

- Infinite scrolling
- Pull to refresh
- Loading footer
- Empty state
- Skeleton loading

Never render extremely large datasets at once.

---

# Cards

Cards should maintain

- Consistent padding
- Border radius
- Elevation
- Shadows
- Alignment

Avoid inconsistent card designs.

---

# Navigation

Navigation should be

- Predictable
- Simple
- Consistent

Support

- Back navigation
- Deep linking where required
- State restoration where applicable

Avoid confusing navigation hierarchies.

---

# Loading States

Never leave users wondering.

Every asynchronous screen should have

- Skeleton loading
- Spinner (where appropriate)
- Progress indicators

Prefer skeletons over blank screens.

---

# Empty States

Every empty screen should explain

- Why nothing is shown
- What users can do next

Include

- Illustration (optional)
- Helpful message
- Call-to-action

Avoid blank pages.

---

# Error States

Error messages should

- Explain the issue
- Suggest a solution
- Offer retry

Never display raw backend errors.

---

# Success Feedback

Provide feedback after successful actions.

Examples

- Toast
- Snackbar
- Banner
- Confirmation screen

Users should never wonder if an action succeeded.

---

# Confirmation Dialogs

Require confirmation before

- Deleting
- Logging out
- Permanent actions
- Financial actions
- Irreversible changes

Avoid unnecessary confirmations.

---

# Modals

Use modals only for focused tasks.

Every modal should

- Have a clear title
- Explain its purpose
- Support dismissal
- Prevent accidental data loss

Avoid stacking multiple modals.

---

# Bottom Sheets

Use bottom sheets for

- Action menus
- Filters
- Selectors
- Short forms

Avoid placing complex workflows inside bottom sheets.

---

# Animations

Animations should improve usability.

Animations must be

- Fast
- Smooth
- Purposeful

Avoid

- Excessive motion
- Long transitions
- Decorative animations that delay interaction

Respect reduced motion preferences where supported.

---

# Gestures

Gesture interactions should feel natural.

Support

- Swipe
- Pull to refresh
- Long press
- Drag (where appropriate)

Avoid hidden gestures without visible alternatives.

---

# Accessibility

Every screen must support

- Screen readers
- Accessibility labels
- Proper roles
- Dynamic font scaling
- High color contrast
- Keyboard navigation where applicable

Accessibility is required, not optional.

---

# Responsive Design

The UI should adapt to

- Different screen sizes
- Tablets
- Foldables (when supported)
- Landscape orientation (where applicable)

Never assume one screen size.

---

# Images

Images should

- Be optimized
- Maintain aspect ratio
- Include placeholders
- Handle loading failures

Avoid stretching or pixelation.

---

# Dark Mode

If supported

Every component must work in

- Light mode
- Dark mode

Never hardcode colors that break themes.

---

# Feedback & Microinteractions

Provide immediate feedback for

- Button presses
- Form submission
- Refresh actions
- Navigation
- Long-running operations

The interface should always acknowledge user input.

---

# Performance

Avoid

- Unnecessary re-renders
- Large component trees
- Heavy animations
- Rendering hidden components

Optimize only after measuring performance.

---

# Reusability

Before creating a new component

Ask

- Does this already exist?
- Can it be extended?
- Can it be generalized?

Prefer reusable components over one-off implementations.

---

# Component Naming

Use descriptive names.

Examples

```
PrimaryButton

UserCard

AuditStatusBadge

SearchInput

ConfirmationModal

LoadingOverlay

RiskTable
```

Avoid

```
Button1

CardNew

Temp

Widget

TestComponent
```

---

# Component Responsibilities

A component should have one responsibility.

Separate

- Presentation
- Business logic
- API interactions
- State management

Avoid "God Components."

---

# UI Code Quality

Every component should

- Be readable
- Be reusable
- Be typed
- Have clear props
- Avoid unnecessary complexity

Remove

- Dead code
- Commented code
- Unused props
- Unused imports

---

# AI Agent UI Rules

Any AI agent working on the UI MUST follow these rules.

## Do

- Match the provided design precisely.
- Reuse existing components whenever possible.
- Follow the established design system.
- Maintain responsive layouts.
- Handle loading, empty, success, and error states.
- Respect accessibility standards.
- Keep components focused and reusable.
- Preserve visual consistency across the application.
- Use theme tokens instead of hardcoded values.
- Test interactions across common device sizes.

## Do Not

- Invent new UI patterns without approval.
- Introduce inconsistent spacing or typography.
- Hardcode colors or dimensions.
- Modify unrelated components.
- Break existing navigation patterns.
- Ignore accessibility requirements.
- Replace reusable components with duplicated code.
- Sacrifice usability for visual effects.

---

# Pull Request UI Checklist

Before submitting a Pull Request

- [ ] Matches the approved design.
- [ ] Responsive on supported devices.
- [ ] Safe Areas respected.
- [ ] Uses design system components.
- [ ] Uses theme colors.
- [ ] Typography is consistent.
- [ ] Spacing follows design tokens.
- [ ] Forms validate correctly.
- [ ] Loading states implemented.
- [ ] Empty states implemented.
- [ ] Error states implemented.
- [ ] Success feedback implemented.
- [ ] Accessibility verified.
- [ ] No visual regressions.
- [ ] Animations are smooth and purposeful.
- [ ] Dark mode verified (if supported).
- [ ] No hardcoded styling values.
- [ ] Components are reusable and maintainable.
- [ ] Linting and TypeScript pass.
- [ ] UI is production-ready.

---

# Definition of Done

A UI implementation is complete only when it

- Matches the approved design.
- Is responsive across supported devices.
- Is accessible.
- Uses the design system.
- Handles all interaction states.
- Performs smoothly.
- Is maintainable.
- Reuses existing components where appropriate.
- Passes review.
- Is production-ready.

**A beautiful interface that is inconsistent, inaccessible, or difficult to maintain is not considered complete.**