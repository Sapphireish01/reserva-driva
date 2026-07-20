import { apiClient } from "../client";

export interface SignupPayload {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
  referralCode?: string;
}

export const authService = {
  signUp: (payload: SignupPayload) =>
    apiClient.post<{ driverId: string }>("/auth/signup", payload),

  requestOtp: (driverId: string, method: "sms" | "email") =>
    apiClient.post("/auth/otp/request", { driverId, method }),

  verifyOtp: (driverId: string, code: string) =>
    apiClient.post<{ verified: boolean; token?: string }>("/auth/otp/verify", {
      driverId,
      code,
    }),
};
