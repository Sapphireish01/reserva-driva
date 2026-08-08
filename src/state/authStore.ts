import { create } from "zustand";
import {
  clearStoredTokens,
  getJwtExpirationMs,
  getStoredRefreshToken,
  getStoredToken,
  getStoredUserData,
  setStoredRefreshToken,
  setStoredToken,
  setStoredUserData,
} from "../api/client";
import { authService, UserData } from "../api/services/auth";

let activeRefreshTimer: ReturnType<typeof setTimeout> | null = null;

const clearProactiveRefreshTimer = () => {
  if (activeRefreshTimer) {
    clearTimeout(activeRefreshTimer);
    activeRefreshTimer = null;
  }
};

const scheduleProactiveRefresh = (accessToken: string, refreshToken?: string) => {
  clearProactiveRefreshTimer();
  if (!refreshToken) return;

  const expMs = getJwtExpirationMs(accessToken);
  if (!expMs) return;

  // Refresh 2 minutes (120,000 ms) before token expiration
  const leadTimeMs = 2 * 60 * 1000;
  const delay = expMs - Date.now() - leadTimeMs;

  if (delay > 5000) {
    if (__DEV__) {
      console.log(`⏰ [Proactive Auth] Scheduled silent token refresh in ${Math.round(delay / 1000)} seconds.`);
    }
    activeRefreshTimer = setTimeout(async () => {
      try {
        console.log("🔄 [Proactive Auth] Executing pre-expiry token refresh...");
        const res = await authService.refreshAccessToken(refreshToken);
        const newAccess = res.data?.access;
        if (newAccess) {
          await setStoredToken(newAccess);
          console.log("✅ [Proactive Auth] Access token successfully renewed!");
          // Re-schedule for next expiration cycle
          scheduleProactiveRefresh(newAccess, refreshToken);
        }
      } catch (err) {
        console.warn("⚠️ [Proactive Auth] Silent pre-expiry refresh failed. Interceptor will handle fallback.", err);
      }
    }, delay);
  }
};

export const normalizeUserData = (data: any): UserData | null => {
  if (!data) return null;
  const rawUser = (data && typeof data.user === "object" && data.user !== null) ? data.user : data;
  const rawProfile = (rawUser && typeof rawUser.profile === "object" && rawUser.profile !== null)
    ? rawUser.profile
    : (data && typeof data.profile === "object" && data.profile !== null)
      ? data.profile
      : data;

  const full_name =
    rawUser.full_name ||
    rawUser.fullName ||
    rawProfile.full_name ||
    rawProfile.fullName ||
    data.full_name ||
    data.fullName ||
    "";

  const email =
    rawUser.email ||
    rawProfile.email ||
    data.email ||
    "";

  const phone_number =
    rawUser.phone_number ||
    rawUser.phoneNumber ||
    rawProfile.phone_number ||
    rawProfile.phoneNumber ||
    data.phone_number ||
    data.phoneNumber ||
    "";

  const gender =
    rawUser.gender ||
    rawProfile.gender ||
    data.gender ||
    "";

  const profile_picture =
    rawProfile.profile_picture ||
    rawProfile.profilePicture ||
    rawUser.profile_picture ||
    rawUser.profilePicture ||
    data.profile_picture ||
    data.profilePicture ||
    rawUser.avatar ||
    data.avatar ||
    null;

  const address_line_1 =
    rawProfile.address_line_1 !== undefined ? rawProfile.address_line_1 :
    rawProfile.addressLine1 !== undefined ? rawProfile.addressLine1 :
    rawUser.address_line_1 !== undefined ? rawUser.address_line_1 :
    data.address_line_1 !== undefined ? data.address_line_1 :
    null;

  const mfa_enabled = Boolean(
    rawUser.mfa_enabled ??
    rawUser.mfaEnabled ??
    rawProfile.mfa_enabled ??
    rawProfile.mfaEnabled ??
    data.mfa_enabled ??
    data.mfaEnabled ??
    false
  );

  const mfa_method =
    rawUser.mfa_method ||
    rawUser.mfaMethod ||
    rawProfile.mfa_method ||
    rawProfile.mfaMethod ||
    data.mfa_method ||
    data.mfaMethod ||
    (mfa_enabled ? "2FA_PIN" : undefined);

  const dial_code =
    rawProfile.dial_code ||
    rawProfile.dialCode ||
    rawUser.dial_code ||
    rawUser.dialCode ||
    data.dial_code ||
    data.dialCode ||
    "+1";

  const userId =
    typeof rawUser.id === "number"
      ? rawUser.id
      : typeof rawProfile.user === "number"
      ? rawProfile.user
      : typeof data.user === "number"
      ? data.user
      : 0;

  return {
    id: userId,
    full_name,
    email,
    phone_number,
    gender,
    user_type: rawUser.user_type || rawUser.userType || data.user_type || "DRIVER",
    is_verified: rawUser.is_verified ?? rawUser.isVerified ?? data.is_verified ?? true,
    mfa_enabled,
    mfa_method,
    date_joined: rawUser.date_joined || rawUser.dateJoined || data.date_joined,
    profile: {
      user: userId,
      full_name,
      email,
      phone_number,
      dial_code,
      country: rawProfile.country || data.country,
      address_line_1,
      profile_picture,
      mfa_enabled,
      mfa_method,
      notify_in_app: rawProfile.notify_in_app ?? data.notify_in_app ?? true,
      notify_via_email: rawProfile.notify_via_email ?? data.notify_via_email ?? true,
      notify_via_sms: rawProfile.notify_via_sms ?? data.notify_via_sms ?? false,
      referral_code: rawProfile.referral_code || rawProfile.referralCode || data.referral_code,
    },
  };
};

