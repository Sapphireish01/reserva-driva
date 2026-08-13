# Loading & Perceived Performance UI Standard

## 1. Purpose

This standard defines how loading states must be designed and implemented across the mobile application.

The objective is not simply to indicate that an API request is running. The objective is to make the application **feel responsive, predictable, and usable while data is loading**.

This standard applies to:

- Screens
- Cards
- Lists
- Dropdowns
- Forms
- Buttons
- Images
- API-driven components
- Navigation
- Pagination
- Pull-to-refresh
- Mutations
- Search and filtering
- Authentication
- Background data fetching

It is intended to be followed by both human developers and AI coding agents.

---

## 2. Core Principle

> **Loading UI should communicate progress without making the application feel blocked.**

Developers and agents must avoid unnecessary full-screen loading states.

Prefer:

```text
Component-level loading
        +
Skeleton UI
        +
Cached data
        +
Progressive rendering
        +
Background refresh
```

over:

```text
Screen
  ↓
"Loading..."
  ↓
Wait
  ↓
Everything appears
```

---

## 3. Loading State Hierarchy

Every asynchronous UI component should consider these states:

```text
IDLE
  ↓
INITIAL_LOADING
  ↓
SUCCESS
  ├── REFRESHING
  ├── UPDATING
  └── PAGINATING
  ↓
ERROR

SUCCESS
  ↓
EMPTY
```

At minimum, an API-driven component should explicitly handle:

- Loading
- Success
- Empty
- Error
- Refreshing where applicable
- Updating where applicable
- Pagination where applicable

Do not assume that `isLoading === false` automatically means the UI has usable data.

---

## 4. Never Use Global Loading by Default

### Bad

```tsx
if (isLoading) {
  return <FullScreenLoader />;
}

return <Dashboard />;
```

This blocks the entire screen even when only one section is loading.

### Preferred

```tsx
<Header />

<BalanceCard>
  {balanceLoading ? (
    <BalanceSkeleton />
  ) : (
    <Balance balance={balance} />
  )}
</BalanceCard>

<RecentRides>
  {ridesLoading ? (
    <RideListSkeleton />
  ) : (
    <RideList rides={rides} />
  )}
</RecentRides>
```

Each section should be independently responsible for its loading state.

---

## 5. Use Skeleton UI for Initial Content Loading

Skeletons should be used when the final content has a predictable layout.

Examples:

- Cards
- Profiles
- Lists
- Dashboard statistics
- Feed items
- Car information
- User information
- Booking information

### Example

```tsx
{isLoading ? (
  <CarCardSkeleton />
) : (
  <CarCard car={car} />
)}
```

### Skeleton requirements

Skeletons must:

- Match the final layout
- Preserve spacing
- Preserve approximate dimensions
- Avoid causing layout shifts
- Use subtle animation
- Be reusable
- Be accessible where applicable
- Not contain excessive visual movement

---

## 6. Do Not Use Skeletons Everywhere

Skeletons are not mandatory for every asynchronous operation.

Use a skeleton when:

> The user is waiting for content that has not previously existed on the screen.

Do not replace already-visible content with a skeleton simply because the application is refreshing it.

### Example

Existing data:

```text
Toyota Camry
Lagos → Abuja
₦25,000
```

Refreshing:

```text
Toyota Camry
Lagos → Abuja
₦25,000

          ↻ refreshing
```

Do **not** replace the existing content with skeletons during a background refresh.

---

## 7. Preserve Existing Data During Refresh

When new data is being fetched and valid previous data exists, keep the previous data visible.

### Preferred

```text
Existing data
     ↓
Background request
     ↓
Keep existing UI
     ↓
Update when request completes
```

### Avoid

```text
Existing data
     ↓
Clear screen
     ↓
Loading
     ↓
New data
```

This creates unnecessary visual instability.

---

## 8. Distinguish Initial Loading From Refreshing

These are different UX states.

### Initial loading

No usable data exists.

```tsx
if (isLoading && !data) {
  return <Skeleton />;
}
```

### Refreshing

Data already exists.

```tsx
if (data) {
  return (
    <>
      <Content data={data} />
      {isFetching && <RefreshIndicator />}
    </>
  );
}
```

The user should continue interacting with existing content while appropriate background requests are running.

---

## 9. Dropdown Loading Standard

Dropdowns must not unnecessarily block the entire form.

### Bad

```text
Loading...
```

or:

```text
Please wait while we load the form.
```

### Preferred

```text
Vehicle Type
[ Loading options... ▼ ]
```

The dropdown should be temporarily disabled.

Once data arrives:

