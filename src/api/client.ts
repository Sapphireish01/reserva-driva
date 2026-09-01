import axios, { AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "rezarva_driver_token";
const REFRESH_TOKEN_KEY = "rezarva_driver_refresh_token";
const USER_KEY = "rezarva_driver_user_data";
const HAS_SIGNED_IN_BEFORE_KEY = "rezarva_driver_has_signed_in_before";

export const getStoredToken = () => SecureStore.getItemAsync(TOKEN_KEY);
export const setStoredToken = (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token);

export const getStoredRefreshToken = () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
export const setStoredRefreshToken = (token: string) => SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);

export const getHasSignedInBefore = async (): Promise<boolean> => {
  try {
    const val = await SecureStore.getItemAsync(HAS_SIGNED_IN_BEFORE_KEY);
    return val === "true";
  } catch {
    return false;
  }
};

export const setHasSignedInBefore = (hasSignedIn: boolean) =>
  hasSignedIn
    ? SecureStore.setItemAsync(HAS_SIGNED_IN_BEFORE_KEY, "true")
    : SecureStore.deleteItemAsync(HAS_SIGNED_IN_BEFORE_KEY);


export const getStoredUserData = async <T = any>(): Promise<T | null> => {
  try {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUserData = (user: any) =>
  user
    ? SecureStore.setItemAsync(USER_KEY, JSON.stringify(user))
    : SecureStore.deleteItemAsync(USER_KEY);

export const clearStoredTokens = () =>
  Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);

export const clearStoredToken = clearStoredTokens;

export const getJwtExpirationMs = (token: string): number | null => {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const pad = normalized.length % 4;
    const padded = pad ? normalized + "=".repeat(4 - pad) : normalized;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let str = "";
    let bc = 0, bs = 0, buffer = 0;
    for (let idx = 0; idx < padded.length; idx++) {
      buffer = chars.indexOf(padded.charAt(idx));
      if (buffer === -1) continue;
      bc = bs % 4 ? bc * 64 + buffer : buffer;
      if (bs++ % 4) {
        str += String.fromCharCode(255 & (bc >> ((-2 * bs) & 6)));
      }
    }
    const decoded = JSON.parse(str);
    if (decoded && typeof decoded.exp === "number") {
      return decoded.exp * 1000;
    }
  } catch {
    return null;
  }
  return null;
};

const DEFAULT_BASE_URL = "https://drifully-backup.onrender.com";
const DEFAULT_API_KEY = "HaSH7DZv.K8cBHg5XpSa02BkbZ4Y7BBZEwPJUczzu";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_BASE_URL;
const RESERVA_API_KEY = process.env.EXPO_PUBLIC_RESERVA_API_KEY ?? DEFAULT_API_KEY;

export const createApiClient = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": RESERVA_API_KEY,
      "x-api-key": RESERVA_API_KEY,
    },
  });

  instance.interceptors.request.use(async (config) => {
    const token = await getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (RESERVA_API_KEY) {
      config.headers["X-API-Key"] = RESERVA_API_KEY;
      config.headers["x-api-key"] = RESERVA_API_KEY;
    }
    if (__DEV__) {
      const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
      console.log(`🚀 [HTTP ${config.method?.toUpperCase()}] ${fullUrl}`);
      if (config.data) {
        console.log(`📦 [Request Data]`, config.data);
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => {
      if (__DEV__) {
        const fullUrl = `${res.config.baseURL || ""}${res.config.url || ""}`;
        console.log(`✅ [HTTP ${res.status}] ${res.config.method?.toUpperCase()} ${fullUrl}`);
        console.log(`📥 [Response Data]`, res.data);
      }
      return res;
    },
    async (err) => {
      const originalRequest = err?.config;
      const status = err?.response?.status;

      if (__DEV__) {
        const fullUrl = `${originalRequest?.baseURL || ""}${originalRequest?.url || ""}`;
        console.log(`❌ [HTTP ${status || "ERROR"}] ${originalRequest?.method?.toUpperCase()} ${fullUrl}`);
        console.log(`🚨 [Response Error Object]`, err?.response?.data || err?.message);
      }

      // Handle 401 Unauthorized token refresh fallback
      if (status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = await getStoredRefreshToken();
          if (refreshToken) {
            const refreshRes = await axios.post<{ access?: string }>(
              `${baseURL}/accounts/token/refresh/`,
              { refresh: refreshToken },
              {
                headers: {
                  "Content-Type": "application/json",
                  "X-API-Key": RESERVA_API_KEY,
                  "x-api-key": RESERVA_API_KEY,
                },
              }
            );

            const newAccessToken = refreshRes.data?.access;
            if (newAccessToken) {
              await setStoredToken(newAccessToken);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return instance(originalRequest);
            }
          }
        } catch (refreshErr) {
          console.warn("⚠️ Token refresh failed. Clearing tokens.", refreshErr);
          await clearStoredTokens();
        }
      }

      return Promise.reject(err);
    }
  );

  return instance;
};

export const apiClient = createApiClient(API_BASE_URL);
