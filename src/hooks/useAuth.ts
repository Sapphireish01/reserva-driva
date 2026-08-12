import { useMutation } from "@tanstack/react-query";
import {
  authService,
  LoginPayload,
  LoginResponse,
  SignupPayload,
} from "../api/services/auth";

export const AUTH_KEYS = {
  all: ["auth"] as const,
  user: () => [...AUTH_KEYS.all, "user"] as const,
};

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      const res = await authService.signUp(payload);
      return res.data;
    },
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await authService.loginDriver(payload);
      return res.data;
    },
  });
};

export const useRequestOtpMutation = () => {
  return useMutation({
    mutationFn: async ({
      driverId,
      method,
    }: {
      driverId: string;
      method: "sms" | "email";
    }) => {
      const res = await authService.requestOtp(driverId, method);
      return res.data;
    },
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: async (payload: string | { otp: string; driverId?: string; code?: string }) => {
      const otpCode = typeof payload === "string" ? payload : payload.otp || payload.code || "";
      const res = await authService.verifyOtp(otpCode);
      return res.data;
    },
  });
};
