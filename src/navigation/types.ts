export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  ForgotPasswordOTP: { email: string };
  ResetPassword: { email: string };
  SignUp: undefined;
  VerificationMethod: { driverId: string };
  OTPVerification: { driverId: string; method: "sms" | "email" };
  LicenseIntro: { driverId: string };
  LicenseFrontCapture: { driverId: string };
  LicenseBackCapture: { driverId: string; frontUri: string };
  LicenseVerifying: { driverId: string; frontUri: string; backUri: string };
  SSN: { driverId: string };
  AccountCreated: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  TripsTab: undefined;
  BookingsTab: undefined;
  WalletTab: undefined;
  ProfileTab: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  CreateTrip: undefined;
  PassengerRequests: { tripId?: string } | undefined;
  Earnings: undefined;
  Settings: undefined;
  ProfileDetails: undefined;
  Notifications: undefined;
  EmergencyContacts: undefined;
  ReportProblem: undefined;
  TwoFactorAuth: undefined;
  ContactUs: undefined;
  ChatWithSupport: undefined;
  Vehicles: undefined;
  BankDetails: undefined;
  Preferences: undefined;
  Referrals: undefined;
  EditName: { currentName: string };
  EditEmail: { currentEmail: string };
  EditPhone: { currentPhone: string };
};


// Server-driven signup stage — mirrors the backend's `signup_stage` field.
// Used by useSignupProgress to resume the flow after app relaunch.
export type SignupStage =
  | "created"
  | "otp_verified"
  | "license_pending"
  | "license_verified"
  | "ssn_verified"
  | "active";