interface AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  user: UserData | null;
  initializeAuth: () => Promise<void>;
  fetchProfile: () => Promise<UserData | null>;
  login: (accessToken: string, refreshToken?: string, user?: any) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isInitializing: true,
  user: null,

  fetchProfile: async () => {
    try {
      console.log("🌐 [Profile Fetch] Fetching latest user profile from API...");
      const res = await authService.getProfile();
      const normalized = normalizeUserData(res.data);
      if (normalized) {
        await setStoredUserData(normalized);
        set({ user: normalized });
        console.log("✅ [Profile Fetch] User profile successfully synced!", normalized.full_name);
        return normalized;
      }
    } catch (err) {
      console.warn("⚠️ [Profile Fetch] Background profile sync skipped/failed:", err);
    }
    return null;
  },

  initializeAuth: async () => {
    try {
      const [token, refreshToken, storedUserRaw] = await Promise.all([
        getStoredToken(),
        getStoredRefreshToken(),
        getStoredUserData<any>(),
      ]);

      const storedUser = normalizeUserData(storedUserRaw);

      if (token) {
        if (refreshToken) {
          scheduleProactiveRefresh(token, refreshToken);
        }
        set({ isAuthenticated: true, user: storedUser, isInitializing: false });

        // Silently refresh profile from server in background
        get().fetchProfile().catch(() => {});
      } else {
        set({ isAuthenticated: false, user: null, isInitializing: false });
      }
    } catch (err) {
      console.warn("⚠️ Failed to initialize auth store:", err);
      set({ isAuthenticated: false, user: null, isInitializing: false });
    }
  },

  login: async (accessToken, refreshToken, rawUser) => {
    await setStoredToken(accessToken);
    if (refreshToken) {
      await setStoredRefreshToken(refreshToken);
      scheduleProactiveRefresh(accessToken, refreshToken);
    }
    const normalized = normalizeUserData(rawUser);
    if (normalized) {
      await setStoredUserData(normalized);
    }
    set({ isAuthenticated: true, user: normalized || null });

    // Fetch freshest user profile after login
    get().fetchProfile().catch(() => {});
  },

  logout: async () => {
    clearProactiveRefreshTimer();
    await clearStoredTokens();
    set({ isAuthenticated: false, user: null });
  },

  setUser: async (rawUser) => {
    const normalized = normalizeUserData(rawUser);
    await setStoredUserData(normalized);
    set({ user: normalized });
  },
}));

// Helper selector functions for convenient UI consumption
export const getUserFullName = (user: any): string => {
  if (!user) return "";
  return (
    user.full_name ||
    user.fullName ||
    user.profile?.full_name ||
    user.profile?.fullName ||
    ""
  );
};

export const getUserFirstName = (user: any): string => {
  const fullName = getUserFullName(user);
  if (!fullName) return "";
  return fullName.trim().split(" ")[0];
};

export const getUserEmail = (user: any): string => {
  if (!user) return "";
  return user.email || user.profile?.email || "";
};

export const getUserPhone = (user: any): string => {
  if (!user) return "";
  const dialCode =
    user.profile?.dial_code || user.profile?.dialCode ? `${user.profile?.dial_code || user.profile?.dialCode} ` : "";
  const phone =
    user.phone_number || user.phoneNumber || user.profile?.phone_number || user.profile?.phoneNumber || "";
  return `${dialCode}${phone}`.trim();
};

export const getUserAddress = (user: any): string => {
  if (!user) return "";
  return (
    user.profile?.address_line_1 ||
    user.profile?.addressLine1 ||
    user.address_line_1 ||
    user.addressLine1 ||
    ""
  );
};

export const getUserAvatar = (user: any): string | null => {
  if (!user) return null;
  return (
    user.profile?.profile_picture ||
    user.profile?.profilePicture ||
    user.profile_picture ||
    user.profilePicture ||
    user.avatar ||
    null
  );
};

export const getUserMfaEnabled = (user: any): boolean => {
  if (!user) return false;
  if (user.mfa_enabled !== undefined) return Boolean(user.mfa_enabled);
  if (user.mfaEnabled !== undefined) return Boolean(user.mfaEnabled);
  if (user.profile?.mfa_enabled !== undefined) return Boolean(user.profile.mfa_enabled);
  if (user.profile?.mfaEnabled !== undefined) return Boolean(user.profile.mfaEnabled);
  return false;
};

export const getUserNotificationSettings = (user: any) => {
  if (!user) {
    return { notify_in_app: true, notify_via_email: true, notify_via_sms: false };
  }
  const rawProfile = user.profile || user;
  return {
    notify_in_app: Boolean(rawProfile.notify_in_app ?? rawProfile.notifyInApp ?? user.notify_in_app ?? user.notifyInApp ?? true),
    notify_via_email: Boolean(rawProfile.notify_via_email ?? rawProfile.notifyViaEmail ?? user.notify_via_email ?? user.notifyViaEmail ?? true),
    notify_via_sms: Boolean(rawProfile.notify_via_sms ?? rawProfile.notifyViaSms ?? user.notify_via_sms ?? user.notifyViaSms ?? false),
  };
};


