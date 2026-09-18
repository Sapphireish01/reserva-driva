export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  ForgotPasswordOTP: { email: string };
  ResetPassword: { email: string; otpCode: string };
  SignUp: undefined;
  VerificationMethod: { driverId: string };
  OTPVerification: { driverId: string; method: "sms" | "email" };
  LicenseIntro: { driverId: string };
  LicenseFrontCapture: { driverId: string };
  LicenseBackCapture: { driverId: string; frontUri: string };
  LicenseVerifying: { driverId: string; frontUri: string; backUri: string };
  SSN: { driverId: string };
  MFAVerification: { email?: string };
  AccountCreated: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  TripsTab: undefined;
  BookingsTab: undefined;
  WalletTab: undefined;
  ProfileTab: undefined;
};

export interface TransactionItem {
  id: string;
  reference_id?: string;
  pickup?: string;
  destination?: string;
  seatsBooked?: number;
  amount: string;
  currency?: string;
  status: "Pending" | "Completed" | "Failed" | string;
  dateTime?: string;
  date?: string;
  time?: string;
  bookingDate?: string;
  transactionId: string;
  customerName?: string;
  resolution_notes?: string | null;
}

export type MainStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  CreateTrip: undefined;
  PassengerRequests: { tripId?: string } | undefined;
  Earnings: undefined;
  TransactionDetails: { transaction: TransactionItem };
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
  FAQs: undefined;
  EditName: { currentName: string };
  EditEmail: { currentEmail: string };
  EditPhone: { currentPhone: string };
  ActiveTrip: { tripId?: string; trip?: any } | undefined;
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
