# rezarva Driver 🚗💨

**rezarva Driver** is the official mobile application built for drivers on the rezarva carpooling and ride-sharing network. Designed for speed, clarity, and ease of use, rezarva Driver empowers drivers to post scheduled routes, manage passenger seat requests, track real-time earnings, and complete identity verification.

---

## 🌟 Key Features

### 🚘 Trip Scheduling & Queue Management
* **Post New Routes**: Easily schedule upcoming trips by selecting pickup points, destinations, departure dates/times, available seat counts, and pricing per seat.
* **Interactive Trip Queue**: View active trips with `Ready To Go` and `Up Next` status badges, complete route timelines, departure countdowns, and quick trip start triggers.

### 📩 Passenger Request Approval
* **Real-time Rider Requests**: Receive instant booking requests from verified passengers traveling along your route.
* **Rider Profiles & Ratings**: Inspect passenger names, star ratings, trip schedules, and pickup/dropoff locations before accepting.
* **One-Tap Actions**: Approve or decline ride requests with single-tap controls.

### 💰 Earnings & Financial Insights
* **Available Balance Hero**: View current available earnings and track daily, weekly, and lifetime income.
* **Instant Cash Out**: Initiate instant transfers to your linked bank account or rely on automatic weekly ACH deposits.
* **Driver Performance Metrics**: Monitor your acceptance rate, total completed trips, and driver rating.

### 🛡️ Driver Onboarding & Identity Verification
* **Multi-Stage Verification**: Smooth onboarding flow guiding new drivers through OTP verification, driver's license front/back photo capture, and SSN background check submission.
* **Resume Progress**: Server-driven stage persistence allowing drivers to resume signup right where they left off.

### 🎨 Design & Accessibility
* **Curated Color System**: Full HSL color palette featuring Neutral, Slate, Success, Warning, Information, and Error tokens.
* **Custom Navigation**: Tailored bottom navigation bar featuring bespoke vector SVG icons and active state indicators.
* **Native Edge-to-Edge**: Android & iOS status bar padding and safe-area inset management for notch, punch hole, and dynamic island displays.

---

## 🛠️ Tech Stack & Architecture

* **Core Framework**: [React Native](https://reactnative.dev) (v0.81) with [Expo](https://expo.dev) (v54)
* **Navigation**: [React Navigation v7](https://reactnavigation.org) (Native Stack & Bottom Tabs)
* **State Management**: [Zustand](https://github.com/pmndrs/zustand)
* **Data Fetching & Caching**: [TanStack React Query v5](https://tanstack.com/query)
* **Forms & Validation**: [React Hook Form](https://react-hook-form.com) & [Zod](https://zod.dev)
* **Icons & Graphics**: [React Native SVG](https://github.com/software-mansion/react-native-svg)

---

## 🚀 Getting Started

### Prerequisites

* **Node.js** (v18 or higher)
* **npm** or **yarn**
* **Expo Go** app on your physical device, or an iOS Simulator / Android Emulator.

### Installation

1. **Clone the repository** (or navigate to the workspace directory):

   ```bash
   git clone git@github-personal:Sapphireish01/rezarva-driva.git
   cd rezarva-driver
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the Expo development server**:

   ```bash
   npx expo start
   ```

4. **Run on your target environment**:
   * Press `a` for **Android emulator**.
   * Press `i` for **iOS simulator**.
   * Scan the QR code using the **Expo Go** app on Android or Camera app on iOS.

---

## 📁 Project Structure

```text
├── app/                    # Expo Router layout & page routes
│   └── _layout.tsx         # Root layout, font loader & QueryClientProvider
├── assets/                 # SVGs, icons, onboarding illustrations
│   ├── icons/              # Custom navigation vector icons (bookings.svg, wallet.svg)
│   └── onboarding/         # Onboarding slide images
├── src/
│   ├── api/                # API client & domain service calls (auth, drivers, trips)
│   ├── components/         # Shared UI components (NavIcons, OTPCodeInput, PasswordRules)
│   ├── hooks/              # Custom React hooks (useSignupProgress, useCountdown)
│   ├── navigation/         # App routing (RootNavigator, AuthNavigator, MainNavigator, types)
│   ├── schemas/            # Zod validation schemas
│   ├── screens/
│   │   ├── auth/           # Onboarding & signup flow screens (SignUp, OTP, License, SSN)
│   │   └── main/           # Main driver app screens (Home, CreateTrip, PassengerRequests, Earnings)
│   ├── state/              # Global state stores (authStore)
│   └── theme/              # Design system tokens (palette, spacing, typography)
├── app.json                # Expo project configuration
└── index.js                # App entry point (expo-router/entry)
```
