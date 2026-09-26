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

export interface UpdateProfilePayload {
  full_name?: string;
  email?: string;
  phone_number?: string;
  address_line_1?: string;
  notify_in_app?: boolean;
  notify_via_email?: boolean;
  notify_via_sms?: boolean;
  profile_picture?: string;
  mfa_enabled?: boolean;
  mfa_method?: string;
  [key: string]: unknown;
}

export interface UpdateProfileResponse {
  message?: string;
  data?: UserData | { user?: UserData; profile?: UserProfile };
  [key: string]: unknown;
}

export interface UpdateNotificationSettingsPayload {
  notify_in_app?: boolean;
  notify_via_email?: boolean;
  notify_via_sms?: boolean;
  [key: string]: unknown;
}

export interface UpdateNotificationSettingsResponse {
  success?: string;
  message?: string;
  [key: string]: unknown;
}

export interface UserPreferencesPayload {
  pickup_radius?: number | string;
  distnace_threshold?: number | string;
  distance_threshold?: number | string;
  deviation_radius?: number | string;
  gender_preferences?: string;
  [key: string]: unknown;
}

export interface Setup2FAPayload {
  user_pin: string;
  confirm_pin: string;
}

export interface Setup2FAResponse {
  success?: boolean | string;
  message?: string;
  detail?: string;
  [key: string]: unknown;
}

export interface InitiatePinChangePayload {
  current_pin: string;
}

export interface InitiatePinChangeResponse {
  success?: boolean | string;
  message?: string;
  detail?: string;
  [key: string]: unknown;
}

export interface ConfirmPinChangePayload {
  user_pin: string;
  confirm_pin: string;
}

export interface ConfirmPinChangeResponse {
  success?: boolean | string;
  message?: string;
  detail?: string;
  [key: string]: unknown;
}

export interface Manage2FAResponse {
  success?: boolean | string;
  message?: string;
  detail?: string;
  [key: string]: unknown;
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

export interface Verify2FAResponse {
  success?: boolean;
  verified?: boolean;
  message?: string;
  access?: string;
  refresh?: string;
  user?: UserData;
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

  verifyOtp: (otp: string) => {
    const formData = new FormData();
    formData.append("otp", otp);
    return apiClient.post<{ message?: string; detail?: string }>("/accounts/verify-otp/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  resendOtp: (email: string) => {
    return apiClient.post<{ Success?: string; message?: string }>(
      `/accounts/resend-otp/?email=${encodeURIComponent(email)}`
    );
  },

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

  logout: (refresh?: string) => {
    const formData = new FormData();
    if (refresh) {
      formData.append("refresh", refresh);
    }
    return apiClient.post<{ message?: string }>("/accounts/logout/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getProfile: () => {
    return apiClient.get<UserData | { user?: UserData; profile?: UserProfile }>("/accounts/profile/");
  },

  updateProfile: (payload: UpdateProfilePayload | FormData) => {
    let body: FormData;
    if (payload instanceof FormData) {
      body = payload;
    } else {
      body = new FormData();
      Object.entries(payload).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          const strVal = typeof val === "boolean" ? (val ? "True" : "False") : String(val);
          body.append(key, strVal);
        }
      });
    }
    return apiClient.put<UpdateProfileResponse>("/accounts/profile/", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getPreferences: () => {
    return apiClient.get<UserPreferencesPayload | { data?: UserPreferencesPayload }>("/accounts/profile/preferences/");
  },

  updatePreferences: (payload: UserPreferencesPayload | FormData) => {
    let body: FormData;
    if (payload instanceof FormData) {
      body = payload;
    } else {
      body = new FormData();
      Object.entries(payload).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          body.append(key, String(val));
        }
      });
    }
    return apiClient.put<{ message?: string; data?: UserPreferencesPayload }>(
      "/accounts/profile/preferences/",
      body,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  updateNotificationSettings: (payload: UpdateNotificationSettingsPayload | FormData) => {
    let body: FormData;
    if (payload instanceof FormData) {
      body = payload;
    } else {
      body = new FormData();
      Object.entries(payload).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          const strVal = typeof val === "boolean" ? (val ? "True" : "False") : String(val);
          body.append(key, strVal);
        }
      });
    }
    return apiClient.put<UpdateNotificationSettingsResponse>(
      "/accounts/profile/notifications/",
      body,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  manage2FAStatus: (enabled: boolean) => {
    const body = new FormData();
    body.append("mfa_enabled", enabled ? "True" : "False");
    return apiClient.put<Manage2FAResponse>("/accounts/manage/2fa/", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  setup2FA: (payload: Setup2FAPayload) => {
    const body = new FormData();
    body.append("user_pin", payload.user_pin);
    body.append("confirm_pin", payload.confirm_pin);
    return apiClient.post<Setup2FAResponse>("/accounts/2fa/setup/", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deactivate2FA: () => {
    const body = new FormData();
    return apiClient.post<Setup2FAResponse>("/accounts/2fa/deactivate/", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  initiatePinChange: (payload: InitiatePinChangePayload) => {
    const body = new FormData();
    body.append("current_pin", payload.current_pin);
    return apiClient.post<InitiatePinChangeResponse>("/accounts/2fa/initiate-pin-change/", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  confirmPinChange: (payload: ConfirmPinChangePayload) => {
    const body = new FormData();
    body.append("user_pin", payload.user_pin);
    body.append("confirm_pin", payload.confirm_pin);
    return apiClient.post<ConfirmPinChangeResponse>("/accounts/2fa/confirm-pin-change/", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  verify2FA: (mfaCode: string) => {
    const body = new FormData();
    body.append("mfa_code", mfaCode);
    return apiClient.post<Verify2FAResponse>("/accounts/2fa/verify/", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  requestPasswordReset: (email: string) => {
    const body = new FormData();
    body.append("email", email);
    return apiClient.post<{ message?: string }>("/accounts/password-reset/", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  verifyPasswordResetOtp: (otp: string) => {
    const body = new FormData();
    body.append("otp", otp);
    return apiClient.post<{ message?: string }>("/accounts/password-reset/verify-otp/", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  confirmPasswordReset: (otpCode: string, password: string) => {
    const body = new FormData();
    body.append("user_pin", password);
    body.append("confirm_pin", password);
    body.append("password", password);
    body.append("confirm_password", password);
    return apiClient.post<{ message?: string }>(
      `/accounts/password-reset/confirm/?otp_code=${encodeURIComponent(otpCode)}`,
      body,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  deactivateAccount: () => {
    const body = new FormData();
    return apiClient.post<{ message?: string }>("/accounts/deactivate/", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteAccount: (refresh: string) => {
    const body = new FormData();
    body.append("refresh", refresh);
    return apiClient.post<{ message?: string }>("/accounts/delete/", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};


