# Project Context: Reserva Driver (`reserva-driver`)

## 📱 Project Overview
**Reserva Driver** is a cross-platform React Native / Expo mobile application built for drivers. It allows drivers to manage trip availability, accept/decline passenger booking requests, track earnings and transaction history, manage vehicles and compliance documentation, and configure driver account preferences.

---

## 📚 Project Governance & Standards Documents
All contributors and AI coding agents MUST check and adhere to the following repository standards:

1. **[AGENTS.md](file:///c:/Users/DELL/Desktop/Clients/Mobile/reserva-driver/AGENTS.md)**: Operating rules, priority order, scope control, and prohibited actions.
2. **[API_STANDARDS.md](file:///c:/Users/DELL/Desktop/Clients/Mobile/reserva-driver/API_STANDARDS.md)**: Service layer architecture, single shared Axios client, request interceptors, cancellation, error mapping, and typing.
3. **[UI_STANDARDS.md](file:///c:/Users/DELL/Desktop/Clients/Mobile/reserva-driver/UI_STANDARDS.md)**: Design tokens, layout standards, touch targets, loading/empty/error states, and typography.
4. **[MOBILE_DEVELOPMENT_CHECKLIST.md](file:///c:/Users/DELL/Desktop/Clients/Mobile/reserva-driver/MOBILE_DEVELOPMENT_CHECKLIST.md)**: Engineering principles, performance optimization, list virtualization, security, and Definition of Done.
5. **[README.md](file:///c:/Users/DELL/Desktop/Clients/Mobile/reserva-driver/README.md)**: Repository setup and startup instructions.

---

## 🛠 Tech Stack & Strict Constraints

- **Framework**: React Native (`v0.81.5`), **Expo SDK 54 (pinned)**.
  > ⚠️ Do not upgrade Expo SDK past 54 without checking store availability for Expo Go.
- **Language**: TypeScript (`~5.9.2`, strict mode).
- **Navigation**: **React Navigation (native-stack v7)** with typed parameter lists (`AuthStackParamList`, `MainStackParamList`). Do not introduce file-based routing or Expo Router abstractions on top of this.
- **Networking**: Single shared Axios client (`src/api/client.ts`) with request/response interceptors (auth token injection, 401 refresh-and-retry). Do not create ad-hoc axios instances per screen.
- **Server & Global State**: TanStack Query (`v5`) for server state caching/synchronization; Zustand (`v5`) for global client state (e.g. `src/state/authStore.ts`).
- **Form Management**: `react-hook-form` + `zod` schema validation.
- **Styling**: `StyleSheet` with shared design tokens in `src/theme/colors.ts` and `src/theme/tokens.ts`.
  > ⚠️ Do not introduce NativeWind, Tailwind, or hardcode hex colors outside the theme files.
- **Secure Storage**: `expo-secure-store` for auth tokens and sensitive data. Do not use AsyncStorage or plain text storage for credentials.
- **Icons & SVGs**: `react-native-svg` custom icons (`AppLoader`, `CheckIcon`, `FilterIconItem`, `DottedConnectorLineItem`, `ProfileIcons`).

---

## 📁 Directory Architecture

```
reserva-driver/
├── src/
│   ├── api/          # Shared Axios client & service API modules (auth, trips, user)
│   ├── components/   # Reusable UI components & custom SVG icons
│   │   ├── ui/       # Core UI tokens (AppButton, AppLoader, CheckIcon, AppBottomSheet, etc.)
│   │   └── ...       # Domain components (bookings, profile, password checklist)
│   ├── hooks/        # Custom React hooks (password validation, auth state)
│   ├── navigation/   # Stack navigators, tab bars, and TypeScript type declarations
│   ├── schemas/      # Zod validation schemas (login, signup, driver forms)
│   ├── screens/      # Application screens:
│   │   ├── auth/     # Login, SignUp, License & Document capture
│   │   └── main/     # Home, Passenger Requests, Trips, Wallet (Earnings), Profile
│   ├── state/        # Global Zustand stores (authStore)
│   └── theme/        # Color palette (`colors.ts`), spacing, typography tokens
├── AGENTS.md                       # AI agent development operating rules
├── API_STANDARDS.md                # API integration & service layer standards
├── UI_STANDARDS.md                 # UI/UX engineering standards
├── MOBILE_DEVELOPMENT_CHECKLIST.md# Engineering checklist & Definition of Done
└── PROJECT_CONTEXT.md              # High-level project context
```

---

## ⚡ Core Features & Domain Modules

1. **Authentication & Onboarding**: Phone authentication with OTP, multi-step registration, driver license capture, document upload verification.
2. **Trip & Schedule Management**: Schedule single/recurring trips, custom weekday selection, advance booking validation.
3. **Passenger Booking Requests**: Real-time request filtering, route passenger grouping, accept/decline workflows.
4. **Wallet & Earnings**: Earnings overview, pending payouts, transaction filtering & search, raise dispute modal.
5. **Profile & Fleet**: Vehicle registration, document status tracking, referral program, 2FA security, preferences.

---

## 🎨 Engineering & UI Standards

- **Loaders & Icons**: Use `AppLoader` (animated rotating gradient spinner) and `CheckIcon` from `src/components/ui` across buttons, cards, and modal states.
- **TextInput Handling**: Fixed-height input containers must set `paddingVertical: 0` and `height: "100%"` on `TextInput` to prevent vertical text cutoff on iOS and Android.
- **Theme Consistency**: Always reference `colors` and `palette` from `src/theme/colors.ts`.
- **API Pattern**: UI components must consume services or custom hooks; direct `axios`/`fetch` calls inside UI components are prohibited.
