import { apiClient } from "../client";

export interface SignupPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  gender: string;
  password: string;
  referralCode?: string;
  userType?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserProfile {
  user: number;
  address_line_1?: string | null;
  full_name: string;
  email: string;
  mfa_enabled?: boolean;
  mfa_method?: string;
  referral_code?: string;
  country?: number;
  dial_code?: string;
  phone_number?: string;
  profile_picture?: string;
  notify_via_email?: boolean;
  notify_in_app?: boolean;
  notify_via_sms?: boolean;
}

export interface UserData {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  gender?: string;
  user_type: string;
  profile?: UserProfile;
  mfa_enabled?: boolean;
  mfa_method?: string;
  is_verified?: boolean;
  date_joined?: string;
}

export interface LoginResponse {
  message?: string;
  access?: string;
  refresh?: string;
  token?: string;
  user?: UserData;
  mfa_required?: boolean;
  [key: string]: unknown;
}

export const authService = {
  signUp: (payload: SignupPayload) => {
    const formData = new FormData();
    formData.append("full_name", payload.fullName);
    formData.append("email", payload.email);
    formData.append("country_code", payload.countryCode);
    formData.append("phone_number", payload.phoneNumber);
    formData.append("password", payload.password);
    formData.append("confirm_password", payload.password);
    formData.append("gender", payload.gender);
    formData.append("user_type", "DRIVER");
    if (payload.referralCode) {
      formData.append("referral_code", payload.referralCode);
    }

    return apiClient.post<{ driverId?: string; id?: string }>("/accounts/register/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  requestOtp: (driverId: string, method: "sms" | "email") =>
    apiClient.post("/auth/otp/request", { driverId, method }),

  verifyOtp: (driverId: string, code: string) =>
    apiClient.post<{ verified: boolean; token?: string }>("/auth/otp/verify", {
      driverId,
      code,
    }),

  loginDriver: (payload: LoginPayload) => {
    const formData = new FormData();
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    return apiClient.post<LoginResponse>("/accounts/login/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  refreshAccessToken: (refresh: string) => {
    return apiClient.post<{ access: string }>("/accounts/token/refresh/", { refresh });
  },

  getProfile: () => {
    return apiClient.get<UserData | { user?: UserData; profile?: UserProfile }>("/accounts/profile/");
  },
};