```text
Vehicle Type
[ SUV              ▼ ]
```

### Important

If dropdown data is relatively static, it should be:

- Cached
- Prefetched where possible
- Reused between screens

Examples:

- Countries
- States
- Cities
- Vehicle Types
- Vehicle Brands
- Categories

---

## 10. Prefetch Data When Predictable

If the application knows that data will likely be required soon, fetch it before the user explicitly requests it.

Example:

```text
User opens booking screen
        ↓
Prefetch vehicle types
        ↓
User fills booking information
        ↓
User opens vehicle type dropdown
        ↓
Data is already available
```

Agents should consider prefetching when:

- The next screen is predictable
- Dropdown options are known in advance
- Data is relatively small
- Data changes infrequently
- The user is highly likely to need the data

Do not prefetch large or unnecessary datasets indiscriminately.

---

## 11. Cache Stable Data

Data that does not change frequently should not be repeatedly fetched without reason.

Examples:

- Vehicle types
- Vehicle brands
- Countries
- States
- Cities
- App configuration
- User permissions
- Reference data

Preferred flow:

```text
First request
    ↓
API
    ↓
Cache
    ↓
UI

Future request
    ↓
Cache → UI immediately
    ↓
Background API request
    ↓
Update cache if necessary
```

When using TanStack Query or another data-fetching library, configure appropriate caching and stale-time behavior.

Do not introduce custom caching when the application's existing data layer already provides this functionality.

---

## 12. Button Loading

Buttons that trigger mutations must communicate that an operation is being processed.

### Before

```text
[ Book Ride ]
```

### During

```text
[ ⏳ Booking... ]
```

or a consistent application-specific loading indicator.

The button should normally be disabled during the mutation to prevent accidental duplicate submissions.

### Example

```tsx
<Button
  disabled={isPending}
  onPress={handleBooking}
>
  {isPending ? 'Booking...' : 'Book Ride'}
</Button>
```

Do not allow multiple identical submissions unless the product explicitly requires it.

---

## 13. Avoid Layout Shifts

Loading UI must reserve approximately the same space as the final content.

### Bad

```text
Loading...
```

Then:

```text
Large card
Large image
Multiple text rows
Buttons
```

This causes the screen to jump.

### Preferred

```text
┌──────────────────────┐
│                      │
│      Skeleton        │
│                      │
├──────────────────────┤
│ █████████████        │
│ ███████              │
│ ████████████         │
└──────────────────────┘
```

The final content should occupy approximately the same dimensions.

---

## 14. Lists

For lists, render multiple skeleton items rather than one generic loader.

Example:

```tsx
{isLoading ? (
  <>
    <RideSkeleton />
    <RideSkeleton />
    <RideSkeleton />
    <RideSkeleton />
  </>
) : (
  <RideList data={rides} />
)}
```

The number of skeletons should approximate the amount of content that can fit within the viewport.

Do not render hundreds of skeletons unnecessarily.

---

## 15. Pagination

Pagination must not replace the existing list with a full-screen loader.

### Preferred

```text
Ride 1
Ride 2
Ride 3
Ride 4

[ Loading more... ]
```

or an inline activity indicator at the bottom.

Existing items remain visible.

---

## 16. Infinite Scroll

For infinite scrolling:

```text
Existing items
      ↓
User reaches bottom
      ↓
Fetch next page
      ↓
Show bottom loader
      ↓
Append new items
```

Never reset the list during pagination.

---

## 17. Search

Search should not cause aggressive full-screen loading.

For search:

```text
Search: Toyota
       ↓
Debounce
       ↓
Request
       ↓
Update results
```

Use a small inline loading indicator when appropriate.

Avoid making every keystroke trigger an API request.

Agents should check whether the project already has a debounce utility before creating another one.

---

## 18. Images

Images are also asynchronous content.

Use:

- Placeholder backgrounds
- Skeletons
- Blur placeholders where supported
- Proper dimensions
- Progressive image loading where appropriate

Avoid allowing images to load without reserved dimensions because this can cause layout shifts.

---

## 19. Empty States Are Not Loading States

Do not confuse:

```text
Loading
```

with:

```text
No data
```

These are different states.

### Loading

```text
████████
████████
████████
```

### Empty

```text
No rides yet.

Your upcoming rides will appear here.
```

### Error

```text
Unable to load your rides.

[ Try Again ]
```

Agents must explicitly distinguish these states.

---

## 20. Error After Loading

If the initial request fails:

```text
Unable to load rides.

[ Try Again ]
```

If refreshing existing data fails, preserve the existing data where possible.

Example:

```text
Your rides

Ride A
Ride B
Ride C

Unable to refresh.
[ Try Again ]
```

Do not unnecessarily destroy valid existing data because a refresh request failed.

---

## 21. Minimum Loading Duration

Avoid artificial delays simply to make an animation visible.

Do not implement:

```tsx
await api();
await sleep(2000);
```

unless there is a documented UX reason.

The UI should respond as soon as the real operation completes.

If extremely fast responses cause an undesirable visual flash, use a carefully controlled minimum display threshold only where UX testing justifies it.

---

## 22. Loading Animation Standard

Animations should be:

- Subtle
- Consistent
- Short
- Non-distracting
- Performant

Avoid:

- Excessive bouncing
- Large spinning elements
- Multiple competing animations
- Continuous animations across the entire screen
- Animations that consume significant CPU/GPU resources

Prefer the application's existing animation system and design tokens.

Do not introduce a new animation library for a simple loading state if an existing project dependency can handle it.

---

## 23. Network-Aware UX

Mobile networks can be:

- Slow
- Intermittent
- High latency
- Temporarily unavailable

The UI must not assume that API requests will always complete quickly.

For important requests:

```text
Request
  ↓
Loading
  ↓
Success
```

or:

```text
Request
  ↓
Loading
  ↓
Timeout / Network Error
  ↓
Retry
```

Provide a meaningful recovery path.

---

## 24. Authentication Loading

Authentication should be handled separately from ordinary screen loading.

The application may need to determine:

- Is there a valid access token?
- Is the refresh token valid?
- Is the session being restored?

During session restoration, avoid briefly displaying the authenticated screen and then redirecting to login.

Prefer:

```text
App launch
    ↓
Restore session
    ↓
Authenticated → App
Unauthenticated → Login
```

A short splash/session restoration state is acceptable.

---

## 25. Loading State Ownership

The component closest to the asynchronous operation should generally own its loading state.

### Avoid

```tsx
<App>
  const [loading, setLoading] = useState(false);

  // Everything depends on this one state
</App>
```

### Prefer

```text
Dashboard
├── ProfileSection → profileLoading
├── BalanceSection → balanceLoading
├── RideSection → ridesLoading
└── ActivitySection → activityLoading
```

This allows independent rendering.

---

## 26. Avoid Boolean Loading State Explosion

Do not blindly create dozens of unrelated states:

```tsx
const [isLoading, setIsLoading] = useState(false);
const [isLoadingUsers, setIsLoadingUsers] = useState(false);
const [isLoadingCars, setIsLoadingCars] = useState(false);
const [isLoadingStates, setIsLoadingStates] = useState(false);
const [isLoadingBrands, setIsLoadingBrands] = useState(false);
```

If the project's data-fetching library already exposes query-level states, use them.

Follow the project's existing architecture before introducing new state-management patterns.

---

## 27. Loading and Accessibility

Loading states must remain understandable to users who cannot rely on animation alone.

Consider:

- Accessible labels
- Screen reader announcements where appropriate
- Disabled state communication
- Sufficient contrast
- Reduced-motion preferences where supported

Never make animation the only indication that something is happening.

---

## 28. Performance Rules

Loading UI itself must not become a performance problem.

Agents must avoid:

- Rendering excessive skeleton components
- Running expensive animations
- Re-rendering entire screens unnecessarily
- Creating timers for every component
- Starting duplicate API requests
- Fetching data already present in cache
- Loading unnecessary resources

Use list virtualization for large datasets.

---

## 29. API Request Deduplication

Before implementing a new API request, check whether the requested data is already being fetched elsewhere.

Avoid:

```text
Screen A → GET /vehicles
Screen B → GET /vehicles
Component C → GET /vehicles
```

when these requests can share the same query/cache.

Prefer a centralized data-fetching strategy.

---

## 30. Loading Design Decision Matrix

| Situation | Preferred UI |
|---|---|
| First load, no data | Skeleton |
| Existing data + refresh | Keep data + refresh indicator |
| Button mutation | Loading button |
| Dropdown fetching | Disabled dropdown + inline indicator |
| Large list initial load | List skeletons |
| Pagination | Bottom loader |
| Pull-to-refresh | Native refresh indicator |
| Search | Inline indicator |
| Image loading | Placeholder/skeleton |
| Empty result | Empty state |
| Request failure | Error state + retry |
| Session restoration | Splash/session loader |
| Background refetch | Keep existing data |
| Static reference data | Cache/prefetch |

---

## 31. Agent Implementation Rules

When implementing or modifying a screen, AI agents **MUST** inspect the existing project before introducing a loading pattern.

Check:

- Existing loading components
- Existing skeleton components
- Existing API/data-fetching library
- Existing query hooks
- Existing design system
- Existing animation utilities
- Existing error handling
- Existing caching strategy
- Existing button components
- Existing empty states

Do not create duplicate infrastructure when an equivalent implementation already exists.

---

## 32. Agent Decision Process

Before implementing asynchronous UI, agents should internally evaluate:

```text
1. What data is loading?

2. Is this initial loading or background refresh?

3. Does previous data exist?

4. Can the data be cached?

5. Can it be prefetched?

6. Should this component load independently?

7. What should the skeleton look like?

8. What happens if the request fails?

9. What happens if the result is empty?

10. Can the user continue interacting with the rest of the screen?

11. Does the existing codebase already have a pattern for this?

12. Will this implementation create duplicate requests or unnecessary renders?
```

---

## 33. Agent Rules: MUST

AI agents implementing UI **MUST**:

- [ ] Handle initial loading states.
- [ ] Handle empty states where applicable.
- [ ] Handle error states.
- [ ] Preserve existing data during background refresh where possible.
- [ ] Use skeletons for content-heavy initial loading.
- [ ] Use component-level loading instead of unnecessary full-screen loaders.
- [ ] Disable mutation buttons while the mutation is pending.
- [ ] Prevent accidental duplicate submissions.
- [ ] Preserve layout dimensions during loading.
- [ ] Reuse existing loading components.
- [ ] Reuse existing data-fetching and caching infrastructure.
- [ ] Consider caching relatively static reference data.
- [ ] Consider prefetching predictable data.
- [ ] Keep pagination loaders localized to the list.
- [ ] Ensure loading UI does not introduce significant performance overhead.

---

## 34. Agent Rules: MUST NOT

AI agents **MUST NOT**:

- [ ] Replace an entire screen with `Loading...` when only one section is loading.
- [ ] Clear valid existing data merely because a refresh is occurring.
- [ ] Introduce arbitrary artificial delays.
- [ ] Create a new loading component when an equivalent component already exists.
- [ ] Create a new state-management solution without checking the existing architecture.
- [ ] Fetch the same data repeatedly when it can be shared or cached.
- [ ] Display an empty state while data is still loading.
- [ ] Display stale data as though it were confirmed fresh when freshness matters.
- [ ] Use excessive loading animations.
- [ ] Render hundreds of skeletons for large lists.
- [ ] Allow users to submit the same mutation repeatedly while it is pending.
- [ ] Introduce a new dependency solely for a simple loading animation without justification.

---

## 35. Standard Component Pattern

A reusable data-driven component should conceptually follow:

```tsx
if (isInitialLoading) {
  return <ComponentSkeleton />;
}

if (isError && !data) {
  return <ErrorState onRetry={refetch} />;
}

if (!data || isEmpty(data)) {
  return <EmptyState />;
}

return (
  <>
    <Component data={data} />

    {isRefreshing && (
      <RefreshIndicator />
    )}
  </>
);
```

The exact implementation should follow the project's existing architecture and data-fetching library.

---

## 36. Recommended Architecture

```text
                    API
                     │
                     ↓
              API Service Layer
                     │
                     ↓
          Query / Data Management
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
       Cache                 Request State
          │                     │
          └──────────┬──────────┘
                     ↓
                UI Component
                     │
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
    Skeleton       Content       Error
       │             │             │
       └─────────────┼─────────────┘
                     ↓
                Empty State
```

---

## 37. Definition of Done

A feature involving asynchronous data is **not complete** until:

- [ ] Initial loading is handled.
- [ ] Skeleton/loading UI matches the final layout.
- [ ] Existing data is preserved during refresh where appropriate.
- [ ] Empty results are handled.
- [ ] API errors are handled.
- [ ] Retry behavior is available where appropriate.
- [ ] Mutations provide button-level feedback.
- [ ] Duplicate submissions are prevented.
- [ ] Pagination/loading-more states are handled.
- [ ] Dropdown loading states are handled.
- [ ] Static/reference data is cached where appropriate.
- [ ] Existing project loading patterns have been reused.
- [ ] No unnecessary global loading state has been introduced.
- [ ] No artificial delay has been added.
- [ ] Loading animations do not negatively affect performance.
- [ ] The implementation has been tested on a realistic mobile/network condition.

---

## 38. Guiding Principle for Agents

> **Do not ask, "Where should I put the spinner?"**
>
> Ask, **"What can the user still see and interact with while this data is being fetched?"**

The best loading experience is often one where the user **doesn't feel like they are waiting at all**.
